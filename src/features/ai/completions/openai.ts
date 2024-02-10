import OpenAI from 'openai'
import type { FastifyReply, FastifyRequest } from 'fastify'
import destr from 'destr'
import { getConfig } from '../../../utils/env.util'
import type { RaycastCompletions } from '../../../types/raycast/completions'
import { getFunctionCallToolsConfig } from '../functionsCall'
import { Debug } from '../../../utils/log.util'
import { AvailableFunctions } from '../functionsCall/constants'

export async function OpenAIChatCompletion(request: FastifyRequest, reply: FastifyReply) {
  const aiConfig = getConfig('ai')
  const openaiConfig = getConfig('ai')?.openai
  const openai = new OpenAI({
    baseURL: openaiConfig?.baseUrl,
    apiKey: openaiConfig?.apiKey,
  })

  const body = request.body as RaycastCompletions

  const openai_message = []
  let temperature = openaiConfig?.temperature || aiConfig?.temperature || 0.5
  const messages = body.messages
  for (const message of messages) {
    if ('system_instructions' in message.content) {
      openai_message.push(
        {
          role: 'system',
          content: message.content.system_instructions,
        },
      )
    }

    if ('command_instructions' in message.content) {
      openai_message.push(
        {
          role: 'system',
          content: message.content.command_instructions,
        },
      )
    }

    if ('additional_system_instructions' in body) {
      openai_message.push(
        {
          role: 'system',
          content: body.additional_system_instructions,
        },
      )
    }

    if ('text' in message.content) {
      openai_message.push(
        {
          role: message.author,
          content: message.content.text,
        },
      )
    }

    if ('temperature' in message.content)
      temperature = message.content.temperature
  }
  const stream = await openai.chat.completions.create({
    stream: true,
    messages: openai_message as any,
    model: body.model,
    temperature,
    stop: null,
    n: 1,
    tools: getFunctionCallToolsConfig(),
    tool_choice: 'auto',
    max_tokens: openaiConfig?.maxTokens || aiConfig?.maxTokens,
  }).catch((err) => {
    throw new Error(`[AI] OpenAI Chat Completions Failed: ${err}`)
  })

  if (stream instanceof Error)
    throw new Error(`[AI] OpenAI Chat Completions Failed: ${stream}`)

  return reply.sse((async function * source() {
    try {
      let queryToolName = ''
      let queryToolCallID = ''
      let queryHandler: Function = () => {}
      const queryPrompts: Record<string, any>[] = []
      const queryParts = []
      for await (const data of stream) {
        const { choices: [{ delta: { content, tool_calls }, finish_reason }] } = data

        if (!content && !finish_reason)
          continue // ignore this line

        // Handle tool calls
        if (tool_calls) {
          const tool_call = tool_calls[0]
          if (tool_call) {
            queryToolCallID = tool_call.id!
            queryToolName = tool_call.function?.name || ''
            Debug.info(`[AI] OpenAI Chat Completions Tool Call: ${queryToolName} - ${queryToolCallID}`)
            if (tool_call.function?.arguments)
              queryParts.push(tool_call.function?.arguments)
            // console.log('queryParts', queryParts)
          }
        }

        const res: Record<string, unknown> = { text: content || '' }
        if (finish_reason) {
          res.finish_reason = finish_reason

          // Handle tool calls
          if (finish_reason === 'tool_calls') {
            const tool = AvailableFunctions[queryToolName]
            if (tool) {
              yield { data: JSON.stringify({ notification: tool.notifications.calls?.text || '' }), notification_type: tool.notifications.calls?.type || 'tool_used' }
              queryHandler = tool.handler
              queryPrompts.push(...tool.prompts || [])
            }
            const queryWords = destr<any>(queryParts.join(''))
            openai_message.push(
              {
                role: 'assistant',
                content: null,
                tool_calls: [
                  {
                    id: queryToolCallID,
                    type: 'function',
                    function: {
                      name: queryToolName,
                      arguments: queryParts,
                    },
                  },
                ],
              },
            )
            // Call the handler
            const handlerRes = await queryHandler(queryWords)
            yield { data: JSON.stringify(handlerRes) }
            openai_message.push(
              {
                role: 'tool',
                content: JSON.stringify(handlerRes),
                tool_call_id: queryToolCallID,
              },
            )
            queryPrompts.forEach((prompt) => {
              openai_message.push(prompt)
            })

            continue
          }

          yield { data: JSON.stringify({
            text: '',
            finish_reason,
          }) }
        }

        yield { data: JSON.stringify(res) }
      }
    }
    catch (e: any) {
      console.error('Error: ', e.message)
      const res = {
        text: '',
        finish_reason: e.message,
      }
      yield { data: JSON.stringify(res) }
    }
    finally {
      const res = {
        text: '',
        finish_reason: 'stop',
      }
      yield { data: JSON.stringify(res) }
    }
  })())
}

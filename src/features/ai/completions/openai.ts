import OpenAI from 'openai'
import { AzureKeyCredential, type ChatCompletions, type EventStream, OpenAIClient } from '@azure/openai'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ChatCompletionChunk } from 'openai/resources/index.mjs'
import type { Stream } from 'openai/streaming.mjs'
import { getConfig } from '../../../utils/env.util'
import type { RaycastCompletions } from '../../../types/raycast/completions'

export async function OpenAIChatCompletion(request: FastifyRequest, reply: FastifyReply) {
  const aiConfig = getConfig('ai')
  const openaiConfig = getConfig('ai')?.openai

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

  let stream: Stream<ChatCompletionChunk> | EventStream<ChatCompletions>

  if (openaiConfig?.isAzure) {
    const azureOpenai = new OpenAIClient(
      openaiConfig!.baseUrl!,
      new AzureKeyCredential(openaiConfig!.apiKey!),
    )
    stream = await azureOpenai.streamChatCompletions(
      openaiConfig.azureDeploymentName || body.model,
      openai_message as any,
      {
        n: 1,
        temperature,
        maxTokens: openaiConfig?.maxTokens || aiConfig?.maxTokens,
      },
    ).catch((err) => {
      throw new Error(`[AI] Azure OpenAI Chat Completions Failed: ${err?.message}`)
    })
  }
  else {
    const openai = new OpenAI({
      baseURL: openaiConfig?.baseUrl,
      apiKey: openaiConfig?.apiKey,
    })

    stream = await openai.chat.completions.create({
      stream: true,
      messages: openai_message as any,
      model: body.model,
      temperature,
      stop: null,
      n: 1,
      max_tokens: openaiConfig?.maxTokens || aiConfig?.maxTokens,
    }).catch((err) => {
      throw new Error(`[AI] OpenAI Chat Completions Failed: ${err}`)
    })
  }

  if (stream instanceof Error)
    throw new Error(`[AI] OpenAI Chat Completions Failed: ${stream}`)

  return reply.sse((async function* source() {
    try {
      for await (const data of stream) {
        const choice = data.choices[0]
        if (!choice)
          continue

        const content = choice.delta?.content
        let finish_reason

        if ('finish_reason' in choice)
          finish_reason = choice.finish_reason
        else
          finish_reason = choice.finishReason

        if (!content && !finish_reason)
          continue // ignore this line

        const res: Record<string, unknown> = { text: content || '' }
        if (finish_reason)
          res.finish_reason = finish_reason

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

import OpenAI from 'openai'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAIConfig } from '../../../utils/env.util'

const openai = new OpenAI({
  baseURL: getAIConfig().type === 'custom' ? getAIConfig().endpoint : undefined,
  apiKey: getAIConfig().key,
})

export async function OpenAIChatCompletion(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    additional_system_instructions: string
    model: string
    temperature: number
    messages: {
      content: {
        system_instructions: string
        command_instructions: string
        text: string
        temperature: number
        [key: string]: string | number
      }
      author: 'user' | 'assistant'
    }[]
  }

  const openai_message = []
  let temperature = Number(getAIConfig().temperature || 0.5)
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
    max_tokens: getAIConfig().max_tokens ? Number(getAIConfig().max_tokens) : undefined,
  })

  return reply.sse((async function * source() {
    try {
      for await (const data of stream) {
        const { choices: [{ delta: { content }, finish_reason }] } = data

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

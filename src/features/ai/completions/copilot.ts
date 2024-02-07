import type { FastifyReply, FastifyRequest } from 'fastify'
import destr from 'destr'
import consola from 'consola'
import { generateCopilotRequestHeader, getAuthFromToken } from '../../../services/copilot'
import { getAIConfig } from '../../../utils/env.util'
import { copilotClient } from '../../../utils'
import { processStream } from '../../../utils/stream-reader.util'

const completions = '/chat/completions'

export async function CopilotChatCompletion(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    additional_system_instructions: string
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

  const app_token = getAIConfig().key
  if (!app_token) {
    consola.error(`[Copilot] Auth error: Missing token`)
    throw new Error('Unauthorized. Missing token')
  }

  try {
    await getAuthFromToken(app_token)
  }
  catch (e: any) {
    consola.error(`[Copilot] Auth error: ${e.message}.`)
    throw new Error(`Unauthorized. Invalid token. ${e.message}`)
  }

  let temperature = Number(getAIConfig().temperature || 0.5)
  const requestBody = {
    messages: [] as any[],
    model: 'gpt-4',
    temperature,
    top_p: 1,
    n: 1,
    stream: true,
  }
  const headers = generateCopilotRequestHeader(app_token, true) as Record<string, string>
  const messages = body.messages
  for (const message of messages) {
    if ('system_instructions' in message.content) {
      requestBody.messages.push(
        {
          role: 'system',
          content: message.content.system_instructions,
        },
      )
    }

    if ('command_instructions' in message.content) {
      requestBody.messages.push(
        {
          role: 'system',
          content: message.content.command_instructions,
        },
      )
    }

    if ('additional_system_instructions' in body) {
      requestBody.messages.push(
        {
          role: 'system',
          content: body.additional_system_instructions,
        },
      )
    }

    if ('text' in message.content) {
      requestBody.messages.push(
        {
          role: message.author,
          content: message.content.text,
        },
      )
    }

    if ('temperature' in message.content)
      temperature = message.content.temperature
  }

  const res = await copilotClient(completions, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  })
    .catch((e: any) => {
      consola.error(`[Copilot] Request error: ${e.message}.`)
      throw new Error(`Request error: ${e.message}`)
    })

  if (res instanceof Error)
    throw new Error(`[Copilot] Request error: ${res.message}`)

  const stream = processStream(res).stream as any

  return reply.sse((async function * source() {
    try {
      for await (const data of stream) {
        const json = destr(data) as any
        const res = {
          text: json.choices[0]?.delta.content || '',
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

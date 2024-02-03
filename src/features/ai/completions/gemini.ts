import { GoogleGenerativeAI } from '@google/generative-ai'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAIConfig } from '../../../utils/env.util'

const genAI = new GoogleGenerativeAI(getAIConfig().key)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function GeminiChatCompletion(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    additional_system_instructions: string
    temperature: number
    messages: {
      content: {
        system_instructions: string
        command_instructions: string
        text: string
        temperature: number
      }
      author: 'user' | 'assistant'
    }[]
  }
  let system_message = ''
  const google_message = []
  let temperature = Number(getAIConfig().temperature)
  const messages = body.messages
  for (const message of messages) {
    if ('system_instructions' in message.content)
      system_message += `${message.content.system_instructions}\n`

    if ('command_instructions' in message.content)
      system_message += `${message.content.command_instructions}\n`

    if ('additional_system_instructions' in body)
      system_message += `${body.additional_system_instructions}\n`

    if ('text' in message.content) {
      google_message.push({
        role: message.author === 'user' ? 'user' : 'model',
        parts: message.content.text,
      })
    }
    if ('temperature' in message.content)
      temperature = message.content.temperature
  }
  let msg = google_message.pop()!.parts
  if (!(google_message.length > 0)) { // if there is no message, and it's the first message
    msg = `${system_message}\n\n${msg}`
  }
  // const result = await model.generateContentStream(system_message)
  const chat = model.startChat({
    history: google_message,
    generationConfig: {
      temperature,
      maxOutputTokens: getAIConfig().max_tokens ? Number(getAIConfig().max_tokens) : undefined,
      candidateCount: 1,
    },
  })
  const result = await chat.sendMessageStream(msg)
  return reply.sse((async function * source() {
    try {
      for await (const data of result.stream) {
        const res = {
          text: data.text(),
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
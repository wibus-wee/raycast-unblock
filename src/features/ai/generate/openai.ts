import OpenAI from 'openai'
import { getConfig } from '../../../utils/env.util'
import type { AIGenerateContent } from '../../../types/internal/ai-generate-content'

export async function OpenaiGenerateContent(prompt: {
  role: string
  content: string
}[], model?: string): Promise<AIGenerateContent> {
  const aiConfig = getConfig('ai')
  const openaiConfig = getConfig('ai')?.openai
  const openai = new OpenAI({
    baseURL: openaiConfig?.baseUrl,
    apiKey: openaiConfig?.apiKey,
  })

  const message = []
  for (const m of prompt) {
    message.push({
      role: m.role,
      content: m.content,
    })
  }

  const result = await openai.chat.completions.create({
    stream: false,
    messages: message as any,
    temperature: openaiConfig?.temperature || aiConfig?.temperature || 0.5,
    stop: null,
    n: 1,
    max_tokens: openaiConfig?.maxTokens || aiConfig?.maxTokens,
    model: model || 'gpt-3.5-turbo',
  }).catch((err) => {
    throw new Error(`[AI] OpenAI Chat Completions Failed: ${err}`)
  })

  if (result instanceof Error)
    throw new Error(`[AI] OpenAI Chat Completions Failed: ${result}`)

  const text = result.choices[0].message.content!
  const split = text.split('\n')
  const detectedSourceLanguage = split[0]
  const translatedText = split[1]

  return {
    content: translatedText,
    detectedSourceLanguage,
  }
}

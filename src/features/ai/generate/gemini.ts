import { GoogleGenerativeAI } from '@google/generative-ai'
import { getConfig } from '../../../utils/env.util'
import type { AIGenerateContent } from '../../../types/internal/ai-generate-content'

export async function GeminiGenerateContent(msg: string): Promise<AIGenerateContent> {
  const aiConfig = getConfig('ai')
  const config = getConfig('ai')?.gemini
  const genAI = new GoogleGenerativeAI(config?.apiKey || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const temperature = config?.temperature || aiConfig?.temperature || 0.5
  model.generationConfig = {
    ...model.generationConfig,
    candidateCount: 1,
    maxOutputTokens: config?.maxTokens || aiConfig?.maxTokens,
    temperature,
  }
  const result = await model.generateContent(msg).catch((err) => {
    throw new Error(`[AI] Gemini Chat Completions Failed: ${err}`)
  })
  if (result instanceof Error)
    throw new Error(`[AI] Gemini Chat Completions Failed: ${result}`)
  const response = result.response
  const text = response.text()
  return {
    content: text,
  }
}

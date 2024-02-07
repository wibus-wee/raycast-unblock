import type { FastifyRequest } from 'fastify'
import { GeminiGenerateContent } from '../ai/generate/gemini'
import { getAIConfig } from '../../utils/env.util'
import { OpenaiGenerateContent } from '../ai/generate/openai'
import { CopilotGenerateContent } from '../ai/generate/copilot'
import type { TranslateFrom, TranslateTo } from '../../types/raycast/translate'
import { generateTranslationsPrompts } from './prompts'

export async function TranslateWithAI(request: FastifyRequest): Promise<TranslateTo> {
  const body = request.body as TranslateFrom
  const prompts = generateTranslationsPrompts(body.target, body.q, getAIConfig().type)
  let content
  switch (getAIConfig().type) {
    case 'gemini':
      content = await GeminiGenerateContent(prompts)
      break
    case 'openai':
      content = await OpenaiGenerateContent(prompts)
      break
    case 'copilot':
      content = await CopilotGenerateContent(prompts)
      break
    default:
      content = await OpenaiGenerateContent(prompts)
      break
  }

  const res = {
    data: {
      translations: [
        {
          translatedText: content.content,
        },
      ],
    },
  } as TranslateTo

  if (content.detectedSourceLanguage)
    res.data.translations[0].detectedSourceLanguage = content.detectedSourceLanguage

  return res
}

import consola from 'consola'
import { generateCopilotRequestHeader, getAuthFromToken } from '../../../services/copilot'
import { getConfig } from '../../../utils/env.util'
import { copilotClient } from '../../../utils'
import type { AIGenerateContent } from '../../../types/internal/ai-generate-content'

const completions = '/chat/completions'

export async function CopilotGenerateContent(prompt: {
  role: string
  content: string
}[], msg?: string): Promise<AIGenerateContent> {
  const aiConfig = getConfig('ai')
  const config = getConfig('ai')?.copilot

  const messages = []
  for (const m of prompt) {
    messages.push({
      role: m.role,
      content: m.content,
    })
  }
  if (msg) {
    messages.push({
      role: 'system',
      content: msg,
    })
  }

  const app_token = config?.apiKey
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

  const temperature = config?.temperature || aiConfig?.temperature || 0.5
  const requestBody = {
    messages,
    model: config.default || 'gpt-4',
    temperature,
    top_p: 1,
    n: 1,
    stream: false,
    max_tokens: config?.maxTokens || aiConfig?.maxTokens,
  }
  const headers = generateCopilotRequestHeader(app_token, false) as Record<string, string>
  if (headers === null)
    throw new Error('[Copilot] Request error: Could not generate request headers.')

  const result = await copilotClient(completions, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  }).catch((e: any) => {
    consola.error(`[Copilot] Request error: ${e.message}.`)
    throw new Error(`Request error: ${e.message}`)
  })

  if (result instanceof Error)
    throw new Error(`[Copilot] Request error: ${result.message}`)

  const text = result.choices[0].message.content
  const split = text.split('\n')
  const detectedSourceLanguage = split[0]
  const translatedText = split[1]

  return {
    content: translatedText,
    detectedSourceLanguage,
  }
}

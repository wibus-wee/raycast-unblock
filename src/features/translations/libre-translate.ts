import type { FastifyRequest } from 'fastify'
import { TranslateWithLibreTranslateReverseAPI } from '../../services/libre-translate/reverse'
import { FetchLibreTranslateAPI } from '../../services/libre-translate'
import type { TranslateFrom, TranslateTo } from '../../types/raycast/translate'
import { getConfig } from '../../utils/env.util'

export async function TranslateWithLibreTranslate(request: FastifyRequest): Promise<TranslateTo> {
  const body = request.body as TranslateFrom
  const config = getConfig('translate')?.libreTranslate
  let content
  switch (config?.type?.toLowerCase() || 'reverse') {
    case 'reverse':
      content = await TranslateWithLibreTranslateReverseAPI(body.q, body.source, body.target)
      break
    case 'api':
      content = await FetchLibreTranslateAPI(body.q, body.source, body.target, config?.baseUrl, config?.apiKey)
      break
    default:
      content = await TranslateWithLibreTranslateReverseAPI(body.q, body.source, body.target)
      break
  }
  const res = {
    data: {
      translations: [
        {
          translatedText: content.translatedText,
        },
      ],
    },
  } as TranslateTo
  return res
}

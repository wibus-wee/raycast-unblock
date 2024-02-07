import process from 'node:process'
import type { FastifyRequest } from 'fastify'
import { TranslateWithLibreTranslateReverseAPI } from '../../services/libre-translate/reverse'
import { FetchLibreTranslateAPI } from '../../services/libre-translate'
import type { TranslateFrom, TranslateTo } from '../../types/raycast/translate'

export async function TranslateWithLibreTranslate(request: FastifyRequest): Promise<TranslateTo> {
  const body = request.body as TranslateFrom
  let content
  switch (process.env.LIBRE_TRANSLATE_TYPE) {
    case 'reverse':
      content = await TranslateWithLibreTranslateReverseAPI(body.q, body.source, body.target)
      break
    case 'api':
      content = await FetchLibreTranslateAPI(body.q, body.source, body.target, process.env.LIBRE_TRANSLATE_API_KEY)
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

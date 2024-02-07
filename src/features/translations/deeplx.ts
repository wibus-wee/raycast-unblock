import type { FastifyRequest } from 'fastify'
import { query } from '@ifyour/deeplx'
import type { SourceLang, TargetLang } from '@ifyour/deeplx/dist/types'
import type { TranslateFrom, TranslateTo } from '../../types/raycast/translate'
import { getConfig } from '../../utils/env.util'

export async function TranslateWithDeepLX(request: FastifyRequest): Promise<TranslateTo> {
  const body = request.body as TranslateFrom
  const config = getConfig('translate')?.deepLX
  const res = await query({
    text: body.q,
    source_lang: body.source as SourceLang,
    target_lang: body.target as TargetLang,
  }, {
    proxyEndpoint: config?.proxyEndpoint,
    customHeader: {
      ...(config?.accessToken) && {
        Authorization: `Bearer ${config.accessToken}`,
      },
    },
  })
  return {
    data: {
      translations: [
        {
          translatedText: res.data || '',
        },
      ],
    },
  }
}

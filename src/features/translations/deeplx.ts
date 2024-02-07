import process from 'node:process'
import type { FastifyRequest } from 'fastify'
import { query } from '@ifyour/deeplx'
import type { SourceLang, TargetLang } from '@ifyour/deeplx/dist/types'
import type { TranslateFrom, TranslateTo } from '../../types/raycast/translate'

export async function TranslateWithDeepLX(request: FastifyRequest): Promise<TranslateTo> {
  const body = request.body as TranslateFrom
  const res = await query({
    text: body.q,
    source_lang: body.source as SourceLang,
    target_lang: body.target as TargetLang,
  }, {
    proxyEndpoint: process.env.DEEPLX_PROXY_ENDPOINT,
    customHeader: {
      ...(process.env.DEEPLX_ACCESS_TOKEN) && {
        Authorization: `Bearer ${process.env.DEEPLX_ACCESS_TOKEN}`,
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

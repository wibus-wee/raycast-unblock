import { ofetch } from 'ofetch'
import { v4 } from 'uuid'

export const LibreTranslateAPI = 'https://libretranslate.com/translate'

export async function FetchLibreTranslateAPI(
  text: string,
  source: string,
  target: string,
  api_key?: string,
  api_endpoint?: string,
  secret?: string,
  headers?: Record<string, string>,
): Promise<{
  detectedLanguage: {
    confidence: number
    language: string
  }
  translatedText: string
}> {
  const form_data = {
    q: text,
    source,
    target,
    format: 'text',
    api_key,
    secret,
  }
  const boundary = `----WebKitFormBoundary${v4()}`
  const form_data_str = `${Object.entries(form_data).map(([key, value]) =>
    `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
  ).join('')}--${boundary}--\r\n`
  const api = api_endpoint ? `${api_endpoint}/translate` : LibreTranslateAPI
  const res = await ofetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      ...headers,
    },
    body: form_data_str,
  })
  return res
}

import { ofetch } from 'ofetch'
import { v4 } from 'uuid'
import { Debug } from '../../utils/log.util'
import { FetchLibreTranslateAPI } from '.'

const app = 'https://libretranslate.com/js/app.js'
const regex = /apiSecret:\s*['"]([^'"]+)['"]/

export async function getApiSecret() {
  const res = await ofetch.native(app).then((res) => {
    if (!res.ok)
      throw new Error('Failed to fetch app.js')
    return res.text()
  })
  const match = res.match(regex)
  if (!match)
    throw new Error('Failed to find LibreTranslate API secret in app.js')

  Debug.info('LibreTranslate API secret:', match[1])
  return match[1]
}

export async function TranslateWithLibreTranslateReverseAPI(
  text: string,
  source: string,
  target: string,
): Promise<{
  detectedLanguage: {
    confidence: number
    language: string
  }
  translatedText: string
}> {
  const session = v4()
  const res = await FetchLibreTranslateAPI(text, source, target, '', await getApiSecret(), undefined, {
    'Cookie': `session=${session}`,
    'Origin': 'https://libretranslate.com',
    'Referer': `https://libretranslate.com/?source=${source}&target=${target}&q=${text}`,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': '*/*',
  })
  return res
}

import { ofetch } from 'ofetch'
import { getConfig } from '../../../../utils/env.util'

export async function Serp(query: string) {
  const payload = JSON.stringify({ keyword: query })
  const headers = {
    'apy-token': getConfig('ai', 'functions.serp.apiHubApiKey') as string,
  }
  const res = await ofetch('https://api.apyhub.com/extract/serp/rank', {
    method: 'POST',
    headers,
    body: payload,
  })
  const transformed_res = []
  for (const item of res) {
    transformed_res.push(
      {
        title: item.title,
        url: item.url,
        summary: item.description,
        images: [],
      },
    )
  }
  return {
    references: transformed_res,
    text: '',
  }
}

import process from 'node:process'
import Fastify from 'fastify'
import consola from 'consola'
import { FastifySSEPlugin } from 'fastify-sse-v2'
import packageJson from '../package.json'
import { MeRoute } from './routes/me'
import { httpClient } from './utils'
import { AIRoute } from './routes/ai'
import { TranslationsRoute } from './routes/translations'
import { Debug } from './utils/log.util'
import { getConfig } from './utils/env.util'

const prefix = '/api/v1'

export function launch() {
  const config = getConfig('general')
  const fastify = Fastify({ logger: config?.logger || false })
  fastify.register(FastifySSEPlugin)

  fastify.register(MeRoute, { prefix: `${prefix}/me` })
  fastify.register(AIRoute, { prefix: `${prefix}/ai` })
  fastify.register(TranslationsRoute, { prefix: `${prefix}/translations` })

  fastify.get('/', async (_request, _reply) => {
    return {
      name: packageJson.name,
      version: packageJson.version,
      author: packageJson.author,
    }
  })

  fastify.get('/*', async (request, reply) => {
    const subUrl = request.url.substr(0, 30)
    Debug.info(`[GET] ${subUrl} <-- 托底策略 --> Backend Request`)
    request.headers = {
      ...request.headers,
      host: 'backend.raycast.com',
    }
    const backendResponse = await httpClient(request.url, {
      headers: request.headers as Record<string, string>,
      method: 'GET',
      baseURL: 'https://backend.raycast.com', // This is the only difference
      redirect: 'manual',
    }).catch((reason) => {
      consola.error(`[GET] ${subUrl} <-- 托底策略 <-x- Backend Response Error`)
      consola.error(reason)
      return reply.send(reason)
    })
    Debug.info(`[GET] ${subUrl} <-- 托底策略 <-- Backend Response`)
    return reply.send(backendResponse)
  })

  consola.info(`Raycast Unblock`)
  consola.info(`Version: ${packageJson.version}`)
  consola.info('Server starting...')
  fastify.listen({ port: config?.port || 3000, host: config?.host || '0.0.0.0' }, (err, address) => {
    if (err) {
      consola.error(err)
      process.exit(1)
    }
    consola.success(`Server listening on ${address}.`)
  })
}

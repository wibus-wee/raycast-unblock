import fs from 'node:fs'
import process from 'node:process'
import consola from 'consola'
import { argv } from 'zx'
import { parse } from 'toml'
import destr from 'destr'
import type { LegacyAIConfig } from '../types'
import type { Config } from '../types/config'
import { Debug } from './log.util'
import { matchKeyInObject } from './others.util'

export function injectEnv() {
  const config = matchKeyInObject(argv, 'config') || 'config.toml'
  if (fs.existsSync(config)) {
    const env = parse(fs.readFileSync(config, 'utf-8'))
    process.env.config = JSON.stringify(env)
  }
}

export function getConfig<T extends keyof Config>(key?: T): Config[T] {
  const env = process.env.config
  if (env) {
    const config = destr<Config>(env)
    if (key)
      return config[key]
    return config as Config[T]
  }
  return {} as Config[T]
}

export function getAIConfig(): LegacyAIConfig {
  return {
    type: (process.env.AI_TYPE || 'openai') as LegacyAIConfig['type'],
    key: process.env.AI_API_KEY || '',
    endpoint: process.env.OPENAI_BASE_URL,
    max_tokens: process.env.AI_MAX_TOKENS,
    temperature: process.env.AI_TEMPERATURE || '0.5',
  }
}

export function checkAIConfig() {
  const config = getAIConfig()
  Debug.info('Your AI will be using [', config.type, '] API')
  if (!config.key)
    consola.warn('AI_API_KEY is not set')
}

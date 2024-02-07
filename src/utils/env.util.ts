import fs from 'node:fs'
import process from 'node:process'
import consola from 'consola'
import { argv } from 'zx'
import { parse } from 'toml'
import destr from 'destr'
import type { LegacyAIConfig } from '../types'
import type { Config } from '../types/config'
import { Debug } from './log.util'
import { matchKeyInObject, tolowerCaseInObject, transformToString } from './others.util'

export function injectEnv() {
  if (matchKeyInObject(argv, 'env') || process.env.ENV || process.env.env)
    consola.warn('You are using deprecated flag [--env]. It can\'t be used in this version anymore. Please use the new config format.')

  const config = matchKeyInObject(argv, 'config') || 'config.toml'
  if (fs.existsSync(config)) {
    let env = parse(fs.readFileSync(config, 'utf-8')) as Config
    env = tolowerCaseInObject(env)
    process.env.config = JSON.stringify(env)
    Debug.native.log(env)
    if (env.legacy) {
      for (const key in env.legacy) {
        consola.warn(`[DEPRECATED] You are using deprecated config key [${key.toUpperCase()}]. It can't be used in this version anymore. Please use the new config format.`)
        process.env[key.toUpperCase()] = transformToString((env.legacy as any)[key])
      }
      consola.warn('Please use the new config format. Check the documentation for more information: https://github.com/wibus-wee/raycast-unblock#readme')
    }
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

import fs from 'node:fs'
import process from 'node:process'
import consola from 'consola'
import { argv } from 'zx'
import { parse } from 'toml'
import type { LegencyAIConfig } from '../types'
import { Debug } from './log.util'
import { matchKeyInObject } from './others.util'

export function injectEnv() {
  const config = matchKeyInObject(argv, 'config') || 'config.toml'
  if (fs.existsSync(config)) {
    const _ = parse(fs.readFileSync(config, 'utf-8'))
  }
}

export function getAIConfig(): LegencyAIConfig {
  return {
    type: (process.env.AI_TYPE || 'openai') as LegencyAIConfig['type'],
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

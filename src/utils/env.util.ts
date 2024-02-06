import process from 'node:process'
import consola from 'consola'
import dotenv from 'dotenv'
import { argv } from 'zx'
import { type AIConfig, KeyOfEnvConfig } from '../types'

export function injectEnv() {
  if (argv.help) {
    consola.log('Available options:')
    KeyOfEnvConfig.forEach((key) => {
      consola.log(`  --${key.toLowerCase()} <value>`)
    })
    process.exit(0)
  }
  let envPath = '.env'
  if (argv.env)
    envPath = argv.env
  dotenv.config({
    path: envPath,
  })
  // Override env from argv
  KeyOfEnvConfig.forEach((key) => {
    const argvKey = key.toLowerCase()
    if (argv[argvKey])
      process.env[key] = argv[argvKey]
  })
}

export function getAIConfig(): AIConfig {
  return {
    type: (process.env.AI_TYPE || 'openai') as AIConfig['type'],
    key: process.env.AI_API_KEY || '',
    endpoint: process.env.AI_ENDPOINT,
    max_tokens: process.env.AI_MAX_TOKENS,
    temperature: process.env.AI_TEMPERATURE || '0.5',
  }
}

export function checkAIConfig() {
  const config = getAIConfig()
  consola.info('Your AI will be using [', config.type, '] API')
  if (!config.key)
    consola.warn('AI_API_KEY is not set')
}

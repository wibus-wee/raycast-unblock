import fs from 'node:fs'
import process from 'node:process'
import consola from 'consola'
import { argv } from 'zx'
import { parse } from 'toml'
import destr from 'destr'
import type { Config } from '../types/config'
import { Debug } from './log.util'
import { getValueFromDotNotation, matchKeyInObject, toCamelCaseInObject, tolowerCaseInObject, transformToString } from './others.util'

/**
 * Check the default OpenAI model configuration.
 *
 * It may be configured to a non-existent model, in this case, it needs to be removed
 */
function checkOpenAIDefaultModelConfig(env: Config) {
  if (env.ai?.openai?.default?.toLowerCase() && !(env.ai.openai.models as any)[env.ai.openai.default?.toLowerCase()]) {
    consola.warn(`The default AI model [${env.ai.openai.default?.toLowerCase()}] is not available, it will be removed from the config`)
    // delete env.ai.openai.default
    if (env.ai.openai.default)
      delete env.ai.openai.default
  }
  return env
}

function checkAIDefaultConfig(env: Config) {
  if (env.ai?.default?.toLowerCase() && !(env.ai as any)[env.ai.default?.toLowerCase()]) {
    consola.warn(`The default AI setting [${env.ai.default?.toLowerCase()}] is not available, use the default setting`)
    env.ai.default = 'openai'
  }
  return env
}

function checkTranslateAIDefaultConfig(env: Config) {
  if (env.translate?.ai?.default?.toLowerCase() && !(env.ai as any)[env.translate.ai.default]) {
    consola.warn(`The default AI model [${env.translate.ai.default}] is not available, it will be removed from the config`)
    delete env.translate.ai.default
  }
  return env
}

function checkDefault(env: Config) {
  env = checkOpenAIDefaultModelConfig(env)
  env = checkAIDefaultConfig(env)
  env = checkTranslateAIDefaultConfig(env)
  return env
}

export function injectEnv() {
  if (matchKeyInObject(argv, 'env') || process.env.ENV || process.env.env)
    consola.warn('You are using deprecated flag [--env]. It can\'t be used in this version anymore. Please use the new config format.')

  const config = matchKeyInObject(argv, 'config') || 'config.toml'
  if (fs.existsSync(config)) {
    let env = parse(fs.readFileSync(config, 'utf-8')) as Config
    env = tolowerCaseInObject(env)
    env = toCamelCaseInObject(env)
    env = checkDefault(env)
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

export function getConfig<T extends keyof Config>(key?: T, inKey?: string): Config[T] {
  const env = process.env.config
  if (env) {
    const config = destr<Config>(env)
    if (key) {
      // Debug.info(`[Config] Get config key [${key}]`)
      if (key.includes('.')) {
        Debug.info(`[Config] Get config key [${key}] with dot notation`)
        return getValueFromDotNotation(config, key)
      }
      if (inKey) {
        if (inKey.includes('.')) {
          Debug.info(`[Config] Get config key [${key}] with dot notation`)
          return getValueFromDotNotation(config[key], inKey)
        }
        else {
          Debug.info(`[Config] Get config key [${key}] with inKey [${inKey}]`)
          const _c = config as any
          if (_c[inKey] && _c[inKey][key])
            return _c[inKey][key]
          else
            return {}
        }
      }
      return config[key]
    }
    return config as Config[T]
  }
  return {} as Config[T]
}

import process from 'node:process'
import { Console } from 'node:console'
import consola from 'consola'
import { getConfig } from './env.util'

declare global {
  interface Console {
    success(message: any, ...args: any[]): void
  }
}

Console.prototype.success = function (message: any, ...args: any[]) {
  this.log('\x1B[32m%s\x1B[0m', message, ...args)
}

function DebugInfo(mode: 'consola' | 'native', message: any, ...args: any[]) {
  const module = mode === 'native' ? console : consola
  if (process.env.DEBUG || getConfig('general')?.debug)
    return module.info(`[DEBUG]`, message, ...args)
}

function DebugSuccess(mode: 'consola' | 'native', message: any, ...args: any[]) {
  const module = mode === 'native' ? console : consola
  if (process.env.DEBUG || getConfig('general')?.debug)
    return module.success(`[DEBUG]`, message, ...args)
}

function DebugWarn(mode: 'consola' | 'native', message: any, ...args: any[]) {
  const module = mode === 'native' ? console : consola
  if (process.env.DEBUG || getConfig('general')?.debug)
    return module.warn(`[DEBUG]`, message, ...args)
}

function DebugError(mode: 'consola' | 'native', message: any, ...args: any[]) {
  const module = mode === 'native' ? console : consola
  if (process.env.DEBUG || getConfig('general')?.debug)
    return module.error(`[DEBUG]`, message, ...args)
}

function DebugLog(mode: 'consola' | 'native', message: any, ...args: any[]) {
  const module = mode === 'native' ? console : consola
  if (process.env.DEBUG || getConfig('general')?.debug)
    return module.log(message, ...args)
}

export const Debug = {
  info: (message: any, ...args: any[]) => DebugInfo('consola', message, ...args),
  success: (message: any, ...args: any[]) => DebugSuccess('consola', message, ...args),
  warn: (message: any, ...args: any[]) => DebugWarn('consola', message, ...args),
  error: (message: any, ...args: any[]) => DebugError('consola', message, ...args),
  log: (message: any, ...args: any[]) => DebugLog('consola', message, ...args),
  native: {
    info: (message: any, ...args: any[]) => DebugInfo('native', message, ...args),
    success: (message: any, ...args: any[]) => DebugSuccess('native', message, ...args),
    warn: (message: any, ...args: any[]) => DebugWarn('native', message, ...args),
    error: (message: any, ...args: any[]) => DebugError('native', message, ...args),
    log: (message: any, ...args: any[]) => DebugLog('native', message, ...args),
  },
}

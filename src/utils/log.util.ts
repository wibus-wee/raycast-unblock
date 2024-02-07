import process from 'node:process'
import consola from 'consola'

function DebugInfo(message: any, ...args: any[]) {
  if (process.env.DEBUG)
    consola.info(`[DEBUG]`, message, ...args)
}

function DebugSuccess(message: any, ...args: any[]) {
  if (process.env.DEBUG)
    consola.success(`[DEBUG]`, message, ...args)
}

function DebugWarn(message: any, ...args: any[]) {
  if (process.env.DEBUG)
    consola.warn(`[DEBUG]`, message, ...args)
}

function DebugError(message: any, ...args: any[]) {
  if (process.env.DEBUG)
    consola.error(`[DEBUG]`, message, ...args)
}

function DebugLog(message: any, ...args: any[]) {
  if (process.env.DEBUG)
    consola.log(message, ...args)
}

export const Debug = {
  info: DebugInfo,
  success: DebugSuccess,
  warn: DebugWarn,
  error: DebugError,
  log: DebugLog,
}

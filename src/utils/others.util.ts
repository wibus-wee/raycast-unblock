import { destr } from 'destr'

export function transformToString(obj: any) {
  if (typeof obj === 'object')
    return JSON.stringify(obj)

  return obj
}

export function transformToObj<T>(str: string) {
  return destr<T>(str)
}

export function matchKeyInObject<T = Record<any, any>>(obj: T, key: string) {
  const keys = Object.keys(obj || {})
  const matched = keys.find(k => k.toLowerCase() === key.toLowerCase())
  return matched ? (obj as Record<string, any>)[matched] : undefined
}

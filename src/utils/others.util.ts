import { destr } from 'destr'

export function transformToString(obj: any) {
  if (typeof obj === 'object')
    return JSON.stringify(obj)

  return obj
}

export function transformToObj<T>(str: string) {
  return destr<T>(str)
}

/**
 * It will match the key in the object (not case-sensitive)
 */
export function matchKeyInObject<T = Record<any, any>>(obj: T, key: string) {
  const keys = Object.keys(obj || {})
  const matched = keys.find(k => k.toLowerCase() === key.toLowerCase())
  return matched ? (obj as Record<string, any>)[matched] : undefined
}

export function tolowerCaseInObject<T = Record<any, any>>(obj: T) {
  const keys = Object.keys(obj || {})
  const newObj = {} as T
  keys.forEach((k) => {
    (newObj as any)[k.toLowerCase()] = (obj as any)[k]
    if (typeof (obj as any)[k] === 'object')
      (newObj as any)[k.toLowerCase()] = tolowerCaseInObject((obj as any)[k])
  })
  return newObj
}

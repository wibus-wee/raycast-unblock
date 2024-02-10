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

export function toCamelCase(str: string) {
  if (!str.includes('_') && !str.includes('-'))
    return str

  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

export function toCamelCaseInObject<T = Record<any, any>>(obj: T) {
  const keys = Object.keys(obj || {})
  const newObj = {} as T
  keys.forEach((k) => {
    (newObj as any)[toCamelCase(k)] = (obj as any)[k]
    if (typeof (obj as any)[k] === 'object')
      (newObj as any)[toCamelCase(k)] = toCamelCaseInObject((obj as any)[k])
  })
  return newObj
}

export function getValueFromDotNotation<T = Record<any, any>>(obj: T, key: string) {
  if (key.includes('.')) {
    const keys = key.split('.')
    let value = obj as Record<string, any> | undefined
    for (const k of keys) {
      if (value?.[k])
        value = value?.[k]
      else
        value = undefined
    }
    return value
  }
  return (obj as Record<string, any>)[key]
}

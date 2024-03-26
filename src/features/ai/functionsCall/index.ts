import type { ChatCompletionTool } from 'openai/resources/index.mjs'
import type { IAvailableFunction } from '../../../types/internal/i-available-functions'
import { getConfig } from '../../../utils/env.util'
import { AvailableFunctions } from './constants'

export function validateFunctionCallEnvIsSet(f: IAvailableFunction) {
  let isValidate = false
  if (f.requiredEnv) {
    for (const env of f.requiredEnv) {
      const config = getConfig(env as any)
      if (!config) {
        isValidate = false
        break
      }
      else {
        isValidate = true
      }
    }
  }
  return isValidate
}

export function getFunctionCallTools() {
  const availableFunctions = AvailableFunctions
  const validateFunctions: IAvailableFunction[] = []
  for (const key in availableFunctions) {
    if (validateFunctionCallEnvIsSet(availableFunctions[key]))
      validateFunctions.push(availableFunctions[key])
  }
  return validateFunctions
}

export function getFunctionCallToolsConfig(): Array<ChatCompletionTool> {
  const availableFunctions = getFunctionCallTools()
  const tools: Array<ChatCompletionTool> = []
  for (const f of availableFunctions) {
    tools.push({
      type: 'function',
      function: {
        name: f.id,
        description: f.description,
        parameters: f.paramters,
      },
    })
  }
  return tools
}

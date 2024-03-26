export interface IAvailableFunctions {
  [key: string]: IAvailableFunction
}

export interface IAvailableFunction {
  id: string
  description?: string
  paramters?: {
    properties: {
      [key: string]: {
        type: string
        description: string
      }
    }
  }
  handler: Function
  notifications: {
    'calls'?: {
      text: string
      type: string | 'tool_used'
    }
  }
  prompts?: {
    'role': string
    'content': string
  }[]
  requiredEnv?: string[]
}

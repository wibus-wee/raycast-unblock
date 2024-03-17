export interface AIConfig {
  default?: string
  temperature?: number
  maxTokens?: number
  openai?: OpenAIServiceConfig
  gemini?: GeminiServiceConfig
  copilot?: CopilotServiceConfig
}
export interface AIServiceConfig {
  disable?: boolean
  apiKey?: string
  maxTokens?: number
  temperature?: number
}
export interface OpenAIServiceConfig extends AIServiceConfig {
  baseUrl?: string
  models?: AIServiceModelsConfig
  default?: string
  isAzure?: boolean
  azureDeploymentName?: string
}
export interface GeminiServiceConfig extends AIServiceConfig {}
export interface CopilotServiceConfig extends AIServiceConfig {
  default: 'gpt-3.5-turbo' | 'gpt-4'
}

export interface AIServiceModelsConfig {
  [key: string]: {
    id?: string
    model: string
    name?: string
    provider?: string
    providerName?: string
  }
}

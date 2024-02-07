export interface AIConfig {
  default?: string
  temperature?: number
  maxTokens?: number
  openai?: OpenAIServiceConfig
  gemini?: GeminiServiceConfig
  copilot?: CopilotServiceConfig
}
export interface AIServiceConfig {
  enable?: boolean
  apiKey?: string
  maxTokens?: number
  temperature?: number
}
export interface OpenAIServiceConfig extends AIServiceConfig {
  baseUrl?: string
  models?: AIServiceModelsConfig
}
export interface GeminiServiceConfig extends AIServiceConfig {}
export interface CopilotServiceConfig extends AIServiceConfig {}

export interface AIServiceModelsConfig {
  [key: string]: {
    id?: string
    model: string
    name?: string
    features?: string[]
    provider?: string
    provider_name?: string
  }
}

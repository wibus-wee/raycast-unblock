export interface AIConfig {
  default?: string
  temperature?: number
  maxTokens?: number
  openai?: OpenAIServiceConfig
  gemini?: GeminiServiceConfig
  copilot?: CopilotServiceConfig
}
export interface AIServiceConfig {
  apiKey?: string
  maxTokens?: string
  temperature?: string
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

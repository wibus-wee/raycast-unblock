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
}
export interface GeminiServiceConfig extends AIServiceConfig {}
export interface CopilotServiceConfig extends AIServiceConfig {}

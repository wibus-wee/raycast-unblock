export interface User {
  email: string
  token: string
}

export interface LegacyAIConfig {
  type?: 'openai' | 'gemini' | 'custom' | 'copilot'
  key?: string
  endpoint?: string
  max_tokens?: string
  temperature?: string
}

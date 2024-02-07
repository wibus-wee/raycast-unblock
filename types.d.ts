declare global {
  namespace NodeJS {
    interface ProcessEnv {
      users: string
      config: string
      // LegacyAIConfig
      AI_TYPE?: string
      AI_API_KEY?: string
      OPENAI_BASE_URL?: string
      AI_MAX_TOKENS?: string
      AI_TEMPERATURE?: string
    }
  }
}

export { }

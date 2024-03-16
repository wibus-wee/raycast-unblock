export interface TranslateConfig {
  default?: string
  deepLX?: DeepLXTranslateServiceConfig
  ai?: AITranslateServiceConfig
  libreTranslate?: LibreTranslateServiceConfig
}
export interface DeepLXTranslateServiceConfig {
  proxyEndpoint?: string
  accessToken?: string
}
export interface AITranslateServiceConfig {
  default?: string
  model?: string
}
export interface LibreTranslateServiceConfig {
  baseUrl?: string
  apiKey?: string
  type?: 'reserve' | 'api'
}

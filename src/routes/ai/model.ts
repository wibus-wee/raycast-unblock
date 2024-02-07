import { getConfig } from '../../utils/env.util'
import { GEMINI_SERVICE_PROVIDERS, GITHUB_COPILOT_3_5_TURBO, GITHUB_COPILOT_4, GITHUB_COPILOT_SERVICE_PROVIDERS, OPENAI_SERVICE_PROVIDERS, RAYCAST_DEFAULT_MODELS, RAYCAST_GEMINI_PRO_ONLY_MODELS } from './constants'

function generateRaycastAIServiceProviders() {
  const config = getConfig('ai')
  const default_models = []
  if (!config?.openai?.disable) {
    default_models.push([
      ...OPENAI_SERVICE_PROVIDERS,
      ...Object.entries(getConfig('ai')?.openai?.models || {}).map(([key, value]) => ({
        id: value.id || key,
        model: value.model || key,
        name: value.name || key,
        provider: 'openai',
        provider_name: 'OpenAI',
        requires_better_ai: true,
        features: ['chat', 'quick_ai', 'commands', 'api'],
      })),
    ])
  }
  if (!config?.gemini?.disable)
    default_models.push(GEMINI_SERVICE_PROVIDERS)
  if (!config?.copilot?.disable)
    default_models.push(GITHUB_COPILOT_SERVICE_PROVIDERS)
  return default_models.flat()
}

function getDefaultInOpenAIModels() {
  const openai_models = getConfig('ai')?.openai?.models
  let default_model
  if (openai_models) {
    for (const key in openai_models) {
      if (openai_models[key].isDefault) {
        default_model = openai_models[key].id
        break
      }
    }
  }
  else {
    default_model = RAYCAST_DEFAULT_MODELS
  }

  return default_model
}

function getDefaultInCopilotModels() {
  const defaultModel = getConfig('ai')?.copilot?.default.toLowerCase()
  let model
  if (defaultModel === 'gpt-3.5-turbo')
    model = GITHUB_COPILOT_3_5_TURBO.id
  else
    model = GITHUB_COPILOT_4.id

  return {
    chat: model,
    quick_ai: model,
    commands: model,
    api: model,
  }
}

export function AIModels() {
  const config = getConfig('ai')
  let default_models
  switch (config?.default?.toLowerCase()) {
    case 'openai':
      default_models = getDefaultInOpenAIModels()
      break
    case 'gemini':
      default_models = RAYCAST_GEMINI_PRO_ONLY_MODELS
      break
    case 'copilot':
      default_models = getDefaultInCopilotModels()
      break
    default:
      default_models = getDefaultInOpenAIModels()
      break
  }
  const models = generateRaycastAIServiceProviders()
  return {
    default_models,
    models,
  }
}

import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAIConfig, getConfig } from '../../utils/env.util'
import { GeminiChatCompletion } from '../../features/ai/completions/gemini'
import { OpenAIChatCompletion } from '../../features/ai/completions/openai'
import { CopilotChatCompletion } from '../../features/ai/completions/copilot'
import type { RaycastCompletions } from '../../types/raycast/completions'

export function Completions(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as RaycastCompletions
  const config = getConfig('ai')
  const model = (body.model || config?.default) as keyof typeof config
  if (!(config && model && config[model] && (config[model] as any).enabled)) {
    reply.status(400).send({
      error: 'Completions not supported for this model. Please check your config.',
    })
  }
  switch (model) {
    case 'gemini':
      return GeminiChatCompletion(request, reply)
    case 'openai':
      return OpenAIChatCompletion(request, reply)
    case 'copilot':
      return CopilotChatCompletion(request, reply)
    default:
      break
  }
}

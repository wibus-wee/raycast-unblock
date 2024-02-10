import type { IAvailableFunctions } from '../../../types/internal/i-available-functions'
import { Serp } from './functions/serp'

export const AvailableFunctions: IAvailableFunctions = {
  serp: {
    id: 'serp',
    description: 'Search Engine Results Page',
    paramters: {
      properties: {
        query: {
          description: 'Search Query',
        },
      },
    },
    handler: Serp,
    data: {
      calling: {
        text: 'Searching in Google...',
        type: 'tool_used',
      },
    },
    prompts: [
      {
        role: 'system',
        content: 'Please summarize from the above information, but please note that if you use relevant information in your answer, please mark the citation as strictly \'[Source](URL)\', and note that the first bracket must be the hard-coded English "Source "in the first parenthesis, which is relevant for subsequent rendering. You don\'t have to use markdown\'s markup syntax.',
      },
    ],
    requiredEnv: [
      // 'ai.functions.apiHubApiKey',
      'ai.functions.tavilyAiApiKey',
    ],
  },
}

export interface RaycastCompletions {
  debug: boolean
  locale: string
  messages: {
    author: string
    content: {
      system_instructions: string
      command_instructions: string
      text: string
      temperature: number
      [key: string]: string | number
    }
  }[]
  model: string
  provider: string
  source: string
  system_instruction: string
  additional_system_instructions: string
  temperature: number
}

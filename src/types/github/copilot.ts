export interface GithubCopilotTokenAuthorizationRemoteBody {
  annotations_enabled: boolean
  chat_enabled: boolean
  chat_jetbrains_enabled: boolean
  code_quote_enabled: boolean
  copilot_ide_agent_chat_gpt4_small_prompt: boolean
  copilotignore_enabled: boolean
  expires_at: number
  intellij_editor_fetcher: boolean
  prompt_8k: boolean
  public_suggestions: string
  refresh_in: number
  sku: string
  snippy_load_test_enabled: boolean
  telemetry: string
  token: string
  tracking_id: string
  vsc_electron_fetcher: boolean
  vsc_panel_v2: boolean
}

export interface GithubCopilotTokenAuthorization {
  app_token: string
  c_token: string
  expires_at: number
  vscode_machineid: string
  vscode_sessionid: string
  session_expires_at: number
  last_touched: number
}

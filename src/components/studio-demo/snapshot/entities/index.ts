// Demo DTO subset copied from Studio entities; no business runtime.
type ClientJsonValue = null | boolean | number | string | ClientJsonValue[] | { [key: string]: ClientJsonValue }
type JsonObject = { [key: string]: ClientJsonValue }

export type AgentSession = {
  id: string
  agentProfileId: string
  title?: string
  timelineId?: string
  headEntryId?: string
  entryCount: number
  createdAt: string
  updatedAt: string
}

export type AgentTranscriptEntry = {
  id: string
  agentSessionId: string
  parentEntryId?: string
  sequence: number
  runId?: string
  entry: {
    kind: string
    role?: 'user' | 'assistant'
    content?: string
    [key: string]: ClientJsonValue | undefined
  }
  createdAt: string
}

export type ProviderProfile = {
  id: string
  version: number
  providerExtensionId: string
  displayName: string
  config: JsonObject
  enabledModelIds: string[]
  credential: {
    configured: boolean
    updatedAt?: string
  }
  createdAt: string
  updatedAt: string
}

export type ProviderModelSelection = {
  providerProfileId: string
  modelId: string
}

export type AgentProfile = {
  id: string
  version: number
  name: string
  presetId: string
  model: ProviderModelSelection
  toolOverrides: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

export type ProviderAccount = ProviderProfile

import type { CreateChatCompletionRequest } from 'openai'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
export interface Context {
  language: string
  messages: ChatMessage[]
}

export function generateCompletion(messages: ChatMessage[]) {
  const completionOptions: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  }

  return completionOptions
}

import type { CreateChatCompletionResponse } from 'openai'
import { defineStore } from 'pinia'
import { SSE } from 'sse.js'
import type { BlockModel } from '~/models/Block'

interface Context {
  type?: 'default' | 'translate' | 'continue' | 'summarize' | 'improveWriting' | 'fixSpellingAndGrammar'
  text?: string
  language?: string
}
type Type = 'update' | 'create'

function getEdgeFunctionUrl() {
  const supabaseUrl = (
    import.meta.env.DEV
      ? 'http://localhost:54321'
      : import.meta.env.RENDERER_VITE_SUPABASE_URL
  )
    ?.replace(/\/$/, '')

  return `${supabaseUrl}/functions/v1`
}

export const useCopilotStore = defineStore('copilot', {
  state: () => {
    return {
      show: false,
      value: '',
      closable: true,
      type: 'create' as Type,
      editingBlock: null as BlockModel | null,
    }
  },
  actions: {
    open(type: Type, block?: BlockModel) {
      this.type = type
      this.show = true
      if (type === 'update') {
        this.value = block?.content ?? ''
        this.editingBlock = block
      }
    },
    close() {
      this.show = false
      this.value = ''
    },
    getCompletion(context?: Context) {
      const { type = 'default', text = '', language } = context || {}
      this.inputRef?.blur?.()
      this.loading = true
      const eventSource = new SSE(`${getEdgeFunctionUrl()}/completion`, {
        headers: {
          'apikey': import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ prompt: this.question, type, text, language }),
      })
      const handleError = <T>(err: T) => {
        this.loading = false
        this.status = 'error'
        this.results = err as string
        console.error(err)
      }
      eventSource.addEventListener('error', handleError)
      eventSource.addEventListener('message', (e) => {
        try {
          this.loading = true

          if (e.data === '[DONE]') {
            this.loading = false
            this.status = 'answered'
            this.inputRef?.blur?.()
            return
          }

          const completionResponse = JSON.parse(e.data) as CreateChatCompletionResponse
          // @ts-expect-error noop
          const content = completionResponse.choices[0]?.delta?.content ?? ''
          this.results = (this.results ?? '') + content
        }
        catch (err) {
          handleError(err)
        }
      })
      eventSource.stream()
    },
  },
})

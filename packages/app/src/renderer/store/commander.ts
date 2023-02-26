import { uniq } from 'lodash-es'
import type { CreateCompletionResponse } from 'openai'
import { defineStore } from 'pinia'
import { SSE } from 'sse.js'

function getEdgeFunctionUrl() {
  const supabaseUrl = (
    import.meta.env.DEV
      ? 'http://localhost:54321'
      : import.meta.env.RENDERER_VITE_SUPABASE_URL
  )
    ?.replace(/\/$/, '')

  return `${supabaseUrl}/functions/v1`
}

export const useCommanderStore = defineStore('commander', {
  state: () => {
    return {
      show: false,
      question: '',
      loading: false,
      status: 'empty' as 'empty' | 'error' | 'answered',
      results: '',
      inputRef: null as any | null,
      recently: useCommanderRecently(),
    }
  },
  actions: {
    getCompletion(type = 'default', text = '', language = 'chinese') {
      this.inputRef?.blur()
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
            this.inputRef?.blur()
            return
          }

          const completionResponse = JSON.parse(e.data) as CreateCompletionResponse
          const [{ text }] = completionResponse.choices

          this.results = (this.results ?? '') + text
        }
        catch (err) {
          handleError(err)
        }
      })
      eventSource.stream()
    },
    reset() {
      this.question = ''
      this.results = ''
      this.loading = false
      this.status = 'empty'
      if (this.show) this.inputRef?.focus()
    },
    continue() {
      this.getCompletion('continue', this.results)
    },
    rewrite() {
      const tempPrompt = this.question
      this.reset()
      this.question = tempPrompt
      this.getCompletion()
    },
    async search() {
      await this.getCompletion()
      this.inputRef?.select()
      // 控制最近问题最大数量
      if (this.recently.length >= 10) {
        this.recently.pop()
        this.recently = uniq([this.question, ...this.recently])
      }
      else {
        this.recently = uniq([this.question, ...this.recently])
      }
    },
  },
})

import type { Content, Editor } from '@tiptap/core'
import { uniq } from 'lodash-es'
import type { CreateChatCompletionResponse } from 'openai'
import { defineStore } from 'pinia'
import { SSE } from 'sse.js'

interface Context {
  type?: 'default' | 'translate' | 'continue' | 'summarize' | 'improveWriting' | 'fixSpellingAndGrammar'
  text?: string
  language?: string
}

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
      question: {} as Content,
      text: '',
      loading: false,
      status: 'empty' as 'empty' | 'error' | 'answered',
      results: '',
      editor: undefined as Editor | undefined,
      recently: useCopilotRecently(),
    }
  },
  actions: {
    getCompletion(context?: Context) {
      const { type = 'default', text = '', language } = context || {}
      this.editor?.commands?.blur?.()
      this.loading = true
      const prompt = this.editor.getText()
      const eventSource = new SSE(`${getEdgeFunctionUrl()}/completion`, {
        headers: {
          'apikey': import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ prompt, type, text, language }),
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
            this.editor?.commands?.blur?.()
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
    reset() {
      this.question = {}
      this.text = ''
      this.loading = false
      this.status = 'empty'
      this.results = ''
      if (this.show)
        this.editor?.commands?.select?.()
    },
    continue() {
      this.getCompletion({
        type: 'continue',
        text: this.results,
      })
    },
    rewrite() {
      const tempPrompt = this.question
      this.reset()
      this.question = tempPrompt
      this.getCompletion()
    },
    async search() {
      await this.getCompletion()
      const content = this.editor?.getText()
      // 控制最近问题最大数量
      if (this.recently.length >= 10) {
        this.recently.pop()
        this.recently = uniq([content, ...this.recently])
      }
      else {
        this.recently = uniq([content, ...this.recently])
      }
    },

    async open() {
      this.reset()
      this.show = true
    },
    async openAndSearch(context: Context) {
      this.text = context.text
      this.show = true
      await this.getCompletion(context)
    },
  },
})

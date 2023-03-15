import type { Editor } from '@tiptap/core'
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
      editor: null as Editor | null,
      value: '',
      tags: [] as string[],
      type: 'create' as Type,
      editingBlock: null as BlockModel | null,
      focus: false,
      loading: false,
    }
  },
  actions: {
    open(type: Type, block?: BlockModel) {
      if (type === 'update') {
        this.value = block?.content ?? ''
        this.tags = block?.tags ?? []
        this.editor?.commands.setContent(this.value)
        this.editingBlock = block
      }
      this.type = type
    },
    cancel() {
      this.editor?.commands.clearContent()
      this.value = ''
      this.tags = []
      this.type = 'create'
      this.editingBlock = null
    },
    async save() {
      const blockStore = useBlockStore()
      this.loading = true

      const content = this.value as string

      if (this.type === 'create') {
        const block: BlockModel = {
          content,
        }
        await blockStore.save(block)
      }
      else if (this.type === 'update') {
        const block = this.editingBlock
        await blockStore.update({
          ...block,
          content,
        })
      }

      this.cancel()
      this.loading = false
    },
    toggleFocus(focus?: boolean) {
      if (focus !== undefined)
        this.focus = focus
      else
        this.focus = !this.focus
    },
    getCompletion(context?: Context) {
      const { type = 'default', text = '', language } = context || {}
      this.inputRef?.blur?.()
      this.loading = true
      const eventSource = new SSE(`${getEdgeFunctionUrl()}/completion`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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

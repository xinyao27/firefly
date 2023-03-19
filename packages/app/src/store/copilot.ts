import { defineStore } from 'pinia'

interface Context {
  type?: 'custom'
  | 'translate'
  | 'polishing'
  | 'summarize'
  | 'extractionTags'
  prompt?: string
  text?: string
  language?: string
}
export const useCopilotStore = defineStore('copilot', {
  state: () => {
    return {
      loading: false,
      result: '',
      types: [
        {
          label: '自定义 Prompt',
          value: 'custom',
        },
        {
          label: '翻译',
          value: 'translate',
        },
        {
          label: '润色',
          value: 'polishing',
        },
        {
          label: '文本总结',
          value: 'summarize',
        },
        {
          label: '提取标签',
          value: 'extractionTags',
        },
      ],
      prompt: '',
      language: 'zh-Hans',
      type: 'extractionTags' as Context['type'],
    }
  },
  actions: {
    reset() {
      this.result = ''
    },
    async chat(context?: Context) {
      this.reset()
      this.loading = true
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(context),
      })
      const data = response.body
      if (!data)
        return

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        this.result += chunkValue
      }

      this.loading = false
    },
  },
})

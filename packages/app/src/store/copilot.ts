import { getSession } from '@firefly/common'
import type { InputInst } from 'naive-ui'
import { defineStore } from 'pinia'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
export interface Context {
  type?: 'default'
  | 'copilot'
  | 'custom'
  | 'translate'
  | 'polishing'
  | 'summarize'
  | 'extractionTags'
  prompt?: string
  text?: string
  copilotId?: string
  copilotName?: string
  copilotDescription?: string
  language?: string
  messages: ChatMessage[]
}
const initialMessages: ChatMessage[] = [
  // {
  //   role: 'system',
  //   content: '欢迎使用 Copilot',
  // },
  // {
  //   role: 'system',
  //   content: '请在下方输入框输入您的问题',
  // },
  // {
  //   role: 'system',
  //   content: 'Copilot 将为您提供最佳的解决方案',
  // },
  // {
  //   role: 'system',
  //   content: '您可以通过点击右下角的按钮来切换 Copilot 的模式',
  // },
  // {
  //   role: 'user',
  //   content: '你好',
  // },
  // {
  //   role: 'assistant',
  //   content: '你好，我是 Copilot',
  // },
  // {
  //   role: 'user',
  //   content: '我想问一下，你是谁？',
  // },
  // {
  //   role: 'assistant',
  //   content: '我是 Copilot，你可以通过我来解决你的问题',
  // },
  // {
  //   role: 'user',
  //   content: '你能解决什么问题',
  // },
  // {
  //   role: 'assistant',
  //   content: '我可以解决你的任何问题',
  // },
  // {
  //   role: 'user',
  //   content: '宇宙有多大',
  // },
  // {
  //   role: 'assistant',
  //   content: '宇宙的大小是无穷的',
  // },
  // {
  //   role: 'user',
  //   content: '你是怎么知道的',
  // },
  // {
  //   role: 'assistant',
  //   content: '我是通过 Google 搜索得到的',
  // },
  // {
  //   role: 'user',
  //   content: '你可真能啊',
  // },
  // {
  //   role: 'assistant',
  //   content: '谢谢夸奖',
  // },
]
export const useCopilotStore = defineStore('copilot', {
  state: () => {
    const { t } = useI18n()
    return {
      inputRef: null as InputInst | null,
      currentInput: '',
      loading: false,
      currentAssistantMessage: '',
      currentError: null as string | null,
      controller: null as AbortController | null,
      messages: initialMessages,
      types: [
        {
          label: t('copilot.customPrompt'),
          value: 'custom',
        },
        {
          label: t('copilot.translate'),
          value: 'translate',
        },
        {
          label: t('copilot.polishing'),
          value: 'polishing',
        },
        {
          label: t('copilot.summarize'),
          value: 'summarize',
        },
        {
          label: t('copilot.extractionTags'),
          value: 'extractionTags',
        },
      ],
      prompt: '',
      language: 'zh-Hans',
      type: 'extractionTags' as Context['type'],
    }
  },
  actions: {
    open(content: string) {
      const configStore = useConfigStore()
      if (configStore.isMobileScreen)
        configStore.rightBarShow = true
      this.currentInput = `"${content}" `
      this.inputRef?.focus()
    },
    archiveCurrentMessage() {
      if (this.currentAssistantMessage) {
        this.messages = [
          ...this.messages,
          {
            role: 'assistant',
            content: this.currentAssistantMessage,
          },
        ]
        this.currentAssistantMessage = ''
        this.loading = false
        this.controller = null
        nextTick(() => {
          this.inputRef?.focus()
        })
      }
    },
    async chat() {
      try {
        this.loading = true
        this.currentError = null
        const controller = new AbortController()
        this.controller = controller
        const context: Context = {
          language: this.language,
          messages: this.messages,
        }
        const session = await getSession()
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
        if (session?.access_token)
          headers.Authorization = `Bearer ${session?.access_token}`
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/chat`, {
          method: 'POST',
          headers,
          body: JSON.stringify(context),
          signal: controller.signal,
        })
        const data = response.body
        if (!data)
          throw new Error('No data')

        const reader = data.getReader()
        const decoder = new TextDecoder('utf-8')
        let done = false
        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading
          const char = decoder.decode(value)
          if (char === '\n' && this.currentAssistantMessage.endsWith('\n'))
            continue
          if (char.startsWith('{"error":')) {
            const { error } = JSON.parse(char) as { error: string }
            throw new Error(error)
          }

          if (char)
            this.currentAssistantMessage += char
        }

        this.loading = false
      }
      catch (e) {
        console.error(e)
        this.loading = false
        this.currentError = e
        this.controller = null
        this.inputRef?.focus()
        return
      }
      this.archiveCurrentMessage()
      // refresh user profiles
      const userStore = useUserStore()
      userStore.getUserProfiles()
    },
    abort() {
      this.controller?.abort()
    },
  },
})

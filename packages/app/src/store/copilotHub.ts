import type { CopilotModel } from '@firefly/common'
import { getUser } from '@firefly/common'
import { defineStore } from 'pinia'
import type { InputInst } from 'naive-ui'
import type { ChatMessage, Context } from './copilot'
import { supabase } from '~/api'
import { $t } from '~/i18n'

const initialMessages: ChatMessage[] = []

export const useCopilotHubStore = defineStore('copilotHub', {
  state: () => {
    return {
      myCopilots: [] as CopilotModel[],
      copilots: [] as CopilotModel[],
      copilot: null as CopilotModel | null,

      inputRef: null as InputInst | null,
      currentInput: '',
      loading: false,
      currentAssistantMessage: '',
      currentError: null as string | null,
      controller: null as AbortController | null,
      messages: initialMessages,
    }
  },
  actions: {
    async create(copilot: CopilotModel, tags: string[]) {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const { error } = await supabase.functions.invoke('copilots', {
          method: 'POST',
          body: {
            ...copilot,
            tags,
          },
        })
        if (error)
          throw error
        $message.success($t('copilot.createSuccess'))
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
    async findMy() {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const user = await getUser()
        const response = await supabase.from('copilots').select('*').eq('uid', user?.id)
        if (response.error)
          throw new Error(response.error.message)

        this.myCopilots = response.data
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
    async findAll() {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const response = await supabase.from('copilots').select('*')
        if (response.error)
          throw new Error(response.error.message)

        this.copilots = response.data
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
    async findOne(id: string) {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const response = await supabase.from('copilots').select('*').eq('id', id).single()
        if (response.error)
          throw new Error(response.error.message)

        this.copilot = response.data
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
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
          type: 'copilot',
          name: this.copilot.name,
          description: this.copilot.description,
          language: this.language,
          messages: this.messages,
        }
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(context),
          signal: controller.signal,
        })
        if (!response.ok)
          throw new Error('Request failed')
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
    },
    abort() {
      this.controller?.abort()
    },
  },
})

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { Spin, getSession } from '@firefly/common'
import type { InputInst } from 'naive-ui'
import type { ChatMessage, Context } from '~/store/copilot'
import { supabase } from '~/api'

defineOptions({ name: 'CopilotHubChatPage' })

const params = useRouteParams('id')
const copilotHubStore = useCopilotHubStore()
const userStore = useUserStore()
const inputRef = ref<InputInst | null>(null)
const currentInput = ref('')
const loading = ref(false)
const currentAssistantMessage = ref('')
const currentError = ref<string | null>(null)
const controller = ref<AbortController | null>(null)
const messages = ref<ChatMessage[]>([])

onMounted(async () => {
  if (!params.value)
    return
  await copilotHubStore.findOne(params.value as string)
})

function archiveCurrentMessage() {
  if (currentAssistantMessage) {
    messages.value = [
      ...messages.value,
      {
        role: 'assistant',
        content: currentAssistantMessage.value,
      },
    ]
    currentAssistantMessage.value = ''
    loading.value = false
    controller.value = null
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}
async function chat() {
  try {
    loading.value = true
    currentError.value = null
    controller.value = new AbortController()
    const context: Context = {
      type: 'copilot',
      copilotId: copilotHubStore.copilot?.id,
      copilotName: copilotHubStore.copilot?.name,
      copilotDescription: copilotHubStore.copilot?.description,
      messages: messages.value,
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
      signal: controller.value.signal,
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
      if (char === '\n' && currentAssistantMessage.value.endsWith('\n'))
        continue
      if (char.startsWith('{"error":')) {
        const { error } = JSON.parse(char) as { error: string }
        throw new Error(error)
      }

      if (char)
        currentAssistantMessage.value += char
    }

    loading.value = false
  }
  catch (e) {
    console.error(e)
    loading.value = false
    currentError.value = e as string
    controller.value = null
    inputRef.value?.focus()
    return
  }
  finally {
    handleCopilotInteractionsIncrement()
  }
  archiveCurrentMessage()
  // refresh user profiles
  userStore.getUserProfiles()
}
function handleAbort() {
  controller.value?.abort()
}
function createInputRef(ref: Element | ComponentPublicInstance | null) {
  // @ts-expect-error noop
  return copilotHubStore.inputRef = ref
}
function handleAskCopilot() {
  if (!currentInput.value)
    return

  messages.value = [
    ...messages.value,
    {
      role: 'user',
      content: currentInput.value,
    },
  ]
  if (!messages.value.some(({ role }) => role === 'system') && copilotHubStore.copilot?.prompt) {
    messages.value.unshift({
      role: 'system' as const,
      content: copilotHubStore.copilot.prompt,
    })
  }
  currentInput.value = ''
  nextTick(() => {
    chat()
  })
}
function handleRetry() {
  if (messages.value.length > 0) {
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage.role === 'assistant')
      messages.value = messages.value.slice(0, -1)

    chat()
  }
}

async function handleCopilotInteractionsIncrement() {
  const { error } = await supabase.rpc('handle_copilot_interactions_increment', {
    copilot_id: copilotHubStore.copilot?.id,
  })
  if (error)
    console.error('Failed to increment copilot interactions', error)
}
</script>

<template>
  <main h-full overflow-hidden>
    <div h-full p-4 flex flex-col gap-4>
      <template v-if="copilotHubStore.copilot">
        <h2 text-lg font-semibold text-center>
          {{ copilotHubStore.copilot?.name }}
        </h2>

        <ChatBox
          v-model:currentInput="currentInput"
          :hi="copilotHubStore.copilot?.description"
          :create-input-ref="createInputRef"
          :messages="messages"
          :current-assistant-message="currentAssistantMessage"
          :current-error="currentError"
          :loading="loading"
          :on-chat="handleAskCopilot"
          :on-retry="handleRetry"
          :on-abort="handleAbort"
        />
      </template>
      <template v-else>
        <div w-full h-full flex justify-center items-center>
          <Spin />
        </div>
      </template>
    </div>
  </main>
</template>

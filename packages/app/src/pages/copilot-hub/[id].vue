<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { edgeFunctions, getUser } from '@firefly/common'
import type { InputInst } from 'naive-ui'
import type { ChatMessage, Context } from '~/stores/copilot'
import { supabase } from '~/plugins/api'
import ExecutorSettings from '~/components/Executor/ExecutorSettings.vue'

const { t } = useI18n()
const dialog = useDialog()
const router = useRouter()
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
    const user = await getUser()
    if (!user) {
      dialog.error({
        title: t('common.warningTitle'),
        content: t('common.needLogin'),
        positiveText: t('common.login'),
        onPositiveClick: () => {
          router.push('/login')
        },
      })
      return
    }

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
    const response = await edgeFunctions('chat', {
      original: true,
      body: context,
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

const executorLoading = ref(false)
async function handleExecutor(range: [number, number]) {
  executorLoading.value = true
  const data = await edgeFunctions('executor', {
    body: {
      copilotId: params.value,
      range,
    },
  })
  executorLoading.value = false
  if (data) {
    messages.value.push({
      role: 'assistant',
      content: data,
    })
  }
}
function renderExecutorSettings() {
  return h(ExecutorSettings, { description: copilotHubStore.copilot?.description, onSubmit: handleExecutor, loading: executorLoading.value })
}
</script>

<template>
  <main h-full overflow-hidden>
    <div h-full flex flex-col overflow-hidden>
      <template v-if="copilotHubStore.copilot">
        <h2 p-2 text-center text-lg font-semibold>
          {{ copilotHubStore.copilot?.name }}
        </h2>

        <ChatBox
          v-model:currentInput="currentInput"
          :hi="copilotHubStore.copilot.type === 'executor' ? renderExecutorSettings : copilotHubStore.copilot?.description"
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
        <div h-full w-full flex items-center justify-center>
          <Spin />
        </div>
      </template>
    </div>
  </main>
</template>

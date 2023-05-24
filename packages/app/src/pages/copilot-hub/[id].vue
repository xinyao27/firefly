<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { edgeFunctions, getUser } from '@firefly/common'
import type { InputInst } from 'naive-ui'
import type { ChatMessage, Context } from '~/stores/copilot'
import { supabase } from '~/plugins/api'
import ExecutorSettings from '~/components/Executor/ExecutorSettings.vue'
import { appName } from '~~/constants'

const { t } = useI18n()
const dialog = useDialog()
const router = useRouter()
const params = useRouteParams('id')
const copilotHubStore = useCopilotHubStore()
const userStore = useUserStore()
const inputRef = ref<InputInst | null>(null)
const currentInput = ref('')
const loading = ref(false)
const lastStatus = ref<'chat' | 'executor' | null>(null)
const currentAssistantMessage = ref('')
const currentError = ref<string | null>(null)
const controller = ref<AbortController | null>(null)
const messages = ref<ChatMessage[]>([])
const fetchMessages = ref<ChatMessage[]>([])

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

    lastStatus.value = 'chat'
    loading.value = true
    currentError.value = null
    controller.value = new AbortController()
    const context: Context = {
      type: 'copilot',
      copilotId: copilotHubStore.copilot?.id,
      copilotName: copilotHubStore.copilot?.name,
      copilotDescription: copilotHubStore.copilot?.description,
      messages: messages.value.filter(v => v.role === 'system' || v.role === 'user' || v.role === 'assistant'),
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
    currentError.value = e as string
  }
  finally {
    handleCopilotInteractionsIncrement()
    archiveCurrentMessage()
    // refresh user profiles
    userStore.getUserProfiles()
  }
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

    if (lastStatus.value === 'chat')
      chat()
    else if (lastStatus.value === 'executor')
      handleExecutor()
  }
}
async function handleCopilotInteractionsIncrement() {
  const { error } = await supabase.rpc('handle_copilot_interactions_increment', {
    copilot_id: copilotHubStore.copilot?.id,
  })
  if (error)
    console.error('Failed to increment copilot interactions', error)
}

const lastRange = ref<[number, number] | null>(null)
async function handleExecutor(_range?: [number, number]) {
  const range = _range || lastRange.value
  if (_range)
    lastRange.value = _range
  try {
    lastStatus.value = 'executor'
    fetchMessages.value = []
    loading.value = true
    currentError.value = null
    controller.value = new AbortController()

    // 1. Get blocks
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select(`
        id,
        content,
        category,
        link,
        copilots!inner (
          id,
          name
        )
      `)
      .eq('copilots.id', copilotHubStore.copilot?.id)
      .limit(20) // 限制最大数 避免数据量过大消耗太多 token
    if (blocksError)
      throw blocksError
    messages.value.push({
      role: 'blocks',
      metadata: blocks,
    })

    // 2. fetch data
    if (blocks.length) {
      for (const block of blocks!) {
        if (block.category === 'text') {
          messages.value.push({
            role: 'fetch',
            content: block.content,
            metadata: {
              link: block.id,
            },
          })
          fetchMessages.value.push({
            role: 'fetch',
            content: block.content,
            metadata: {
              link: block.id,
            },
          })
        }
        else if (block.category === 'link') {
          const data = await edgeFunctions<{
            title?: string
            link?: string
            createdAt?: string
            author?: string
            content?: string
          }[]>(`fetch?url=${encodeURIComponent(block.link)}&range=${range?.join(',')}`, {
            method: 'GET',
            signal: controller.value.signal,
          })
          if (data?.length) {
            data.forEach((v) => {
              messages.value.push({
                role: 'fetch',
                content: v.content,
                metadata: {
                  title: v.title,
                  link: v.link,
                  createdAt: v.createdAt,
                  author: v.author,
                },
              })
              fetchMessages.value.push({
                role: 'fetch',
                content: v.content,
                metadata: {
                  title: v.title,
                  link: v.link,
                  createdAt: v.createdAt,
                  author: v.author,
                },
              })
            })
          }
        }
      }
    }

    if (fetchMessages.value.length) {
      const response = await edgeFunctions('executor', {
        original: true,
        body: {
          copilotId: params.value,
          range,
          messages: fetchMessages.value,
        },
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
    }
  }
  catch (e) {
    currentError.value = e as string
  }
  finally {
    handleCopilotInteractionsIncrement()
    archiveCurrentMessage()
  }
}
function renderExecutorSettings() {
  return h(ExecutorSettings, {
    description: copilotHubStore.copilot?.description,
    prompt: copilotHubStore.copilot?.prompt,
    onSubmit: handleExecutor,
    loading: loading.value,
  })
}
</script>

<template>
  <main h-full overflow-hidden>
    <Head>
      <Title>{{ `${copilotHubStore.copilot?.name ?? 'Copilot'} | ${appName}` }}</Title>
    </Head>

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

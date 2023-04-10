<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { Spin } from '@firefly/common'

defineOptions({ name: 'CopilotHubChatPage' })

const params = useRouteParams('id')
const copilotHubStore = useCopilotHubStore()

onMounted(async () => {
  if (!params.value)
    return
  await copilotHubStore.findOne(params.value as string)
})

function createInputRef(ref: Element | ComponentPublicInstance | null) {
  // @ts-expect-error noop
  return copilotHubStore.inputRef = ref
}

function handleAskCopilot() {
  if (!copilotHubStore.currentInput)
    return

  copilotHubStore.messages = [
    ...(
      copilotHubStore.copilot?.prompt
        ? [
            {
              role: 'system' as const,
              content: copilotHubStore.copilot.prompt,
            },
          ]
        : []
    ),
    ...copilotHubStore.messages,
    {
      role: 'user',
      content: copilotHubStore.currentInput,
    },
  ]
  copilotHubStore.currentInput = ''
  nextTick(() => {
    copilotHubStore.chat()
  })
}
function handleRetry() {
  if (copilotHubStore.messages.length > 0) {
    const lastMessage = copilotHubStore.messages[copilotHubStore.messages.length - 1]
    if (lastMessage.role === 'assistant')
      copilotHubStore.messages = copilotHubStore.messages.slice(0, -1)

    copilotHubStore.chat()
  }
}
</script>

<template>
  <main h-full overflow-hidden>
    <div h-full p-4>
      <template v-if="copilotHubStore.copilot">
        <h2>{{ copilotHubStore.copilot?.name }}</h2>

        <ChatBox
          v-model:currentInput="copilotHubStore.currentInput"
          :hi="copilotHubStore.copilot?.description"
          :create-input-ref="createInputRef"
          :messages="copilotHubStore.messages"
          :current-assistant-message="copilotHubStore.currentAssistantMessage"
          :current-error="copilotHubStore.currentError"
          :loading="copilotHubStore.loading"
          :on-chat="handleAskCopilot"
          :on-retry="handleRetry"
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

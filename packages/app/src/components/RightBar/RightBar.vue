<script setup lang="ts">
import type { MentionOption } from 'naive-ui'
import { clearHTMLTags } from '@firefly/common'

const copilotStore = useCopilotStore()
const blockStore = useBlockStore()

function createInputRef(ref: Element | ComponentPublicInstance | null) {
  // @ts-expect-error noop
  return copilotStore.inputRef = ref
}
const referenceOptions = ref<MentionOption[]>([])

function handleSearchReference() {
  copilotStore.loading = true
  referenceOptions.value = blockStore.blocks.map((block) => {
    const content = clearHTMLTags(block.content)
    return {
      value: content,
      label: content,
      updatedAt: block.updatedAt,
    }
  })
  copilotStore.loading = false
}
function handleAskCopilot() {
  if (!copilotStore.currentInput)
    return

  copilotStore.messages = [
    ...copilotStore.messages,
    {
      role: 'user',
      content: copilotStore.currentInput,
    },
  ]
  copilotStore.currentInput = ''
  nextTick(() => {
    copilotStore.chat()
  })
}
function handleRetry() {
  if (copilotStore.messages.length > 0) {
    const lastMessage = copilotStore.messages[copilotStore.messages.length - 1]
    if (lastMessage.role === 'assistant')
      copilotStore.messages = copilotStore.messages.slice(0, -1)

    copilotStore.chat()
  }
}
</script>

<template>
  <div h-full p-4>
    <ChatBox
      v-model:currentInput="copilotStore.currentInput"
      :create-input-ref="createInputRef"
      :messages="copilotStore.messages"
      :current-assistant-message="copilotStore.currentAssistantMessage"
      :current-error="copilotStore.currentError"
      :loading="copilotStore.loading"
      :on-chat="handleAskCopilot"
      :on-retry="handleRetry"
      :on-search-reference="handleSearchReference"
    />
  </div>
</template>

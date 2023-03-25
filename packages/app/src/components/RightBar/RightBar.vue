<script setup lang="ts">
import type { InputInst, MentionOption, ScrollbarInst } from 'naive-ui'
import { clearHTMLTags } from '@firefly/common'

const copilotStore = useCopilotStore()
const blockStore = useBlockStore()
const promptRef = ref<InputInst>()
// @ts-expect-error noop
const createInputRef = (ref: Element | ComponentPublicInstance | null) => copilotStore.inputRef = ref
const scrollBarRef = ref<ScrollbarInst | null>(null)
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
function handleRenderLabel(option: MentionOption) {
  return h('div', { class: 'max-w-sm py-2' }, [
    // @ts-expect-error noop
    h('div', { class: 'text-xs text-neutral' }, option.updatedAt),
    // @ts-expect-error noop
    h('div', { class: 'text-sm truncate' }, option.label),
  ])
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
function handleEnter(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey)
    handleAskCopilot()
}
const handleSmoothToBottom = useThrottleFn(() => {
  nextTick(() => {
    // @ts-expect-error noop
    scrollBarRef.value?.scrollTo({ top: scrollBarRef.value.scrollbarInstRef?.containerRef?.scrollHeight, behavior: 'smooth' })
  })
}, 300, false, true)
watch(() => copilotStore.messages, (newMessages, oldMessages) => {
  if (newMessages.length !== oldMessages.length)
    handleSmoothToBottom()
})
watch(() => copilotStore.currentAssistantMessage, (currentAssistantMessage) => {
  if (currentAssistantMessage)
    handleSmoothToBottom()
})
watch(() => copilotStore.currentError, (currentError) => {
  if (currentError)
    handleSmoothToBottom()
})
</script>

<template>
  <aside h-full flex flex-col gap-4>
    <NScrollbar
      ref="scrollBarRef"
      flex-1 p-4
    >
      <div flex justify-start overflow-hidden break-words mb-4>
        <section class="p-3 border border-(slate opacity-15) rounded">
          Hi, 请问有什么可以帮到您
        </section>
      </div>
      <div
        v-for="item in copilotStore.messages" :key="item.content"
        flex overflow-hidden break-words mb-4
        :justify="item.role === 'user' ? 'end' : 'start'"
      >
        <UserMessageItem
          v-if="item.role === 'user'"
          :message="item.content"
        />
        <AssistantMessageItem
          v-else
          :message="item.content"
        />
      </div>
      <AssistantMessageItem
        v-if="copilotStore.currentAssistantMessage"
        :message="copilotStore.currentAssistantMessage"
      />
      <section
        v-if="copilotStore.currentError"
        class="p-3 bg-(red opacity-5) rounded"
      >
        {{ copilotStore.currentError }}
        <NButton
          ml-2
          type="error"
          secondary
          size="small"
          @click="handleRetry"
        >
          重试
        </NButton>
      </section>
    </NScrollbar>

    <div p-4 flex flex-col gap-2>
      <NInput
        v-if="copilotStore.type === 'custom'"
        ref="promptRef"
        v-model:value="copilotStore.prompt"
        type="textarea"
        placeholder="输入自定义 prompt, 例如: 你是一个诗人, 你将总结这段文本并写出一首诗"
      />
      <NInputGroup>
        <NMention
          :ref="createInputRef"
          v-model:value="copilotStore.currentInput"
          type="textarea"
          :autosize="{
            minRows: 1,
            maxRows: 5,
          }"
          minlength="2"
          maxlength="500"
          :disabled="copilotStore.loading"
          :loading="copilotStore.loading"
          :options="referenceOptions"
          :render-label="handleRenderLabel"
          @search="handleSearchReference"
          @keydown.enter="handleEnter"
        />
        <NTooltip v-if="!copilotStore.loading">
          <template #trigger>
            <NButton
              type="primary"
              quaternary
              @click="handleAskCopilot"
            >
              <template #icon>
                <i i-tabler-brain />
              </template>
            </NButton>
          </template>
          Fly !
        </NTooltip>
        <NTooltip v-else>
          <template #trigger>
            <NButton
              type="primary"
              quaternary
              @click="copilotStore.abort"
            >
              <template #icon>
                <i i-ri-stop-line />
              </template>
            </NButton>
          </template>
          Stop !
        </NTooltip>
      </NInputGroup>
    </div>
  </aside>
</template>

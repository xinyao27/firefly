<script setup lang="ts">
import type { MentionOption, ScrollbarInst } from 'naive-ui'
import type { VNode } from 'vue'
import type { ChatMessage } from '~/stores/copilot'

const props = defineProps<{
  hi?: string | (() => VNode)
  messages: ChatMessage[]
  currentAssistantMessage: string
  currentError: string | null
  loading?: boolean
  createInputRef: (ref: Element | ComponentPublicInstance | null) => void
  onChat: () => void
  onAbort?: () => void
  onRetry?: () => void
  onSearchReference?: () => void
}>()
const { currentInput } = defineModels<{
  currentInput: string
}>()

const scrollBarRef = ref<ScrollbarInst | null>(null)
const referenceOptions = ref<MentionOption[]>([])

function handleRenderLabel(option: MentionOption) {
  return h('div', { class: 'max-w-sm py-2' }, [
    // @ts-expect-error noop
    h('div', { class: 'text-xs text-neutral' }, option.updatedAt),
    // @ts-expect-error noop
    h('div', { class: 'text-sm truncate' }, option.label),
  ])
}
function handleEnter(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey)
    props.onChat()
}
const handleSmoothToBottom = useThrottleFn(() => {
  nextTick(() => {
    // @ts-expect-error noop
    scrollBarRef.value?.scrollTo({ top: scrollBarRef.value.scrollbarInstRef?.containerRef?.scrollHeight, behavior: 'smooth' })
  })
}, 300, false, true)

watch(() => props.messages, (newMessages, oldMessages) => {
  if (newMessages.length !== oldMessages.length)
    handleSmoothToBottom()
})
watch(() => props.currentAssistantMessage, (currentAssistantMessage) => {
  if (currentAssistantMessage)
    handleSmoothToBottom()
})
watch(() => props.currentError, (currentError) => {
  if (currentError)
    handleSmoothToBottom()
})
</script>

<template>
  <div flex flex-1 flex-col overflow-hidden>
    <NScrollbar
      ref="scrollBarRef"
      flex-1 p-4
    >
      <div mb-4 flex justify-start overflow-hidden break-words>
        <section class="border border-(slate opacity-15) rounded p-3">
          <template v-if="typeof props.hi === 'string'">
            {{ props.hi }}
          </template>
          <template v-if="typeof props.hi === 'undefined'">
            {{ $t('copilot.hi') }}
          </template>
          <template v-if="typeof props.hi === 'function'">
            <component :is="props.hi" />
          </template>
        </section>
      </div>
      <div
        v-for="item in props.messages" :key="item.content"
        class="mb-6.5 flex overflow-hidden break-words"
        :justify="item.role === 'user' ? 'end' : 'start'"
      >
        <ChatBoxUserMessageItem
          v-if="item.role === 'user'"
          :message="item.content!"
        />
        <ChatBoxCopilotMessageItem
          v-else-if="item.role === 'assistant'"
          :message="item.content!"
        />
        <ChatBoxBlocksMessageItem
          v-else-if="item.role === 'blocks'"
          :blocks="item.metadata"
        />
        <ChatBoxFetchMessageItem
          v-else-if="item.role === 'fetch'"
          :message="item"
        />
      </div>
      <ChatBoxCopilotMessageItem
        v-if="props.currentAssistantMessage"
        :message="props.currentAssistantMessage"
      />
      <section
        v-if="props.currentError"
        class="rounded bg-(red opacity-5) p-3"
      >
        {{ props.currentError }}
        <NButton
          type="error"
          secondary
          ml-2
          size="small"
          @click="props.onRetry"
        >
          {{ $t('copilot.retry') }}
        </NButton>
      </section>
    </NScrollbar>

    <div flex flex-col gap-2 p-4>
      <NTooltip :show="props.loading">
        <template #trigger>
          <NInputGroup>
            <NMention
              :ref="props.createInputRef"
              v-model:value="currentInput"
              type="textarea"
              :autosize="{
                minRows: 1,
                maxRows: 5,
              }"
              minlength="2"
              maxlength="500"
              :disabled="props.loading"
              :loading="props.loading"
              :options="referenceOptions"
              :render-label="handleRenderLabel"
              @search="props.onSearchReference"
              @keydown.enter="handleEnter"
            />
            <NTooltip>
              <template #trigger>
                <NButton
                  type="primary"
                  quaternary
                  :disabled="currentInput?.length === 0 || props.loading"
                  @click="props.onChat"
                >
                  <template #icon>
                    <i i-ri-sparkling-2-fill />
                  </template>
                </NButton>
              </template>
              Fly !
              <div>
                <KBD :shortcut="['ctrl', 'enter']" />
              </div>
            </NTooltip>
          </NInputGroup>
        </template>
        <div
          flex="~ items-center gap-4"
          p-1
        >
          <div
            flex="~ items-center gap-1"
            text="xs neutral"
          >
            <Spin />
            {{ $t('common.loading') }}
          </div>
          <NTooltip>
            <template #trigger>
              <NButton
                size="small"
                tertiary
                @click="props.onAbort"
              >
                <template #icon>
                  <i i-ri-stop-line />
                </template>
                Stop !
              </NButton>
            </template>
          </NTooltip>
        </div>
      </NTooltip>
    </div>
  </div>
</template>

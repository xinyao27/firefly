<script setup lang="ts">
import type { MentionOption, ScrollbarInst } from 'naive-ui'
import { Spin } from '@firefly/common'
import type { ChatMessage } from '~/store/copilot'

const props = defineProps<{
  hi?: string
  currentInput: string
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
const emit = defineEmits<{
  (e: 'update:currentInput', value: string): void
}>()
const currentInput = useVModel(props, 'currentInput', emit)

const { t } = useI18n()
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
  <div flex-1 flex flex-col overflow-hidden>
    <NScrollbar
      ref="scrollBarRef"
      flex-1 p-4
    >
      <div flex justify-start overflow-hidden break-words mb-4>
        <section class="p-3 border border-(slate opacity-15) rounded">
          {{ props.hi ?? t('copilot.hi') }}
        </section>
      </div>
      <div
        v-for="item in props.messages" :key="item.content"
        flex overflow-hidden break-words mb-4
        :justify="item.role === 'user' ? 'end' : 'start'"
      >
        <UserMessageItem
          v-if="item.role === 'user'"
          :message="item.content"
        />
        <CopilotMessageItem
          v-else-if="item.role === 'assistant'"
          :message="item.content"
        />
      </div>
      <CopilotMessageItem
        v-if="props.currentAssistantMessage"
        :message="props.currentAssistantMessage"
      />
      <section
        v-if="props.currentError"
        class="p-3 bg-(red opacity-5) rounded"
      >
        {{ props.currentError }}
        <NButton
          ml-2
          type="error"
          secondary
          size="small"
          @click="props.onRetry"
        >
          {{ t('copilot.retry') }}
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
            <NTooltip v-if="!props.loading">
              <template #trigger>
                <NButton
                  type="primary"
                  quaternary
                  :disabled="currentInput.length === 0"
                  @click="props.onChat"
                >
                  <template #icon>
                    <i i-ri-openai-line />
                  </template>
                </NButton>
              </template>
              Fly !
              <div>
                <KBD :shortcut="['ctrl', 'enter']" />
              </div>
            </NTooltip>
            <NTooltip v-else>
              <template #trigger>
                <NButton
                  type="primary"
                  quaternary
                  @click="props.onAbort"
                >
                  <template #icon>
                    <i i-ri-stop-line />
                  </template>
                </NButton>
              </template>
              Stop !
            </NTooltip>
          </NInputGroup>
        </template>
        <div class="text-xs text-neutral flex items-center gap-1">
          <Spin />
          {{ t('common.loading') }}
        </div>
      </NTooltip>
    </div>
  </div>
</template>

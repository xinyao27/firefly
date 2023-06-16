<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  message: string
}>()

const md: MarkdownIt = new MarkdownIt()

const { t } = useI18n()
const blockStore = useBlockStore()

const capturing = ref(false)
const copied = ref(false)
const content = computedAsync(async () => md.render(props.message))
async function handleCapture() {
  capturing.value = true
  const block: BlockModel = {
    content: content.value,
  }
  await blockStore.save(block)
  capturing.value = false
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <NPopover
    trigger="hover"
    placement="bottom-start"
    :show-arrow="false"
  >
    <template #trigger>
      <section
        class="message"
        overflow-hidden break-words rounded px-3
        border="~ neutral opacity-30 dark:slate dark:opacity-15"
        prose="~ dark dark:white"
        v-html="content"
      />
    </template>
    <div mt--1 flex>
      <NTooltip style="width: max-content">
        <template #trigger>
          <NButton
            quaternary
            size="tiny"
            @click="handleCapture"
          >
            <Spin v-if="capturing" />
            <i v-else-if="!copied" i-ri-screenshot-line text-neutral />
            <i v-else i-ri-check-fill text-green />
          </NButton>
        </template>
        {{ t('assistant.clipping') }}
      </NTooltip>
      <Copyable
        type="button"
        :text="props.message"
      />
    </div>
  </NPopover>
</template>

<style scoped lang="sass">
.message
  code
    @apply font-mono bg-neutral-600 text-neutral text-xs p-1 rounded-sm before:content-[""] after:content-[""]
</style>

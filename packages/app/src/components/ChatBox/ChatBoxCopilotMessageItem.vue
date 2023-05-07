<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { md } from '@firefly/common'

const props = defineProps<{
  message: string
}>()

const { t } = useI18n()
const blockStore = useBlockStore()

const capturing = ref(false)
const copied = ref(false)
async function handleCapture() {
  capturing.value = true
  const block: BlockModel = {
    content: md.render(props.message),
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
        class="message overflow-hidden break-words border border-(slate opacity-15) rounded px-3 prose prose-white"
        v-html="md.render(props.message)"
      />
    </template>
    <div flex mt--1>
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

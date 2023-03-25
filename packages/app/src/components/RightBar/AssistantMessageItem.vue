<script setup lang="ts">
import type { BlockModel } from '@firefly/common'

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
    content: props.message,
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
    placement="left"
    :show-arrow="false"
  >
    <template #trigger>
      <section class="p-3 border border-(slate opacity-15) rounded overflow-hidden break-words">
        {{ props.message }}
      </section>
    </template>
    <div flex flex-col>
      <NTooltip placement="left">
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
        {{ t('assistant.capture') }}
      </NTooltip>
      <Copyable
        type="button"
        :text="props.message"
        placement="left"
      />
    </div>
  </NPopover>
</template>

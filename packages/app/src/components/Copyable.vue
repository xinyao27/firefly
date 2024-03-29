<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui'
import copy from 'copy-to-clipboard'

const props = defineProps<{
  class?: string
  type: 'text' | 'area' | 'button'
  text: string
  placement?: PopoverPlacement
}>()

const { t } = useI18n()

const copied = ref(false)
async function handleCopyResult() {
  copy(props.text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <template v-if="props.type === 'area'">
    <div
      class="area"
      :class="props.class"
      relative
    >
      <slot />
      <NTooltip :placement="props.placement" style="width: max-content">
        <template #trigger>
          <NButton
            class="copy absolute right-2 top-2 hidden"
            quaternary
            size="tiny"
            @click="handleCopyResult"
          >
            <i v-if="!copied" i-ri-file-copy-line text-neutral />
            <i v-else i-ri-check-fill text-green />
          </NButton>
        </template>
        <span v-if="!copied">{{ t('common.copy') }}</span>
        <span v-else>{{ t('common.copied') }}</span>
      </NTooltip>
    </div>
  </template>
  <template v-if="props.type === 'text'">
    <div flex items-center gap-1>
      <span
        max-w-50 truncate
        :class="props.class"
      >
        <slot />
      </span>
      <NTooltip :placement="props.placement" style="width: max-content">
        <template #trigger>
          <NButton
            class="copy"
            quaternary
            size="tiny"
            @click="handleCopyResult"
          >
            <i v-if="!copied" i-ri-file-copy-line text-neutral />
            <i v-else i-ri-check-fill text-green />
          </NButton>
        </template>
        <span v-if="!copied">{{ t('common.copy') }}</span>
        <span v-else>{{ t('common.copied') }}</span>
      </NTooltip>
    </div>
  </template>
  <template v-if="props.type === 'button'">
    <NTooltip :placement="props.placement" style="width: max-content">
      <template #trigger>
        <NButton
          class="copy"
          :class="props.class"
          quaternary
          size="tiny"
          @click="handleCopyResult"
        >
          <i v-if="!copied" i-ri-file-copy-line text-neutral />
          <i v-else i-ri-check-fill text-green />
        </NButton>
      </template>
      <span v-if="!copied">{{ t('common.copy') }}</span>
      <span v-else>{{ t('common.copied') }}</span>
    </NTooltip>
  </template>
</template>

<style scoped lang="sass">
.area
  &:hover
    .copy
      @apply block
</style>

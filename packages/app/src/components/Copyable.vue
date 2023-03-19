<script setup lang="ts">
const props = defineProps<{
  type: 'text' | 'area'
  text: string
}>()

const copied = ref(false)
async function handleCopyResult() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <template v-if="props.type === 'area'">
    <div class="area" relative>
      <slot />
      <NTooltip>
        <template #trigger>
          <NButton
            class="copy hidden absolute top-2 right-2"
            text
            size="small"
            @click="handleCopyResult"
          >
            <i v-if="!copied" i-ri-file-copy-line text-neutral />
            <i v-else i-ri-check-fill text-green />
          </NButton>
        </template>
        <span v-if="!copied">复制</span>
        <span v-else>已复制</span>
      </NTooltip>
    </div>
  </template>
  <template v-if="props.type === 'text'">
    <div flex items-center gap-1>
      <span max-w-50 truncate>
        <slot />
      </span>
      <NTooltip>
        <template #trigger>
          <NButton
            class="copy"
            text
            size="small"
            @click="handleCopyResult"
          >
            <i v-if="!copied" i-ri-file-copy-line text-neutral />
            <i v-else i-ri-check-fill text-green />
          </NButton>
        </template>
        <span v-if="!copied">复制</span>
        <span v-else>已复制</span>
      </NTooltip>
    </div>
  </template>
</template>

<style scoped lang="sass">
.area
  &:hover
    .copy
      @apply block
</style>

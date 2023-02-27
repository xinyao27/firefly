<script setup lang="ts">
const props = defineProps<{
  shortcut?: string[]
}>()
</script>

<template>
  <div
    v-if="props.shortcut"
    text-neutral-600 bg-neutral-400 px-1 font-mono font-bold leading-normal tracking-wide
    uppercase rounded inline-flex items-center align-middle gap-1
  >
    <i i-ri-keyboard-box-fill block />
    <kbd>{{ props.shortcut.join('+') }}</kbd>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  shortcut?: string[]
}>()
</script>

<template>
  <div
    v-if="props.shortcut"
    text-neutral-600 bg-neutral-300 px-1 font-mono font-bold leading-normal tracking-wide
    uppercase rounded-sm inline-flex items-center align-middle gap-1
  >
    <i i-ri-keyboard-box-fill />
    <kbd>{{ props.shortcut.join('+') }}</kbd>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  shortcut?: string[]
  showIcon?: boolean
}>(), {
  showIcon: true,
})
</script>

<template>
  <div
    v-if="props.shortcut"
    text-neutral-600 bg-neutral-300 px-1 font-mono font-bold leading-normal tracking-wide
    uppercase rounded-sm inline-flex items-center align-middle gap-1
  >
    <i v-if="props.showIcon" i-ri-keyboard-box-fill />
    <kbd>{{ props.shortcut.join('+') }}</kbd>
  </div>
</template>

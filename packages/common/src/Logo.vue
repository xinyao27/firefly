<script setup lang="ts">
const props = defineProps<{
  white?: boolean
}>()
</script>

<template>
  <a href="#">
    <span
      class="root"
      :class="props.white ? 'white' : 'colorful'"
      data-tauri-drag-region
    >
      Firefly
    </span>
  </a>
</template>

<style scoped lang="sass">
.root
  @apply text-(2xl transparent) font-extrabold  select-none
  &.white
    @apply bg-(clip-text white)
  &.colorful
    @apply bg-(clip-text gradient-to-r) from-purple to-rose
</style>

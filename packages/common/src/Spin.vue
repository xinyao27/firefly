<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <i
    i-ri-loader-2-line inline-block animate-spin
    :class="props.class"
  />
</template>

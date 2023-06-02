<script setup lang="ts">
const props = defineProps<{
  message: string
}>()
</script>

<template>
  <section
    overflow-hidden break-words rounded p-3
    bg="~ slate opacity-30 dark:slate dark:opacity-15"
  >
    {{ props.message }}
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
}>()
</script>

<template>
  <section class="overflow-hidden break-words rounded bg-(slate opacity-15) p-3">
    {{ props.message }}
  </section>
</template>

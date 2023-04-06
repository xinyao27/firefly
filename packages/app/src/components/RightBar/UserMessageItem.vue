<script setup lang="ts">
const props = defineProps<{
  message: string
}>()
</script>

<template>
  <section class="p-3 bg-(slate opacity-15) rounded overflow-hidden break-words">
    {{ props.message }}
  </section>
</template>

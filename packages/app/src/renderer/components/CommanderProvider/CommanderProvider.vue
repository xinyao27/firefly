<script setup lang="ts">
import Commander from './Commander.vue'

const commanderStore = useCommanderStore()
</script>

<template>
  <slot />
  <NModal
    v-model:show="commanderStore.show"
    transform-origin="center"
    display-directive="show"
  >
    <Commander />
  </NModal>
</template>

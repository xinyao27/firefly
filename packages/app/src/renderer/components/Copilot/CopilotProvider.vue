<script setup lang="ts">
import Copilot from './Copilot.vue'

const copilotStore = useCopilotStore()
</script>

<template>
  <slot />
  <NModal
    v-model:show="copilotStore.show"
    transform-origin="center"
    display-directive="show"
    :mask-closable="!copilotStore.loading"
  >
    <Copilot />
  </NModal>
</template>

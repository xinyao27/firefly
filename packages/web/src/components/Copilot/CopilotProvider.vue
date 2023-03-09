<script setup lang="ts">
import Copilot from './Copilot.vue'

const copilotStore = useCopilotStore()

onKeyStroke(['Ctrl', 'l'], (e) => {
  e.preventDefault()
  if (!copilotStore.show)
    copilotStore.show = true
})
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

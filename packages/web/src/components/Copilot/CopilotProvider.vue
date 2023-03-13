<script setup lang="ts">
import Copilot from './Copilot.vue'

const copilotStore = useCopilotStore()

onKeyStroke(['Ctrl', 'l'], (e) => {
  e.preventDefault()
  if (!copilotStore.show)
    copilotStore.open('create')
})
</script>

<template>
  <slot />

  <NModal
    v-model:show="copilotStore.show"
    transform-origin="center"
    display-directive="if"
    :mask-closable="copilotStore.closable"
    @after-leave="copilotStore.close"
  >
    <Copilot class="w-600px shadow-lg rounded-2" />
  </NModal>
</template>

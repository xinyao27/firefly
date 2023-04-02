<script setup lang="ts">
const textEditorStore = useTextEditorStore()
const configStore = useConfigStore()
</script>

<template>
  <NModal
    v-model:show="textEditorStore.show"
    transform-origin="center"
    :mask-closable="!configStore.isMobileScreen"
  >
    <TextEditor />
  </NModal>
  <slot />
</template>

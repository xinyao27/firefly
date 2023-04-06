<script setup lang="ts">
const textEditorStore = useTextEditorStore()
const configStore = useConfigStore()
</script>

<template>
  <NModal
    v-model:show="textEditorStore.show"
    class="px-2"
    transform-origin="center"
    :mask-closable="!configStore.isMobileScreen"
  >
    <TextEditor
      v-model="textEditorStore.value"
      class="max-h-80 shadow-none"
      :pinned="false"
    />
  </NModal>
  <slot />
</template>

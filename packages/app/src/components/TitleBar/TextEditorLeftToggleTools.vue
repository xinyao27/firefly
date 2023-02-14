<script setup lang="ts">
const configStore = useConfigStore()
</script>

<template>
  <div flex gap-1>
    <NButton
      size="small"
      :tertiary="configStore.textEditorLeftToggleTool === 'fileList'"
      :quaternary="configStore.textEditorLeftToggleTool !== 'fileList'"
      @click="configStore.textEditorLeftToggleTool = 'fileList'"
    >
      <i i-ri-folder-line />
    </NButton>
    <NButton
      size="small"
      :tertiary="configStore.textEditorLeftToggleTool === 'search'"
      :quaternary="configStore.textEditorLeftToggleTool !== 'search'"
      @click="configStore.textEditorLeftToggleTool = 'search'"
    >
      <i i-ri-search-line />
    </NButton>
  </div>
</template>

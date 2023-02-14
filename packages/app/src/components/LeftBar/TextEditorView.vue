<script setup lang="ts">
import TextEditorFileList from './TextEditorFileList.vue'
import TextEditorSearch from './TextEditorSearch.vue'

const configStore = useConfigStore()
</script>

<template>
  <TextEditorFileList v-show="configStore.textEditorLeftToggleTool === 'fileList'" />
  <TextEditorSearch v-show="configStore.textEditorLeftToggleTool === 'search'" />
</template>

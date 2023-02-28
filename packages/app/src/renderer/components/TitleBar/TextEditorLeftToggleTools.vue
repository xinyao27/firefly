<script setup lang="ts">
const configStore = useConfigStore()
</script>

<template>
  <div flex gap-1>
    <NButton
      size="small"
      :tertiary="configStore.leftCurrentTool === 'blockList'"
      :quaternary="configStore.leftCurrentTool !== 'blockList'"
      @click="configStore.leftCurrentTool = 'blockList'"
    >
      <i i-ri-folder-line />
    </NButton>
    <NButton
      size="small"
      :tertiary="configStore.leftCurrentTool === 'search'"
      :quaternary="configStore.leftCurrentTool !== 'search'"
      @click="configStore.leftCurrentTool = 'search'"
    >
      <i i-ri-search-line />
    </NButton>
  </div>
</template>

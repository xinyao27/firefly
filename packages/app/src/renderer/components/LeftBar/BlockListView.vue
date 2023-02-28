<script setup lang="ts">
const blockStore = useBlockStore()
</script>

<template>
  <div h-full flex flex-col>
    <div flex items-center justify-center gap-2 p-2>
      <NButton
        quaternary
        size="small"
        @click="blockStore.createArticle"
      >
        <i i-ri-edit-2-line />
      </NButton>
      <NButton
        quaternary
        size="small"
        @click="blockStore.createFolder"
      >
        <i i-ri-folder-add-line />
      </NButton>
    </div>

    <List />
  </div>
</template>

<script setup lang="ts">
const messageStore = useMessageStore()
</script>

<template>
  <div h-full p-4 flex flex-col gap-2>
    <div flex items-center justify-center gap-2>
      <NButton
        quaternary
        size="tiny"
        @click="messageStore.createArticle"
      >
        <i i-ri-edit-2-line />
      </NButton>
      <NButton
        quaternary
        size="tiny"
        @click="messageStore.createFolder"
      >
        <i i-ri-folder-add-line />
      </NButton>
    </div>

    <List />
  </div>
</template>

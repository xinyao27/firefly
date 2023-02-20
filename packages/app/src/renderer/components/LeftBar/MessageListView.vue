<script setup lang="ts">
const messageStore = useMessageStore()
</script>

<template>
  <div h-full p-4 flex flex-col gap-2>
    <div flex items-center justify-center>
      <NButton
        quaternary
        size="tiny"
        @click="messageStore.createArticle"
      >
        <i i-ri-edit-2-line />
      </NButton>
    </div>

    <DragProvider>
      <List />
    </DragProvider>
  </div>
</template>

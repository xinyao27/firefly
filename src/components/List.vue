<script setup lang="ts">
const messagesStore = useMessagesStore()
const configsStore = useConfigsStore()
</script>

<template>
  <div relative z-34 flex flex-wrap gap-3 overflow-x-hidden overflow-y-auto overscroll-contain>
    <ListCard
      v-for="item in messagesStore.all" :key="item.id"
      :message="item"
      :size="configsStore.cardSize"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'IndexPage' })
const messagesStore = useMessagesStore()
const configsStore = useConfigsStore()
</script>

<template>
  <div flex flex-wrap gap-3 overflow-x-hidden overflow-y-auto overscroll-contain>
    <ListCard
      v-for="item in messagesStore.all" :key="item.id"
      :message="item"
      :size="configsStore.cardSize"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

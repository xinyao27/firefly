<script setup lang="ts">
import MessageListView from './MessageListView.vue'
import SearchView from './SearchView.vue'

const configStore = useConfigStore()
</script>

<template>
  <aside h-full style="border-right: 1px solid var(--n-border-color)">
    <MessageListView v-show="configStore.leftCurrentTool === 'messageList'" />
    <SearchView v-show="configStore.leftCurrentTool === 'search'" />
  </aside>
</template>

<script setup lang="ts">
import BlockListView from './BlockListView.vue'
import SearchView from './SearchView.vue'

const configStore = useConfigStore()
</script>

<template>
  <aside h-full style="border-right: 1px solid var(--n-border-color)">
    <BlockListView v-show="configStore.leftCurrentTool === 'blockList'" />
    <SearchView v-show="configStore.leftCurrentTool === 'search'" />
  </aside>
</template>

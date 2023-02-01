<script setup lang="ts">
import ListSearch from './ListSearch.vue'
import TextEditorSearch from './TextEditorSearch.vue'

const route = useRoute()
</script>

<template>
  <aside h-full style="border-right: 1px solid var(--n-border-color)">
    <ListSearch v-if="route.path === '/'" />
    <TextEditorSearch v-else-if="route.path === '/text-editor'" />
  </aside>
</template>

<script setup lang="ts">
import ListSearch from './ListSearch.vue'
import TextEditorSearch from './TextEditorSearch.vue'

const route = useRoute()
</script>

<template>
  <aside min-h-full flex flex-col items-center justify-between bg-neutral-800>
    <ListSearch v-if="route.path === '/'" />
    <TextEditorSearch v-else-if="route.path === '/text-editor'" />
  </aside>
</template>

<script setup lang="ts">
import Detail from './Detail.vue'
import TextEditorSearch from './TextEditorSearch.vue'

const route = useRoute()
</script>

<template>
  <aside min-h-full flex flex-col items-center justify-between bg-neutral-800>
    <Detail v-if="route.path === '/'" />
    <TextEditorSearch v-else-if="route.path === '/text-editor'" />
  </aside>
</template>

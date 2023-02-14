<script setup lang="ts">
import HomeView from './HomeView.vue'
import TextEditorSearch from './TextEditorView.vue'

const route = useRoute()
</script>

<template>
  <aside min-h-full flex flex-col items-center justify-between bg-neutral-800>
    <HomeView v-if="route.path === '/'" />
    <TextEditorSearch v-else-if="route.path === '/text-editor'" />
  </aside>
</template>

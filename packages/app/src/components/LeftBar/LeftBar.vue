<script setup lang="ts">
import HomeView from './HomeView.vue'
import TextEditorView from './TextEditorView.vue'

const route = useRoute()
</script>

<template>
  <aside h-full style="border-right: 1px solid var(--n-border-color)">
    <HomeView v-if="route.path === '/'" />
    <TextEditorView v-else-if="route.path === '/text-editor'" />
  </aside>
</template>

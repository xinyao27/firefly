<script setup lang="ts">
defineOptions({ name: 'TextEditorPage' })

const route = useRoute()
const configStore = useConfigStore()
const textEditorStore = useTextEditorStore()

onMounted(() => {
  const from = route.query.from
  if (from === 'search') {
    configStore.rightBarCollapsed = false
  }
  configStore.leftBarCollapsed = false

  textEditorStore.findArticles()
})
</script>

<template>
  <TextEditorPro />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

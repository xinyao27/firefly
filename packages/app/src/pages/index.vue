<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
onBeforeMount(() => {
  configStore.setTitle('')
})
</script>

<template>
  <DragProvider>
    <List />
  </DragProvider>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

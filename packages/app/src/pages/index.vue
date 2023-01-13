<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
onBeforeMount(() => {
  configStore.setTitle('')
})
</script>

<template>
  <List />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

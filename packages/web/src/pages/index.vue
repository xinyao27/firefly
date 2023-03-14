<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  blockStore.sync()
})
</script>

<template>
  <main h-full flex flex-col overflow-hidden>
    <List />
    <Copilot />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

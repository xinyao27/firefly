<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  blockStore.find()
})
</script>

<template>
  <main h-full overflow-auto>
    <List />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

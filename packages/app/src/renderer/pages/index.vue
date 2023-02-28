<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()

const visibility = useDocumentVisibility()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  blockStore.find()
})
watch(
  visibility,
  (f) => {
    if (f)
      blockStore.find()
  },
  { deep: true },
)
</script>

<template>
  <template v-if="blockStore.currentBlockId">
    <TextEditorPro
      v-if="blockStore.currentBlock?.category === 'article'"
    />
  </template>
  <Empty v-else />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

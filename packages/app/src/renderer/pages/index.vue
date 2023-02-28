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
  <TextEditorPro
    v-show="blockStore.currentBlockId && blockStore.currentBlock?.category === 'article'"
  />
  <Empty v-show="!blockStore.currentBlockId" />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

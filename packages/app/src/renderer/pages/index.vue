<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const messageStore = useMessageStore()

const visibility = useDocumentVisibility()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  messageStore.find()
})
watch(
  visibility,
  (f) => {
    if (f) {
      messageStore.find()
    }
  },
  { deep: true },
)
</script>

<template>
  <TextEditorPro
    v-if="messageStore.currentMessageId && messageStore.currentMessage?.category === 'article'"
  />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

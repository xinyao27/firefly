<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const messageStore = useMessageStore()

const focused = useWindowFocus()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  messageStore.find()
})
watch(
  focused,
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

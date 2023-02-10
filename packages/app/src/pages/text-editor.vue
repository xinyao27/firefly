<script setup lang="ts">
defineOptions({ name: 'TextEditorPage' })

const route = useRoute()
const configStore = useConfigStore()
const articleStore = useArticleStore()
const focused = useWindowFocus()

onMounted(() => {
  const from = route.query.from
  if (from === 'search') {
    configStore.rightBarCollapsed = false
  }
  configStore.leftBarCollapsed = false

  articleStore.find()
})
watch(
  focused,
  (f) => {
    if (f) {
      articleStore.find()
    }
  },
  { deep: true },
)
</script>

<template>
  <TextEditorPro
    v-if="articleStore.currentArticleId"
  />
</template>

<route lang="yaml">
meta:
  layout: default
</route>

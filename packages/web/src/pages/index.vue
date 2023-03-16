<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()

onBeforeMount(() => {
  configStore.setTitle('')
})

const router = useRouter()

onMounted(() => {
  blockStore.sync()

  router.afterEach(async (to, from) => {
    if (to.query.tag)
      await blockStore.search({ tag: to.query.tag as string })
    else if (from.query.tag)
      await blockStore.refresh()
  })
})
</script>

<template>
  <main h-full flex flex-col overflow-hidden>
    <List :data="blockStore.blocks" />
    <Copilot />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
defineOptions({ name: 'InboxPage' })

const router = useRouter()
const blockStore = useBlockStore()

onMounted(async () => {
  router.afterEach(async (to, from) => {
    if (to.query.tag)
      await blockStore.search({ tag: to.query.tag as string })
    else if (from.query.tag)
      await blockStore.refresh()
  })

  setTimeout(async () => {
    await blockStore.sync()
  }, 0)
})
</script>

<template>
  <main h-full overflow-hidden>
    <List :data="blockStore.blocks" />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const router = useRouter()
const blockStore = useBlockStore()

router.afterEach(async (to, from) => {
  if (to.query.tag)
    await blockStore.search({ tag: to.query.tag as string })
  else if (from.query.tag)
    await blockStore.refresh()
})
onMounted(async () => {
  await blockStore.sync()
})
</script>

<template>
  <main h-full overflow-hidden>
    <List :data="blockStore.blocks" />
  </main>
</template>

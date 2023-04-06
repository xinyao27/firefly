<script setup lang="ts">
defineOptions({ name: 'InboxPage' })

const router = useRouter()
const userStore = useUserStore()
const blockStore = useBlockStore()

onMounted(async () => {
  router.afterEach(async (to, from) => {
    if (to.query.tag)
      await blockStore.search({ tag: to.query.tag as string })
    else if (from.query.tag)
      await blockStore.refresh()
  })

  const profiles = await userStore.getUserProfiles()

  if (!profiles.token) {
    // 如果没有 token 自动生成一个
    await userStore.generateToken()
  }

  await blockStore.sync()
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

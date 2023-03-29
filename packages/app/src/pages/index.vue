<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const router = useRouter()
const blockStore = useBlockStore()
const userStore = useUserStore()

onMounted(async () => {
  const profiles = await userStore.getUserProfiles()
  if (!profiles.token) {
    // 如果没有 token 自动生成一个
    await userStore.generateToken()
  }

  await blockStore.sync()

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
    <TextEditor />
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

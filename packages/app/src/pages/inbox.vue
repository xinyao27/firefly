<script setup lang="ts">
import { getUser } from '@firefly/common'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const blockStore = useBlockStore()

onMounted(async () => {
  const user = await getUser()
  if (!user) {
    router.push('/login')
    return
  }

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

<script setup lang="ts">
import { appName } from '~~/constants'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const blockStore = useBlockStore()

useHead({
  title: `Inbox | ${appName}`,
})

router.afterEach(async (to, from) => {
  if (to.query.tag || to.query.query)
    await blockStore.search({ tag: to.query.tag as string, query: to.query.query as string })
  else if (from.query.tag || from.query.query)
    await blockStore.refresh()
})
</script>

<template>
  <main flex="~ col 1">
    <TitleBar />
    <div flex-1 overflow-auto p-4>
      <List :data="blockStore.blocks" />
    </div>
  </main>
</template>

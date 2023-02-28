<script setup lang="ts">
import type { BlockId } from '~/models/Block'

defineOptions({ name: 'PreviewPage' })

const route = useRoute()
const blockStore = useBlockStore()
const configStore = useConfigStore()
const { state, isReady, isLoading } = useAsyncState(
  blockStore.findOne(route.params.id as BlockId),
  null,
  {
    onSuccess(data) {
      if (data?.title) {
        configStore.setTitle(data.title)
      }
    },
  },
)

watchEffect(() => {
  // TODO
  // eslint-disable-next-line no-console
  console.log({ state, isReady, isLoading })
})
</script>

<template>
  <div>preview {{ route.params.id }}</div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import type { ID } from '~~/models/Message'

defineOptions({ name: 'PreviewPage' })

const route = useRoute()
const messageStore = useMessageStore()
const configStore = useConfigStore()
const { state, isReady, isLoading } = useAsyncState(
  messageStore.findOne(route.params.id as ID),
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

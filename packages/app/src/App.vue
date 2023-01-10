<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import log from 'electron-log'
import { useMessagesStore } from '~/store/messages'

const store = useMessagesStore()
const focused = useWindowFocus()
const findMessages = useDebounceFn(async() => {
  try {
    await store.findMessages()
  }
  catch (e) {
    log.error('There was a problem initializing the database', e)
  }
}, 1000)
watch(
  focused,
  (f) => {
    if (f) {
      findMessages()
    }
  },
  { deep: true },
)
onMounted(async() => {
  await findMessages()
})
</script>

<template>
  <ThemeProvider>
    <ContextMenuProvider>
      <CustomProvider>
        <TitleBar />
        <RouterView />
      </CustomProvider>
    </ContextMenuProvider>
  </ThemeProvider>
</template>

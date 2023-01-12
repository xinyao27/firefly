<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import log from 'electron-log'
import { useMessageStore } from '~/store/message'

const store = useMessageStore()
const focused = useWindowFocus()
const find = useDebounceFn(async() => {
  try {
    await store.find()
  }
  catch (e) {
    log.error('There was a problem initializing the database', e)
  }
}, 1000)
watch(
  focused,
  (f) => {
    if (f) {
      find()
    }
  },
  { deep: true },
)
onMounted(async() => {
  await find()
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

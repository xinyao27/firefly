<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { useMessagesStore } from '~/store/messages'

const store = useMessagesStore()
onMounted(async() => {
  try {
    await store.initializeDbBackedStore()
  }
  catch (e) {
    console.error('There was a problem initializing the database', e)
  }
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

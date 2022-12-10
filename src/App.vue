<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const store = useStore()
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
  <NConfigProvider :theme="darkTheme">
    <TitleBar />
    <RouterView />
  </NConfigProvider>
</template>

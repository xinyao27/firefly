<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { bindOCRHotkey, bindSelectedTextHotkey, unBindAll } from './utils'

onMounted(() => {
  bindSelectedTextHotkey()
  bindOCRHotkey()
})
onUnmounted(() => {
  unBindAll()
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <RouterView />
    </CustomProvider>
  </ThemeProvider>
</template>

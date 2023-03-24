<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { is } from '@firefly/common'
import { bindOCRHotkey, bindSelectedTextHotkey, unBindAll } from './utils'

onMounted(() => {
  if (is.isDesktop()) {
    bindSelectedTextHotkey()
    bindOCRHotkey()
  }
})
onUnmounted(() => {
  if (is.isDesktop())
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

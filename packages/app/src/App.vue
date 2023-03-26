<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { is } from '@firefly/common'
import { bindHotkey, bindOCRHotkey, unBindAll } from './utils'
import { $i18n } from './i18n'

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  $i18n.locale.value = locale ?? 'en'
})
onMounted(() => {
  if (is.isDesktop()) {
    bindHotkey()
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

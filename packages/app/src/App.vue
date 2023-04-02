<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { $i18n } from './i18n'

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  $i18n.locale.value = locale ?? 'en'
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <TextEditorProvider>
        <RouterView />
      </TextEditorProvider>
    </CustomProvider>
  </ThemeProvider>
</template>

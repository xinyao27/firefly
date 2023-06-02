<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { useColorMode } from '@vueuse/core'
import { darkThemeOverrides, themeOverrides } from '@firefly/theme'

const { system, store } = useColorMode()
const theme = computed(() => store.value === 'auto' ? system.value : store.value)
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme === 'dark' ? darkTheme : null"
    :theme-overrides="theme === 'dark' ? darkThemeOverrides : themeOverrides"
  >
    <NMessageProvider
      keep-alive-on-hover
      container-style="top: 52px"
    >
      <NDialogProvider>
        <slot />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

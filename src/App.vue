<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import { colors } from 'unocss/preset-mini'
import { useMessagesStore } from '~/store/messages'

const themeOverrides: GlobalThemeOverrides = {
  common: {
  // @ts-expect-error noop
    primaryColor: colors?.blue['500'],
  },
}

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
  <NConfigProvider :theme-overrides="themeOverrides">
    <TitleBar />
    <RouterView />
  </NConfigProvider>
</template>

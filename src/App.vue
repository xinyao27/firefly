<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { colors } from 'unocss/preset-mini'
import { useMessagesStore } from '~/store/messages'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    // @ts-expect-error noop
    primaryColor: colors?.blue['500'],
    // @ts-expect-error noop
    primaryColorHover: colors?.blue['400'],
    // @ts-expect-error noop
    primaryColorPressed: colors?.blue['600'],
    // @ts-expect-error noop
    primaryColorSuppl: colors?.blue['500'],
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
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <NMessageProvider :keep-alive-on-hover="true" container-style="top: 52px;">
      <TitleBar />
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>

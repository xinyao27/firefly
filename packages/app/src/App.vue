<script setup lang="ts">
import { is } from '@firefly/common'
import { ThemeProvider } from '@firefly/theme'
import { loadLanguageAsync } from '~/modules/i18n'

useHead({
  title: 'Firefly',
  meta: [
    {
      name: 'Firefly',
      content: 'Firefly is a fragment information collection tool, which combines the data analysis ability of AI to make information collection so interesting',
    },
  ],
})
useSeoMeta({
  title: 'Firefly',
  description: 'Firefly is a fragment information collection tool, which combines the data analysis ability of AI to make information collection so interesting',
  ogDescription: 'Firefly is a fragment information collection tool, which combines the data analysis ability of AI to make information collection so interesting',
  ogTitle: 'Firefly',
  ogImage: 'https://firefly.best/icon.png',
  twitterCard: 'summary_large_image',
})

const settings = useSettings()

watch(() => settings.value.i18n, (locale) => {
  loadLanguageAsync(locale ?? 'en')
})

onMounted(() => {
  if (is.desktop()) {
    document.body.classList.add('overflow-hidden')
    document.body.classList.add('overscroll-none')
  }
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <InjectProvider>
        <RouterView />
      </InjectProvider>
    </CustomProvider>
  </ThemeProvider>
</template>

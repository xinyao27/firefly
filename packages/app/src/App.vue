<script setup lang="ts">
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

const settings = useSettings()

watch(() => settings.value.i18n, (locale) => {
  loadLanguageAsync(locale ?? 'en')
})
</script>

<template>
  <CustomProvider>
    <RouterView />
  </CustomProvider>
</template>

<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { $i18n } from '~/modules/i18n'

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
  $i18n.locale.value = locale ?? 'en'
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <AssistantProvider>
        <RouterView />
      </AssistantProvider>
    </CustomProvider>
  </ThemeProvider>
</template>

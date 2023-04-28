<script setup lang="ts">
import '@total-typescript/ts-reset'
import { is } from '@firefly/common'
import { ThemeProvider, colorDark, colorPrimary } from '@firefly/theme'

onMounted(() => {
  const { APP_VERSION } = useRuntimeConfig()
  // eslint-disable-next-line no-console
  console.log(
    `%c Firefly %c v${APP_VERSION} %c`,
    `background:${colorDark}; padding: 2px 1px; color: #FFF`,
    `background:${colorPrimary.default}; padding: 2px 1px; color: #FFF`,
    'background:transparent',
  )

  if (is.desktop()) {
    document.body.classList.add('overflow-hidden')
    document.body.classList.add('overscroll-none')
  }
})
</script>

<template>
  <ThemeProvider>
    <Inject />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ThemeProvider>
</template>

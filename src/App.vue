<script setup lang="ts">
import { darkTheme } from 'naive-ui'

// https://github.com/vueuse/head
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

const store = useStore()
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
  <n-config-provider :theme="darkTheme">
    <n-theme-editor>
      <TitleBar />
      <RouterView />
    </n-theme-editor>
  </n-config-provider>
</template>

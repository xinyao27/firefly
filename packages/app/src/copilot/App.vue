<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { Logo } from '@firefly/common'
import Editor from '@firefly/editor'
import { ref } from 'vue'
import type { Event } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
import Pin from './Pin.vue'

const value = ref('')

onMounted(() => {
  let unlisten
  ;(async () => {
    unlisten = await listen('change-text', async (event: Event<string>) => {
      const selectedText = event.payload
      if (selectedText)
        value.value = selectedText
    })
  })()
  return unlisten
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <main>
        <header
          data-tauri-drag-region
          flex justify-between items-center
        >
          <Logo />
          <Pin />
        </header>
        <Editor
          v-model="value"
          :tags="[]"
        />
      </main>
    </CustomProvider>
  </ThemeProvider>
</template>

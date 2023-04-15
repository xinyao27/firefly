<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import { is } from '@firefly/common'
import type { Event } from '@tauri-apps/api/event'
import type { Editor } from '@tiptap/core'
import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { loadLanguageAsync } from '~/modules/i18n'

const assistantStore = useAssistantStore()
const editor = ref<Editor>()

async function handleClose() {
  assistantStore.value = ''
  await invoke('hide_assistant_window')
}

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  loadLanguageAsync(locale ?? 'en')
})

onMounted(
  () => {
    let unlisten
    ;(async () => {
      unlisten = await listen('change-text', async (event: Event<string>) => {
        const selectedText = event.payload
        if (selectedText) {
          editor.value?.commands.focus()
          assistantStore.value = selectedText
        }
      })
    })()
    return unlisten
  },
)
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <Assistant
        v-model="assistantStore.value"
        class="max-h-20"
        :on-close="handleClose"
        :show-close="!is.macOS()"
        pinned
      />
    </CustomProvider>
  </ThemeProvider>
</template>

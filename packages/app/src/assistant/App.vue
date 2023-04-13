<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import type { BlockModel } from '@firefly/common'
import { is } from '@firefly/common'
import type { Event } from '@tauri-apps/api/event'
import type { Editor } from '@tiptap/core'
import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { loadLanguageAsync } from '~/modules/i18n'

const block = ref<BlockModel>({ content: '' })
const editor = ref<Editor>()

async function handleClose() {
  block.value = { content: '' }
  await invoke('hide_assistant_window')
}

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  loadLanguageAsync(locale ?? 'en')
})

onMounted(() => {
  if (is.desktop()) {
    let unlisten
    ;(async () => {
      unlisten = await listen('change-text', async (event: Event<string>) => {
        const selectedText = event.payload
        if (selectedText) {
          editor.value?.commands.focus()
          if (block.value) {
            block.value.content = selectedText
          }
          else {
            block.value = {
              content: selectedText,
            }
          }
        }
      })
    })()
    return unlisten
  }
  return () => {}
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <Assistant
        v-model="block.content"
        class="max-h-20"
        :on-close="handleClose"
        pinned
      />
    </CustomProvider>
  </ThemeProvider>
</template>

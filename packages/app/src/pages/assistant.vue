<script setup lang="ts">
import '~/styles/main.sass'
import { ThemeProvider } from '@firefly/theme'
import { is } from '@firefly/common'
import type { Event } from '@tauri-apps/api/event'
import type { Editor } from '@tiptap/core'
import { tauri } from '~/plugins/tauri'

definePageMeta({
  layout: false,
})

const { setLocale } = useI18n()
const assistantStore = useAssistantStore()
const editor = ref<Editor>()

async function handleClose() {
  assistantStore.clear()
  await tauri.invoke('hide_assistant_window')
}

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  setLocale(locale ?? 'en')
})

onMounted(
  () => {
    let unlisten
    ;(async () => {
      unlisten = await tauri.event.listen('change-text', async (event: Event<string>) => {
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
    <Inject />
    <Assistant
      v-model="assistantStore.value"
      :class="assistantStore.fileList.length > 0 ? 'h-60' : 'h-80'"
      :on-close="handleClose"
      :show-close="!is.macOS()"
      pinned
    />
  </ThemeProvider>
</template>

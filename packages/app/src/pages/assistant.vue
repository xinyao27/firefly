<script setup lang="ts">
import '~/styles/main.sass'
import { is } from '@firefly/common'
import type { Editor } from '@tiptap/core'
import { desktop } from '~/plugins/desktop'

definePageMeta({
  layout: false,
})

const { setLocale } = useI18n()
const assistantStore = useAssistantStore()
const editor = ref<Editor>()

async function handleClose() {
  assistantStore.clear()
  await desktop.ipcRenderer.invoke('windows:hideAssistantWindow')
}

const settings = useSettings()
watch(() => settings.value.i18n, (locale) => {
  setLocale(locale ?? 'en')
})

onMounted(
  () => {
    if (is.desktop()) {
      desktop.ipcRenderer.on('assistant:setText', (_, selectedText: string) => {
        if (selectedText) {
          editor.value?.commands.focus()
          assistantStore.value = selectedText
        }
      })
    }
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

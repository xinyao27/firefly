<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import type { BlockModel } from '@firefly/common'
import Assistant from '@firefly/assistant'
import type { Event } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
import { Logo } from '@firefly/common'
import type { Editor } from '@tiptap/core'
import { invoke } from '@tauri-apps/api'
import Pin from './Pin.vue'
import { supabase } from '~/api'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseFunctionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const block = ref<BlockModel>({ content: '' })
const token = asyncComputed(async () => {
  const { data, error } = await supabase.from('profiles').select().single()
  if (error) {
    console.error(error)
    throw error
  }
  return data.token
})
const editor = ref<Editor>()

async function handleClose() {
  block.value = { content: '' }
  await invoke('hide_assistant_window')
}

onMounted(() => {
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
})
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <header
        data-tauri-drag-region
        flex justify-between items-center p-3
      >
        <Logo />
        <Pin />
      </header>
      <main>
        <Assistant
          v-model:token="token"
          v-model:block="block"
          v-model:editor="editor"
          editor-class="h-80"
          :supabase-url="supabaseUrl"
          :supabase-functions-url="supabaseFunctionsUrl"
          :supabase-anon-key="supabaseAnonKey"
          :on-close="handleClose"
        >
          <template #header>
            <div />
          </template>
        </Assistant>
      </main>
    </CustomProvider>
  </ThemeProvider>
</template>

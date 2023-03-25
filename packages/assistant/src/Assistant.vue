<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { Logo, Spin, clearContent } from '@firefly/common'
import EditorCore from '@firefly/editor'
import { createClient } from '@supabase/supabase-js'
import type { Editor } from '@tiptap/core'
import { useToggle, useVModel } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  class?: string
  editorClass?: string
  token: string
  block: BlockModel | null
  editor?: Editor
  supabaseUrl: string
  supabaseFunctionsUrl: string
  supabaseAnonKey: string
  onClose?: () => void
}>()
const emit = defineEmits(['update:token', 'update:block', 'update:editor'])
const token = useVModel(props, 'token', emit)
const block = useVModel(props, 'block', emit)
const editor = useVModel(props, 'editor', emit)
const { t } = useI18n()

const supabase = createClient(
  props.supabaseUrl,
  props.supabaseAnonKey,
)

async function save(block: BlockModel, token: string) {
  try {
    const { data, error } = await supabase.functions.invoke(`api/${token}`, {
      method: 'POST',
      body: block,
    })
    if (error)
      throw error
    return data.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

const [loading, toggleLoading] = useToggle(false)
const [copilotLoading, toggleCopilotLoading] = useToggle(false)

const tokenInput = ref('')

async function handleCopilot() {
  if (!block.value?.content)
    return
  toggleCopilotLoading(true)
  const response = await fetch(`${props.supabaseFunctionsUrl}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': props.supabaseAnonKey,
      'Authorization': `Bearer ${props.supabaseAnonKey}`,
    },
    body: JSON.stringify({
      type: 'extractionTags',
      language: 'zh-Hans',
      text: block.value?.content,
    }),
  })
  const data = response.body
  if (!data)
    return

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false
  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    if (block.value)
      block.value.content += chunkValue
  }
  toggleCopilotLoading(false)
}
async function handleSave() {
  try {
    toggleLoading(true)
    if (block.value) {
      block.value.content = clearContent(block.value.content)
      await save(block.value, token.value)
      props.onClose?.()
    }
  }
  finally {
    toggleLoading(false)
  }
}
</script>

<template>
  <div
    font-sans leading-1em pointer-events-initial items-end select-none p-3
    :class="props.class"
  >
    <div
      v-if="block"
      w-full
    >
      <div v-if="token">
        <!-- title -->
        <slot name="header">
          <div mb-3>
            <span text-2xl font-extrabold>Send to</span>
            <Logo />
          </div>
        </slot>
        <!-- content -->
        <EditorCore
          v-model="block.content"
          class="prose prose-white textarea-slate"
          :class="props.editorClass"
          :tags="[]"
          :bubble-menu="false"
          :on-created="v => editor = v"
        />
        <!-- metadata -->
        <div
          v-if="block?.metadata"
          flex flex-col gap-3 mt-3
        >
          <div v-if="block?.metadata?.title">
            <textarea
              v-model="block.metadata.title"
              textarea-slate
            />
          </div>
          <div v-if="block?.metadata?.description">
            <textarea
              v-model="block.metadata.description"
              textarea-slate
            />
          </div>
          <div v-if="block?.metadata?.image">
            <img
              w-24 rounded-sm
              :src="block.metadata.image"
            >
          </div>
        </div>
        <!-- action -->
        <div flex items-center justify-between gap-3 mt-3>
          <button
            btn-slate
            @click="props.onClose"
          >
            <i i-ri-delete-bin-line text-neutral />
          </button>
          <button
            btn-slate
            :disabled="copilotLoading"
            @click="handleCopilot"
          >
            <Spin
              v-if="copilotLoading"
              class="text-primary"
            />
            <i
              v-else
              i-tabler-brain text-primary
            />
          </button>
          <button
            btn-slate w-full
            :disabled="loading"
            @click="handleSave"
          >
            <Spin v-if="loading" />
            <span v-else>{{ t('common.save') }}</span>
          </button>
        </div>
      </div>
      <div v-else>
        <div text-lg font-semibold mb-3>
          {{ t('assistant.inputToken') }}
        </div>
        <div flex flex-col gap-3>
          <input
            v-model="tokenInput"
            type="password"
            textarea-slate w-full
          >
        </div>
        <div flex items-center justify-center mt-3>
          <button
            btn-slate w-full
            @click="token = tokenInput"
          >
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    <template v-else>
      <slot name="empty" />
    </template>
  </div>
</template>

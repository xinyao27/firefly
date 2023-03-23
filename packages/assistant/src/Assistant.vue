<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { Logo, clearContent } from '@firefly/common'
import Editor from '@firefly/editor'
import { createClient } from '@supabase/supabase-js'
import { useToggle, useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  token: string
  block: BlockModel | null
  supabaseUrl: string
  supabaseFunctionsUrl: string
  supabaseAnonKey: string
  onClose: () => void
}>()
const emit = defineEmits(['update:token', 'update:block'])
const token = useVModel(props, 'token', emit)
const block = useVModel(props, 'block', emit)

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
      props.onClose()
    }
  }
  finally {
    toggleLoading(false)
  }
}
</script>

<template>
  <div class="flex font-sans m-5 top-0 left-0 leading-1em z-[2147483647] pointer-events-initial fixed items-end select-none">
    <div w-72 p-3 rounded-sm bg-neutral-800 bg-opacity-80 backdrop-blur-lg shadow-xl>
      <div v-if="block">
        <div v-if="token">
          <!-- title -->
          <div mb-3>
            <span text-2xl font-extrabold>Send to</span>
            <Logo />
          </div>
          <!-- content -->
          <Editor
            v-model="block.content"
            class="prose textarea-slate"
            :tags="[]"
            :bubble-menu="false"
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
              <i
                v-if="copilotLoading"
                i-ri-loader-2-line
                inline-block animate-spin text-primary
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
              <i
                v-if="loading"
                i-ri-loader-2-line
                inline-block animate-spin
              />
              <span v-else>保存</span>
            </button>
          </div>
        </div>
        <div v-else>
          <div text-lg font-semibold mb-3>
            请先输入 Token
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
              保存
            </button>
          </div>
        </div>
      </div>
      <template v-else>
        <slot name="empty" />
      </template>
    </div>
  </div>
</template>

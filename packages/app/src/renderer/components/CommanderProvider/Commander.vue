<script setup lang="ts">
import type { InputInst } from 'naive-ui'
import { uniq } from 'lodash'
import { SSE } from 'sse.js'
import type { CreateCompletionResponse } from 'openai'
import ResultsRenderer from './ResultsRenderer.vue'
import RecentlyQuestion from './RecentlyQuestion.vue'
import { useCommanderRecently } from '~renderer/composables/useCommanderRecently'

const question = ref('')
const results = ref<string>('')
const loading = ref(false)
const status = ref<'empty' | 'error' | 'answered'>('empty')
const inputInstRef = ref<InputInst | null>(null)
const commanderStore = useCommanderStore()
const recently = useCommanderRecently()

watch(() => commanderStore.show, (value) => {
  nextTick(() => {
    if (value) {
      inputInstRef.value?.focus()
    }
    else {
      inputInstRef.value?.blur()
    }
  })
})
function handleKeyUp(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
async function handleSearch() {
  await handleGetCompletion()
  inputInstRef.value?.select()
  // 控制最近问题最大数量
  if (recently.value.length >= 10) {
    recently.value.pop()
    recently.value = uniq([question.value, ...recently.value])
  }
  else {
    recently.value = uniq([question.value, ...recently.value])
  }
}
function getEdgeFunctionUrl() {
  const supabaseUrl = (
    import.meta.env.DEV
      ? 'http://localhost:54321'
      : import.meta.env.RENDERER_VITE_SUPABASE_URL
  )
    ?.replace(/\/$/, '')

  return `${supabaseUrl}/functions/v1`
}
async function handleGetCompletion(type = 'default', text = '', language = 'chinese') {
  loading.value = true
  const eventSource = new SSE(`${getEdgeFunctionUrl()}/completion`, {
    headers: {
      'apikey': import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({ prompt: question.value, type, text, language }),
  })
  function handleError<T>(err: T) {
    status.value = 'error'
    results.value = err as string
    console.error(err)
  }
  eventSource.addEventListener('error', handleError)
  eventSource.addEventListener('message', (e) => {
    try {
      loading.value = true

      if (e.data === '[DONE]') {
        loading.value = false
        status.value = 'answered'
        return
      }

      const completionResponse = JSON.parse(e.data) as CreateCompletionResponse
      const [{ text }] = completionResponse.choices

      results.value = (results.value ?? '') + text
    }
    catch (err) {
      handleError(err)
    }
  })
  eventSource.stream()
}

function handleReset() {
  question.value = ''
  results.value = ''
  loading.value = false
  status.value = 'empty'
  inputInstRef.value?.focus()
}
function handleContinue() {
  handleGetCompletion('continue', results.value)
}
function handleRewrite() {
  const tempPrompt = question.value
  handleReset()
  question.value = tempPrompt
  handleGetCompletion()
}
</script>

<template>
  <div w-600px bg-neutral-700 shadow-lg rounded flex flex-col>
    <div p-4>
      <NInput
        ref="inputInstRef"
        v-model:value="question"
        size="large"
        :disabled="loading"
        autofocus
        placeholder="随便问我点什么..."
        @keyup="handleKeyUp"
      >
        <template #prefix>
          <i i-tabler-brain />
        </template>
        <template #suffix>
          <NTooltip
            trigger="hover"
            :disabled="loading"
          >
            <template #trigger>
              <NButton
                :disabled="!question"
                :loading="loading"
                text
                @click="handleSearch"
              >
                <i v-if="!loading" i-ri-arrow-up-circle-fill />
              </NButton>
            </template>
            <div flex items-center gap-1>
              问问AI <i i-tabler-arrow-back text-xs />
            </div>
          </NTooltip>
        </template>
      </NInput>
    </div>
    <ResultsRenderer
      v-if="results.length"
      :data="results"
      :status="status"
      :loading="loading"
      @reset="handleReset"
      @continue="handleContinue"
      @rewrite="handleRewrite"
    />
    <RecentlyQuestion
      v-if="!results.length && !loading"
      @select="prompt => {
        handleReset()
        question = prompt
        handleGetCompletion()
      }"
    />
  </div>
</template>

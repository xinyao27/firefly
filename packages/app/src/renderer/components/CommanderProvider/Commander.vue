<script setup lang="ts">
import type { InputInst } from 'naive-ui'
import { uniq } from 'lodash'
import ResultsRenderer from './ResultsRenderer.vue'
import RecentlyQuestion from './RecentlyQuestion.vue'
import { supabase } from '~renderer/api'
import { useCommanderRecently } from '~renderer/composables/useCommanderRecently'

const question = ref('')
const results = ref<string[]>([])
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
async function handleGetCompletion(prompt?: string) {
  try {
    loading.value = true
    const { data } = await supabase.functions.invoke<{
      choices: {
        text: string
      }[]
    }>('completion', { body: { prompt: prompt || question.value } })
    if (data?.choices) {
      if (!prompt) {
        results.value = (data.choices).map(v => v.text?.trim())
      }
      else {
        results.value = results.value.concat((data.choices).map(v => v.text?.trim()))
      }
    }
    status.value = 'answered'
  }
  catch (error) {
    status.value = 'error'
    results.value = [error as string]
  }
  finally {
    loading.value = false
  }
}
function handleReset() {
  question.value = ''
  results.value = []
  loading.value = false
  status.value = 'empty'
  inputInstRef.value?.focus()
}
function handleContinue() {
  handleGetCompletion(results.value.join('\n'))
}
function handleRewrite() {
  handleGetCompletion()
}
</script>

<template>
  <div w-600px bg-neutral-700 shadow-lg rounded flex flex-col>
    <div p-4 pb-0>
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
    <div
      v-if="loading"
      p-4
    >
      <NSkeleton text :repeat="2" />
      <NSkeleton text style="width: 60%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ResultsRenderer from './ResultsRenderer.vue'
import RecentlyQuestion from './RecentlyQuestion.vue'

const copilotStore = useCopilotStore()

watch(() => copilotStore.show, (value) => {
  nextTick(() => {
    if (value)
      copilotStore.inputRef?.focus()

    else
      copilotStore.inputRef?.blur()
  })
})

const activeElement = useActiveElement()
function handleKeyUp(e: KeyboardEvent) {
  if (e.key === 'Enter' && (activeElement.value?.id && activeElement.value?.id === (e.target as HTMLElement)?.id))
    copilotStore.search()
}
</script>

<template>
  <div w-600px bg-neutral-700 shadow-lg rounded flex flex-col>
    <div p-4>
      <NInput
        v-show="!copilotStore.text"
        id="aiInput"
        :ref="ref => copilotStore.inputRef = ref"
        v-model:value="copilotStore.question"
        size="large"
        :disabled="copilotStore.loading"
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
            :disabled="copilotStore.loading"
          >
            <template #trigger>
              <NButton
                :disabled="!copilotStore.question"
                :loading="copilotStore.loading"
                text
                @click="copilotStore.search"
              >
                <i v-if="!copilotStore.loading" i-ri-arrow-up-circle-fill />
              </NButton>
            </template>
            <div flex items-center gap-1>
              问问AI <i i-tabler-arrow-back text-xs />
            </div>
          </NTooltip>
        </template>
      </NInput>
      <NSpin :show="copilotStore.loading">
        <div
          v-show="copilotStore.text"
          bg-neutral-600 rounded p-2
        >
          {{ copilotStore.text }}
        </div>
      </NSpin>
    </div>
    <ResultsRenderer v-if="copilotStore.results.length" />
    <RecentlyQuestion v-if="!copilotStore.results.length && !copilotStore.loading" />
  </div>
</template>

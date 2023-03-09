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
  if ((e.key === 'Enter' && e.ctrlKey) && (activeElement.value?.className && activeElement.value?.className === (e.target as HTMLElement)?.className))
    copilotStore.search()
}
</script>

<template>
  <div w-600px bg-dark-800 shadow-lg rounded-2 flex flex-col>
    <div p-4 flex flex-col gap-2>
      <NMention
        v-show="!copilotStore.text"
        :ref="ref => copilotStore.inputRef = ref"
        v-model:value="copilotStore.question"
        :autosize="{ maxRows: 5, minRows: 5 }"
        type="textarea"
        size="large"
        :disabled="copilotStore.loading"
        autofocus
        placeholder="随便问我点什么..."
        @keyup="handleKeyUp"
      />
      <div flex justify-between>
        <div />
        <NTooltip
          trigger="hover"
          :disabled="copilotStore.loading"
        >
          <template #trigger>
            <NButton
              :disabled="!copilotStore.question"
              :loading="copilotStore.loading"
              @click="copilotStore.search"
            >
              Firefly AI
            </NButton>
          </template>
          <div flex items-center gap-1>
            问问AI <i i-tabler-arrow-back text-xs />
          </div>
        </NTooltip>
      </div>
    </div>
    <ResultsRenderer v-if="copilotStore.results.length" />
    <RecentlyQuestion v-if="!copilotStore.results.length && !copilotStore.loading" />
  </div>
</template>

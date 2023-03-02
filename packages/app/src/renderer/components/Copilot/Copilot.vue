<script setup lang="ts">
import ResultsRenderer from './ResultsRenderer.vue'
import RecentlyQuestion from './RecentlyQuestion.vue'

const copilotStore = useCopilotStore()

watch(() => copilotStore.show, (value) => {
  nextTick(() => {
    if (value)
      copilotStore.editor?.commands.focus()
    else
      copilotStore.editor?.commands.blur()
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
    <div p-4 flex flex-col gap-4>
      <TextEditor
        v-show="!copilotStore.text"
        v-model:value="copilotStore.question"
        class="h-24 bg-neutral-800"
        placeholder="随便问我点什么..."
        :disabled="copilotStore.loading"
        :on-mounted="editor => copilotStore.editor = editor"
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

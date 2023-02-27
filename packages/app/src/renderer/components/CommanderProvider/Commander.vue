<script setup lang="ts">
import ResultsRenderer from './ResultsRenderer.vue'
import RecentlyQuestion from './RecentlyQuestion.vue'

const commanderStore = useCommanderStore()

watch(() => commanderStore.show, (value) => {
  nextTick(() => {
    if (value) {
      commanderStore.inputRef?.focus()
    }
    else {
      commanderStore.inputRef?.blur()
    }
  })
})

const activeElement = useActiveElement()
function handleKeyUp(e: KeyboardEvent) {
  if (e.key === 'Enter' && (activeElement.value?.id && activeElement.value?.id === (e.target as HTMLElement)?.id)) {
    commanderStore.search()
  }
}
</script>

<template>
  <div w-600px bg-neutral-700 shadow-lg rounded flex flex-col>
    <div p-4>
      <NInput
        v-show="!commanderStore.text"
        id="aiInput"
        :ref="ref => commanderStore.inputRef = ref"
        v-model:value="commanderStore.question"
        size="large"
        :disabled="commanderStore.loading"
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
            :disabled="commanderStore.loading"
          >
            <template #trigger>
              <NButton
                :disabled="!commanderStore.question"
                :loading="commanderStore.loading"
                text
                @click="commanderStore.search"
              >
                <i v-if="!commanderStore.loading" i-ri-arrow-up-circle-fill />
              </NButton>
            </template>
            <div flex items-center gap-1>
              问问AI <i i-tabler-arrow-back text-xs />
            </div>
          </NTooltip>
        </template>
      </NInput>
      <NSpin :show="commanderStore.loading">
        <div
          v-show="commanderStore.text"
          bg-neutral-600 rounded p-2
        >
          {{ commanderStore.text }}
        </div>
      </NSpin>
    </div>
    <ResultsRenderer v-if="commanderStore.results.length" />
    <RecentlyQuestion v-if="!commanderStore.results.length && !commanderStore.loading" />
  </div>
</template>

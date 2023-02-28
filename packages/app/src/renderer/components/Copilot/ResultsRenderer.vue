<script setup lang="ts">
import type { ActionOption } from './options'
import { answeredOptions, articleOptions, initialOptions } from './options'

const copilotStore = useCopilotStore()
const blockStore = useMessageStore()

const options = ref<ActionOption[]>(initialOptions)
const optionPosition = ref({
  x: 0,
  y: 0,
})
const answerRef = ref<Element>()
watch(() => copilotStore.status, () => {
  if (copilotStore.status === 'answered') {
    const answerRect = answerRef.value?.getBoundingClientRect()
    if (answerRect) {
      optionPosition.value.x = answerRect.x + answerRect.width + 108
      optionPosition.value.y = answerRect.y - 6
      let _options = [...answeredOptions]
      if (blockStore.currentBlock && blockStore.currentBlock.category === 'article')
        _options = [...articleOptions, ..._options]

      options.value = _options
    }
  }
})

function handleSelectItem(_: string, option: ActionOption) {
  option.action?.()
}
</script>

<template>
  <div p-4 pt-0>
    <div
      ref="answerRef"
      max-h-50 p-2 bg-neutral-800 rounded
    >
      <div>
        {{ copilotStore.results }}
      </div>
    </div>
    <NDropdown
      class="w-46"
      size="small"
      :options="options"
      :disabled="copilotStore.loading"
      :show="!!copilotStore.results.length && (!!optionPosition.x && !!optionPosition.y) && !!options.length"
      trigger="manual"
      :x="optionPosition.x"
      :y="optionPosition.y"
      @select="handleSelectItem"
    />
  </div>
</template>

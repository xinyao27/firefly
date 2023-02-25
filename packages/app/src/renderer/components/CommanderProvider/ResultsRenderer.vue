<script setup lang="ts">
import type { ActionOption, ActionType } from './options'
import { answeredOptions, initialOptions } from './options'

const props = defineProps<{
  status: 'empty' | 'answered' | 'error'
  loading: boolean
  data: string
}>()
const emit = defineEmits<{
  (e: ActionType): void
}>()

const options = ref<ActionOption[]>(initialOptions)
const optionPosition = ref({
  x: 0,
  y: 0,
})
const answerRef = ref<Element>()
watchEffect(() => {
  if (props.status === 'answered') {
    const answerRect = answerRef.value?.getBoundingClientRect()
    if (answerRect) {
      optionPosition.value.x = answerRect.x + answerRect.width + 108
      optionPosition.value.y = answerRect.y - 6
      options.value = answeredOptions
    }
  }
})

function handleSelectItem(_: string, option: ActionOption) {
  option.action?.(emit)
}
</script>

<template>
  <div p-4 pt-0>
    <div
      ref="answerRef"
      max-h-50 p-2 bg-neutral-800 rounded
    >
      <div>
        {{ props.data }}
      </div>
    </div>
    <NDropdown
      class="w-46"
      size="small"
      :options="options"
      :disabled="loading"
      :show="!!props.data.length && (!!optionPosition.x && !!optionPosition.y) && !!options.length"
      trigger="manual"
      :x="optionPosition.x"
      :y="optionPosition.y"
      @select="handleSelectItem"
    />
  </div>
</template>

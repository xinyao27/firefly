<script setup lang="ts">
import type { InputInst } from 'naive-ui'
import { useSelection } from './selection'
import { supportLanguages } from './lang'

const copilotStore = useCopilotStore()
const promptRef = ref<InputInst>()
const textSelection = useSelection(() => promptRef.value?.textareaElRef)

const languageOptions = supportLanguages.map(([value, label]) => ({
  value,
  label,
}))
function handleAskCopilot() {
  copilotStore.chat({
    text: textSelection.value,
    type: copilotStore.type,
    prompt: copilotStore.prompt,
    language: copilotStore.language,
  })
}

const result = computed(() => {
  if (copilotStore.result) {
    if (copilotStore.type !== 'extractionTags')
      return copilotStore.result
    else
      return copilotStore.result.replace(/#\S+/g, '<span data-type="tag">$&</span>')
  }
  return ''
})
</script>

<template>
  <aside h-full flex flex-col gap-4 p-4 select-none>
    <pre class="p-4 bg-(slate opacity-15) rounded-sm max-h-100 whitespace-pre-line overflow-x-hidden overflow-y-auto select-none">
      {{ textSelection || '选择一段文字看看...' }}
    </pre>

    <NSelect
      v-model:value="copilotStore.type"
      size="small"
      :options="copilotStore.types"
    />
    <NSelect
      v-model:value="copilotStore.language"
      size="small"
      :options="languageOptions"
    />
    <NInput
      v-if="copilotStore.type === 'custom'"
      ref="promptRef"
      v-model:value="copilotStore.prompt"
      type="textarea"
      placeholder="输入自定义 prompt, 例如: 你是一个诗人, 你将总结这段文本并写出一首诗"
    />

    <NButton
      block
      type="primary"
      :disabled="!textSelection"
      :loading="copilotStore.loading"
      @click="handleAskCopilot"
    >
      <template #icon>
        <i i-tabler-brain />
      </template>
      Ask Copilot
    </NButton>

    <Copyable
      class="copy"
      type="area"
      :text="copilotStore.result"
    >
      <div
        v-if="copilotStore.result"
        class="ProseMirror prose prose-white p-4 bg-(slate opacity-15) rounded-sm"
        v-html="result"
      />
    </Copyable>
  </aside>
</template>

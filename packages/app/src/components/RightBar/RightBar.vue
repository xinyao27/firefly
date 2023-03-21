<script setup lang="ts">
import { useSelection } from './selection'
import { supportLanguages } from './lang'

const copilotStore = useCopilotStore()
const textSelection = useSelection()

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
      return copilotStore.result.replace(/#\S+/g, '<span class="tag">$&</span>')
  }
  return ''
})
</script>

<template>
  <aside h-full flex flex-col gap-4 p-4 select-none>
    <pre p-4 bg-white rounded-sm max-h-100 whitespace-pre-line overflow-x-hidden overflow-y-auto>
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
        class="ProseMirror prose prose-black p-4 bg-white rounded-sm"
        v-html="result"
      />
    </Copyable>
  </aside>
</template>

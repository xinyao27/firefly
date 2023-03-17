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
const copied = ref(false)
async function handleCopyResult() {
  await navigator.clipboard.writeText(copilotStore.result)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
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
  <aside h-full flex flex-col gap-4 p-4 bg-neutral-100 select-none>
    <pre p-4 bg-white rounded max-h-100 whitespace-pre-line overflow-x-hidden overflow-y-auto>
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

    <div class="result" relative>
      <div
        v-if="copilotStore.result"
        class="ProseMirror prose prose-black p-4 bg-white rounded"
        v-html="result"
      />
      <!-- 复制 -->
      <NTooltip>
        <template #trigger>
          <NButton
            class="copy"
            hidden absolute top-2 right-2
            text
            size="small"
            @click="handleCopyResult"
          >
            <i v-if="!copied" i-ri-file-copy-fill />
            <i v-else i-ri-check-fill />
          </NButton>
        </template>
        <span v-if="!copied">复制</span>
        <span v-else>已复制</span>
      </NTooltip>
    </div>
  </aside>
</template>

<style scoped lang="sass">
.result
  &:hover
    .copy
      display: block !important
</style>

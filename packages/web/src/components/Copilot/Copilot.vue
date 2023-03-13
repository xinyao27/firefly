<script setup lang="ts">
import type { BlockModel } from '~/models/Block'

const copilotStore = useCopilotStore()
const textEditorStore = useTextEditorStore()
const blockStore = useBlockStore()

watch(() => copilotStore.show, (value) => {
  nextTick(() => {
    if (value)
      textEditorStore.editor?.commands.focus()
    else
      textEditorStore.editor?.commands.blur()
  })
})

const loading = ref(false)
async function handleSave() {
  loading.value = true
  const content = copilotStore.value
  const block: BlockModel = {
    content,
  }
  await blockStore.save(block)
  loading.value = false
  copilotStore.show = false
}
</script>

<template>
  <div w-600px p-4 pb-2 bg-white shadow-lg rounded-2 flex flex-col gap-2>
    <TextEditor
      v-model:value="copilotStore.value"
    />

    <div flex justify-between>
      <div />
      <NButton
        secondary
        type="primary"
        :loading="loading"
        @click="handleSave"
      >
        保存
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlockModel } from '~/models/Block'

const props = defineProps<{
  class?: string
}>()

const copilotStore = useCopilotStore()
const blockStore = useBlockStore()

const loading = ref(false)
async function handleSave() {
  copilotStore.closable = false
  loading.value = true

  const content = copilotStore.value
  if (copilotStore.type === 'create') {
    const block: BlockModel = {
      content,
    }
    await blockStore.save(block)
  }
  else if (copilotStore.type === 'update') {
    const block = copilotStore.editingBlock
    await blockStore.update({
      ...block,
      content,
    })
  }

  copilotStore.closable = true
  copilotStore.close()
  loading.value = false
}
</script>

<template>
  <div
    p-4 pb-2 bg-white flex flex-col gap-2
    :class="props.class"
  >
    <TextEditor />

    <div flex justify-between>
      <div />
      <NButton
        secondary
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSave"
      >
        <i i-ri-send-plane-fill />
      </NButton>
    </div>
  </div>
</template>

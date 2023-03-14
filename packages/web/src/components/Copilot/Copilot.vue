<script setup lang="ts">
import type { BlockModel } from '~/models/Block'

const props = defineProps<{
  class?: string
}>()

const copilotStore = useCopilotStore()
const blockStore = useBlockStore()

const loading = ref(false)
async function handleSave() {
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

  copilotStore.cancel()
  loading.value = false
}
</script>

<template>
  <div
    p-4 pb-2 flex flex-col gap-2 bg-white border-t border-neutral-200
    :class="props.class"
  >
    <TextEditor />

    <div flex justify-between>
      <div />
      <div flex items-center gap-2>
        <NButton
          v-if="copilotStore.editingBlock"
          text
          size="small"
          :disabled="!copilotStore.value || loading"
          @click="copilotStore.cancel"
        >
          取消
        </NButton>
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
  </div>
</template>

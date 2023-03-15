<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()

const copilotStore = useCopilotStore()
</script>

<template>
  <div
    m-4 p-4 pb-2 flex flex-col gap-2 bg-white rounded-2 transition
    :border="copilotStore.focus ? '1px primary' : '1px neutral-200'"
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
          :disabled="!copilotStore.value || copilotStore.loading"
          @click="copilotStore.cancel"
        >
          取消
        </NButton>
        <NButton
          secondary
          type="primary"
          size="small"
          :loading="copilotStore.loading"
          :disabled="!copilotStore.value || copilotStore.loading"
          @click="copilotStore.save"
        >
          <i i-ri-send-plane-fill />
        </NButton>
      </div>
    </div>
  </div>
</template>

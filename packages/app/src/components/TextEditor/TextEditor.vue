<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()

const textEditorStore = useTextEditorStore()

onKeyStroke(['ctrl', 'l'], (e) => {
  e.preventDefault()

  textEditorStore.toggleFocus(true)
})
</script>

<template>
  <div
    m-4 p-4 pb-2 flex flex-col gap-2 bg-white rounded transition cursor-pointer
    :class="[props.class, textEditorStore.focus ? 'border-b-2 border-primary' : '']"
    @click="textEditorStore.toggleFocus"
  >
    <TextEditorCore />

    <div flex justify-between>
      <div />
      <div flex items-center gap-2>
        <NButton
          v-if="textEditorStore.editingBlock"
          text
          size="small"
          :disabled="!textEditorStore.value || textEditorStore.loading"
          @click="textEditorStore.cancel"
        >
          取消
        </NButton>
        <NButton
          secondary
          type="primary"
          size="small"
          :loading="textEditorStore.loading"
          :disabled="!textEditorStore.value || textEditorStore.loading"
          @click="textEditorStore.save"
        >
          <i i-ri-send-plane-fill />
        </NButton>
      </div>
    </div>
  </div>
</template>

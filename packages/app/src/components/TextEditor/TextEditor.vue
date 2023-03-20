<script setup lang="ts">
import Editor from '@firefly/editor'

const props = defineProps<{
  class?: string
}>()

const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()

onKeyStroke(['ctrl', 'l'], (e) => {
  e.preventDefault()

  textEditorStore.toggleFocus(true)
})

watch(() => textEditorStore.focus, (focus) => {
  focus ? textEditorStore.editor?.commands.focus() : textEditorStore.editor?.commands.blur()
  textEditorStore.editor?.setOptions({
    editorProps: {
      attributes: {
        style: `min-height: ${focus ? 6 : 1.5}rem`,
      },
    },
  })
})
</script>

<template>
  <div
    m-4 p-4 pb-2 flex flex-col gap-2 bg-white rounded transition cursor-pointer
    :class="[props.class, textEditorStore.focus ? 'border-b-2 border-primary' : '']"
    @click="textEditorStore.toggleFocus"
  >
    <Editor
      :value="textEditorStore.value"
      :tags="tagStore.tags"
      :on-change="v => textEditorStore.value = v"
      :on-focus="() => textEditorStore.toggleFocus(true)"
      :on-blur="() => textEditorStore.toggleFocus(false)"
      :on-created="editor => textEditorStore.editor = editor"
    />

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

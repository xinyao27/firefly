<script setup lang="ts">
import Editor from '@firefly/editor'

const props = defineProps<{
  class?: string
}>()

const { t } = useI18n()
const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()

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
    class="m-4 p-4 pb-2 flex flex-col gap-2 bg-(slate opacity-15) hover:bg-opacity-20 rounded-sm transition cursor-text"
    :class="[props.class, textEditorStore.focus ? 'border-b-2 border-primary bg-opacity-20' : '']"
    @click="textEditorStore.toggleFocus"
  >
    <Editor
      v-model="textEditorStore.value"
      class="prose prose-white"
      :tags="tagStore.tags"
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
          @click="e => {
            e.stopPropagation()
            textEditorStore.cancel()
          }"
        >
          {{ t('common.cancel') }}
        </NButton>
        <NButton
          secondary
          type="primary"
          size="small"
          :loading="textEditorStore.loading"
          :disabled="!textEditorStore.value || textEditorStore.loading"
          @click.stop="textEditorStore.save"
        >
          <i i-ri-send-plane-2-fill />
        </NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from '@firefly/editor'

const { t } = useI18n()
const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()
</script>

<template>
  <div w-2xl h-xl m-auto>
    <NCard
      class="bg-neutral-800 bg-opacity-90 backdrop-blur shadow-lg rounded-sm"
      size="small"
      role="dialog"
      aria-modal="true"
      :title="t('block.create')"
    >
      <template #header-extra>
        <NButton
          quaternary
          size="tiny"
          @click="textEditorStore.cancel"
        >
          <template #icon>
            <i i-ri-close-line />
          </template>
        </NButton>
      </template>
      <Editor
        v-model="textEditorStore.value"
        class="prose prose-white"
        :tags="tagStore.tags"
        :on-focus="() => textEditorStore.toggleFocus(true)"
        :on-blur="() => textEditorStore.toggleFocus(false)"
        :on-created="editor => textEditorStore.editor = editor"
      />
      <template #footer>
        <div flex justify-between items-center>
          <div>
            <NButton
              quaternary
              size="tiny"
            >
              <template #icon>
                <i i-ri-attachment-2 />
              </template>
            </NButton>
          </div>
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
              <template #icon>
                <i i-ri-send-plane-2-fill />
              </template>
              {{ t('block.create') }}
            </NButton>
          </div>
        </div>
      </template>
    </NCard>
  </div>
</template>

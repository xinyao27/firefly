<script setup lang="ts">
import Editor from '@firefly/editor'
import type { SelectOption, SelectRenderTag } from 'naive-ui'
import { NTag } from 'naive-ui'
import type { VNodeChild } from 'vue'
import Bubble from '~/components/Bubble'

const props = defineProps<{
  modelValue: string
  pinned?: boolean
  class?: string
  onClose?: () => void
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const { t } = useI18n()
const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()
const uploadRef = ref()
const tags = computed(() => tagStore.tags.map(tag => ({
  label: tag.name,
  value: tag.name,
})))
function renderLabel(option: SelectOption): VNodeChild {
  if (option.type === 'group')
    return `${option.label}(Cool!)`
  return [
    h(
      Bubble,
      {
        class: 'mr-2',
        color: tagStore.findOne(option.label as string)?.color,
      },
    ),
    option.label as string,
  ]
}
const renderTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      closable: true,
      bordered: false,
      size: 'small',
      onMousedown: (e: FocusEvent) => {
        e.preventDefault()
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation()
        handleClose()
      },
    },
    {
      avatar: h(Bubble, { color: tagStore.findOne(option.label as string)?.color }),
      default: () => option.label,
    },
  )
}
function handleClose() {
  textEditorStore.cancel()
  props.onClose?.()
}
</script>

<template>
  <div
    w-2xl m-auto h-full
  >
    <NCard
      data-tauri-drag-region
      class="h-full bg-neutral-800 bg-opacity-90 backdrop-blur shadow-lg rounded-sm overflow-hidden"
      size="small"
      role="dialog"
      aria-modal="true"
    >
      <template #header>
        <div
          data-tauri-drag-region
          select-none
        >
          {{ textEditorStore.type === 'update' ? t('block.update') : t('block.create') }}
        </div>
      </template>
      <template #header-extra>
        <div flex items-center gap-2>
          <Pin />
          <NButton
            quaternary
            size="tiny"
            @click="handleClose"
          >
            <template #icon>
              <i i-ri-close-line />
            </template>
          </NButton>
        </div>
      </template>
      <Editor
        v-model="data"
        class="prose prose-white"
        :class="props.class"
        :tags="tagStore.tags"
        :on-created="editor => textEditorStore.editor = editor"
      />
      <div pt-1>
        <NSelect
          v-model:value="textEditorStore.tags"
          size="small"
          multiple
          filterable
          tag
          :options="tags"
          :render-label="renderLabel"
          :render-tag="renderTag"
          :max-tag-count="8"
          :placeholder="t('tag.placeholder')"
        />
      </div>
      <template #footer>
        <div flex justify-between items-center>
          <div>
            <input
              ref="uploadRef"
              class="hidden"
              multiple
              type="file"
              accept="image/*,.pdf"
              @change="textEditorStore.upload"
            >
            <NButton
              quaternary
              size="tiny"
              @click="uploadRef.click()"
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
              {{ textEditorStore.type === 'update' ? t('block.update') : t('block.create') }}
            </NButton>
          </div>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style lang="sass">
.n-base-selection .n-base-selection-tags
  @apply bg-transparent pl-0
</style>

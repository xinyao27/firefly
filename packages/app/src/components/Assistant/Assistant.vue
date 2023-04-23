<script setup lang="ts">
import Editor from '@firefly/editor'
import type { SelectOption, SelectRenderTag } from 'naive-ui'
import { NTag } from 'naive-ui'
import type { VNodeChild } from 'vue'
import Bubble from '~/components/Bubble/Bubble.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  pinned?: boolean
  class?: string
  showClose?: boolean
  onClose?: () => void
}>(), {
  showClose: true,
})
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const { t } = useI18n()
const assistantStore = useAssistantStore()
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
  assistantStore.cancel()
  props.onClose?.()
}
function handleSave() {
  assistantStore.save()
  handleClose()
}
</script>

<template>
  <NCard
    data-tauri-drag-region
    class="h-full overflow-hidden rounded-sm bg-neutral-800 bg-opacity-90 shadow-lg backdrop-blur"
    size="small"
    role="dialog"
    aria-modal="true"
  >
    <template #header>
      <div
        data-tauri-drag-region
        select-none
        :pl="!showClose ? 16 : 0"
      >
        {{ assistantStore.type === 'update' ? t('block.update') : t('block.create') }}
      </div>
    </template>
    <template #header-extra>
      <div flex items-center gap-2>
        <Pin v-if="pinned" />
        <NButton
          v-if="props.showClose"
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
      :on-created="editor => assistantStore.editor = editor"
    />
    <template #footer>
      <div flex items-center justify-between gap-2>
        <div>
          <input
            ref="uploadRef"
            class="hidden"
            multiple
            type="file"
            accept="image/*,.pdf"
            @change="assistantStore.upload"
          >
          <NButton
            quaternary
            size="small"
            @click="uploadRef.click()"
          >
            <template #icon>
              <i i-ri-attachment-2 />
            </template>
          </NButton>
        </div>

        <NSelect
          v-model:value="assistantStore.tags"
          class="flex-1"
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

        <div flex items-center gap-2>
          <NButton
            v-if="assistantStore.editingBlock"
            text
            size="small"
            :disabled="!assistantStore.value || assistantStore.loading"
            @click="e => {
              e.stopPropagation()
              assistantStore.cancel()
            }"
          >
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            secondary
            type="primary"
            size="small"
            :loading="assistantStore.loading"
            :disabled="!assistantStore.value || assistantStore.loading"
            @click.stop="handleSave"
          >
            <template #icon>
              <i i-ri-send-plane-2-fill />
            </template>
            {{ assistantStore.type === 'update' ? t('block.update') : t('block.create') }}
          </NButton>
        </div>
      </div>
    </template>
  </NCard>
</template>

<style lang="sass">
.n-base-selection .n-base-selection-tags
  @apply bg-transparent pl-3px
.n-base-select-menu .n-virtual-list
  @apply max-h-40
</style>

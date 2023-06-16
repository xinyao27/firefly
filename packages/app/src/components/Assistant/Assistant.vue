<script setup lang="ts">
import Editor from '@firefly/editor'
import type { CascaderOption, SelectOption, SelectRenderTag, UploadFileInfo, UploadInst } from 'naive-ui'
import { NTag } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { TagWithChildren } from '@firefly/common'
import Bubble from '~/components/Bubble/Bubble.vue'

const props = withDefaults(defineProps<{
  pinned?: boolean
  class?: string
  showClose?: boolean
  onClose?: () => void
}>(), {
  showClose: true,
})
const { modelValue } = defineModels<{
  modelValue: string
}>()

const { t } = useI18n()
const assistantStore = useAssistantStore()
const tagStore = useTagStore()
const uploadRef = ref<UploadInst>()
const tags = computed(() => getOptions(tagStore.tags))
const newTag = ref('')
function getOptions(tags: TagWithChildren[]): CascaderOption[] {
  return tags.map((tag) => {
    const result: CascaderOption = {
      label: tag.name,
      value: tag.originalName,
    }
    if (tag.children?.length)
      result.children = getOptions(tag.children)
    return result
  })
}
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
  assistantStore.close()
  assistantStore.clear()
  props.onClose?.()
}
function handleSave() {
  assistantStore.close()
  assistantStore.save()
    .then(assistantStore.clear)
}
function handleUploadChange(data: { fileList: UploadFileInfo[] }) {
  assistantStore.fileList = data.fileList
}
async function handleCreateNewTag(tagName: string) {
  try {
    await tagStore.create(tagName)
    assistantStore.tags.push(tagName)
  }
  finally {
    newTag.value = ''
  }
}
</script>

<template>
  <NCard
    class="h-full max-h-431px overflow-hidden rounded-sm bg-neutral-800 bg-opacity-90 shadow-lg backdrop-blur"
    size="small"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <template #header>
      <div
        style="-webkit-app-region: drag;"
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
      v-model="modelValue"
      class="prose prose-dark dark:prose-white"
      :class="props.class"
      :tags="tagStore.tags"
      :on-created="editor => assistantStore.editor = editor"
    />
    <NUpload
      v-show="assistantStore.fileList.length > 0"
      ref="uploadRef"
      v-model:file-list="assistantStore.fileList"
      class="mt-2"
      multiple
      :max="7"
      accept="image/*"
      list-type="image-card"
      @change="handleUploadChange"
    />
    <template #footer>
      <div flex items-center justify-between gap-2>
        <NButton
          quaternary
          size="small"
          @click="uploadRef?.openOpenFileDialog"
        >
          <template #icon>
            <i i-ri-image-fill />
          </template>
        </NButton>

        <NCascader
          v-model:value="assistantStore.tags"
          class="flex-1"
          size="small"
          multiple filterable
          :options="tags"
          :render-label="renderLabel"
          :render-tag="renderTag"
          :max-tag-count="8"
          check-strategy="child"
          :placeholder="t('tag.placeholder')"
        >
          <template #action>
            <NInput
              v-model:value="newTag"
              placeholder="Create a tag Enter to save"
              @keyup="e => e.key === 'Enter' && handleCreateNewTag(newTag)"
            >
              <template #prefix>
                <i i-ri-add-line />
              </template>
            </NInput>
          </template>
        </NCascader>

        <div flex items-center gap-2>
          <NButton
            v-if="assistantStore.editingBlock"
            text
            size="small"
            :disabled="!assistantStore.value || assistantStore.loading"
            @click="e => {
              e.stopPropagation()
              handleClose()
            }"
          >
            {{ t('common.cancel') }}
          </NButton>
          <NButton
            secondary
            type="primary"
            size="small"
            :loading="assistantStore.loading"
            :disabled="!(assistantStore.value || assistantStore.fileList.length > 0) || assistantStore.loading"
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

<script setup lang="ts">
import type { SelectOption, SelectRenderTag } from 'naive-ui'
import { NTag } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { isUrl } from '@firefly/common'
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
const message = useMessage()
const assistantLinkStore = useAssistantLinkStore()
const tagStore = useTagStore()
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
  assistantLinkStore.close()
  assistantLinkStore.clear()
  props.onClose?.()
}
function handleSave() {
  // validate
  if (!isUrl(assistantLinkStore.value))
    return message.error(t('assistantLink.invalidUrl'))

  assistantLinkStore.close()
  assistantLinkStore.save()
    .then(assistantLinkStore.clear)
}
function handleNoSideSpace(value: string) {
  return !value.startsWith(' ') && !value.endsWith(' ')
}
</script>

<template>
  <NCard
    data-tauri-drag-region
    class="h-full max-h-431px overflow-hidden rounded-sm bg-neutral-800 bg-opacity-90 shadow-lg backdrop-blur"
    size="small"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <template #header>
      <div
        data-tauri-drag-region
        select-none
        :pl="!showClose ? 16 : 0"
      >
        {{ assistantLinkStore.type === 'update' ? t('common.update') : t('common.create') }} Link
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
    <NInput
      v-model:value="modelValue"
      type="textarea"
      :placeholder="t('assistantLink.placeholder')"
      :autosize="{
        minRows: 3,
        maxRows: 5,
      }"
      :allow-input="handleNoSideSpace"
    />
    <template #footer>
      <div flex items-center justify-between gap-2>
        <NSelect
          v-model:value="assistantLinkStore.tags"
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
            v-if="assistantLinkStore.editingBlock"
            text
            size="small"
            :disabled="!assistantLinkStore.value || assistantLinkStore.loading"
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
            :loading="assistantLinkStore.loading"
            :disabled="!assistantLinkStore.value || assistantLinkStore.loading"
            @click.stop="handleSave"
          >
            <template #icon>
              <i i-ri-send-plane-2-fill />
            </template>
            {{ assistantLinkStore.type === 'update' ? t('common.update') : t('common.create') }}
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

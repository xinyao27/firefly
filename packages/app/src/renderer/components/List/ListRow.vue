<script setup lang="ts">
import { useContextMenuOptions } from './useContextMenuOptions'
import { useCardClick } from './useCardClick'
import { useData } from './useData'
import { useDragStart } from './useDragStart'
import type { MessageModelWithUsed } from '~/models/Message'
import { useContextMenu } from '~renderer/composables/useContextMenu'

const props = defineProps<{
  size: number
  message: MessageModelWithUsed
}>()

const messageStore = useMessageStore()
const message = props.message

const isCurrent = computed(() => messageStore.currentMessageId === message.id)

const { title, thumb } = useData(message)
const { handleClick, handleDoubleClick } = useCardClick(message.id)
const contextMenuOptions = useContextMenuOptions()
const { show: showContextMenu } = useContextMenu(contextMenuOptions.value)
const { handleDragStart } = useDragStart(message)
function handleContextMenu(e: MouseEvent) {
  if (messageStore.selectedMessageIds.length < 1) {
    handleClick()
  }
  else if (!messageStore.selectedMessageIds.includes(message.id)) {
    handleClick()
  }
  showContextMenu(e)
}
</script>

<template>
  <div
    flex items-center gap-2 p-1 overflow-hidden relative rounded transition hover:bg-neutral-700 cursor-grab
    :class="isCurrent ? 'bg-neutral-700' : ''"
    data-message-card
    :data-id="message.id"
    @click.capture.prevent.stop="handleClick"
    @contextmenu.capture.prevent.stop="handleContextMenu"
  >
    <div
      w-5 h-5 overflow-hidden flex items-center justify-center relative select-none
      data-message-card-select-area
      draggable="true"
      @dblclick.capture.prevent.stop="handleDoubleClick"
      @dragstart="handleDragStart"
    >
      <NImage
        v-if="thumb"
        data-message-card-select-area
        draggable="false"
        lazy
        preview-disabled
        :src="thumb"
        :alt="message.title"
      />
    </div>
    <div
      overflow-hidden flex flex-col gap-1 truncate leading-4 select-none
      :class="isCurrent ? 'font-semibold' : ''"
      data-message-card-select-area
    >
      {{ title }}
    </div>
    <div
      v-if="message.fileExt && message.category !== 'text'"
      bg-neutral-700 bg-opacity-60 text-xs font-semibold scale-60 px-1 rounded select-none
      data-message-card-select-area
    >
      {{ message.fileExt.toUpperCase() }}
    </div>
    <div
      v-if="message.used"
      absolute top-0 right-0 bottom-0 left-0 bg-green-400 bg-opacity-10
      data-message-card-select-area
    >
      <i
        i-ri-checkbox-circle-fill text-green-500 w-4 h-4 absolute right-1 bottom-1 select-none
        data-message-card-select-area
      />
    </div>
  </div>
</template>

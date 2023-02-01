<script setup lang="ts">
import { useContextMenuOptions } from './useContextMenuOptions'
import { useCardClick } from './useCardClick'
import { useData } from './useData'
import { useDragStart } from './useDragStart'
import { useContextMenu } from '~/composables/useContextMenu'
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  size: number
  message: MessageModel
}>()

const messageStore = useMessageStore()
const message = props.message

const { description, thumb, isSelected } = useData(message)
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
    inline-flex flex-col text-center overflow-hidden relative
    :style="{ width: `${props.size}px` }"
    data-message-card
    :data-id="message.id"
    @click.capture.prevent.stop="handleClick"
    @contextmenu.capture.prevent.stop="handleContextMenu"
  >
    <div
      overflow-hidden flex items-center justify-center relative select-none
      :style="{ width: `${props.size}px`, height: `${props.size * 0.618}px` }"
      data-message-card-select-area
      draggable="true"
      @dblclick.capture.prevent.stop="handleDoubleClick"
      @dragstart="handleDragStart"
    >
      <img
        v-if="thumb"
        w-auto h-full max-w-none
        data-message-card-select-area
        draggable="false"
        loading="lazy"
        :src="thumb"
        :alt="message.title"
      >
      <div
        v-if="message.category === 'text'"
        absolute top-0 right-0 bottom-0 left-0 bg-dark-200 border-2 border-dark-500 p-2 text-left select-none
        data-message-card-select-area
      >
        {{ message.content }}
      </div>
      <div
        v-if="isSelected"
        absolute top-0 right-0 bottom-0 left-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500
        data-message-card-select-area
      />
      <div
        v-if="message.fileExt && message.category !== 'text'"
        bg-black bg-opacity-60 text-xs font-semibold px-1 absolute rounded left-1 top-1 transform scale-90 select-none
        data-message-card-select-area
      >
        {{ message.fileExt.toUpperCase() }}
      </div>
    </div>
    <div text-xs line-clamp-2 break-words leading-4 mt-2 select-none>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 mt-1 font-600 line-clamp-2 break-words select-none>
      {{ description }}
    </div>
  </div>
</template>

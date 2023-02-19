<script setup lang="ts">
import type { MessageModelWithUsed } from '~/models/Message'
import { useContextMenuOptions } from './useContextMenuOptions'
import { useCardClick } from './useCardClick'
import { useData } from './useData'
import { useDragStart } from './useDragStart'
import { useContextMenu } from '~renderer/composables/useContextMenu'

const props = defineProps<{
  size: number
  message: MessageModelWithUsed
}>()

const messageStore = useMessageStore()
const message = props.message

const { title, description, thumb, updatedAt, updatedFromNow } = useData(message)
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
    flex items-center gap-2 overflow-hidden relative rounded transition hover:bg-neutral-700 cursor-grab
    data-message-card
    :data-id="message.id"
    @click.capture.prevent.stop="handleClick"
    @contextmenu.capture.prevent.stop="handleContextMenu"
  >
    <div
      py-2 overflow-hidden flex items-center justify-center relative select-none
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
        v-if="message.fileExt && message.category !== 'text'"
        bg-black bg-opacity-60 text-xs font-semibold px-1 absolute rounded left-1 top-1 transform scale-90 select-none
        data-message-card-select-area
      >
        {{ message.fileExt.toUpperCase() }}
      </div>
    </div>
    <div
      flex-1 overflow-hidden flex flex-col gap-1
      data-message-card-select-area
    >
      <div text-xs truncate leading-4 select-none>
        {{ title }}
      </div>
      <div text-xs text-neutral-500 font-600 truncate select-none>
        {{ message.content }}
      </div>
      <div text-xs text-neutral-500 font-600 truncate select-none>
        {{ description }}
      </div>
    </div>
    <NTooltip trigger="hover">
      <template #trigger>
        <div
          mr-2 text-neutral-500 text-xs select-none
          data-message-card-select-area
        >
          {{ updatedFromNow }}
        </div>
      </template>
      更新于 {{ updatedAt }}
    </NTooltip>
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

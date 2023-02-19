<script setup lang="ts">
import Draggable from 'vuedraggable'
import ListRow from './ListRow.vue'

const messageStore = useMessageStore()

function handleDragStart(e: any) {
  messageStore.draggingMessage = messageStore.messages[e.oldIndex]
}
function handleDragEnd() {
  messageStore.draggingMessage = null
}
</script>

<template>
  <div
    w-full h-full
    draggable="false"
  >
    <div w-full h-full>
      <Draggable
        v-model="messageStore.messages"
        class="h-full flex flex-col gap-1"
        :group="{ name: 'messageDraggable', pull: 'clone', put: false }"
        item-key="id"
        :clone="() => {}"
        :sort="false"
        @start="handleDragStart"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <ListRow
            :message="element"
            :size="72"
          />
        </template>
      </Draggable>
    </div>
  </div>
</template>

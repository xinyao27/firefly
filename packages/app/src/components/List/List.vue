<script setup lang="ts">
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'
import Draggable from 'vuedraggable'
import ListCard from './ListCard.vue'
import ListRow from './ListRow.vue'

const props = withDefaults(
  defineProps<{
    mode: 'rowList' | 'cardList'
    functional: 'preview' | 'draggable'
  }>(),
  {
    mode: 'rowList',
    functional: 'preview',
  },
)

const messageStore = useMessageStore()
const configStore = useConfigStore()

const sortedMessages = computed(() => {
  return groupBy(messageStore.messages, v => dayjs(v.updatedAt).format('YYYY/MM/DD'))
})

function handleDragStart(e: any) {
  messageStore.textEditorDraggingMessage = messageStore.textEditorMessages[e.oldIndex]
}
function handleDragEnd() {
  messageStore.textEditorDraggingMessage = null
}
</script>

<template>
  <NTimeline
    v-if="props.mode === 'cardList'"
    px-4 pt-4
    draggable="false"
  >
    <NTimelineItem
      v-for="(row, key) in sortedMessages"
      :key="key"
    >
      <div font-semibold text-neutral-500 mb-3 select-none>
        {{ key }}
      </div>
      <div relative z-34 flex flex-wrap gap-3>
        <ListCard
          v-for="item in row"
          :key="item.id"
          :message="item"
          :size="configStore.baseSize / 100 * 240"
        />
      </div>
    </NTimelineItem>
  </NTimeline>

  <div
    v-if="props.mode === 'rowList'"
    w-full h-full
    :class="props.functional === 'preview' ? 'px-4 pt-4' : 'px-2 pt-2'"
    draggable="false"
  >
    <template v-if="props.functional === 'preview'">
      <div
        v-for="(row, key) in sortedMessages"
        :key="key"
        w-full h-full mb-2
      >
        <div w-full font-semibold text-neutral-500 select-none mb-2>
          {{ key }}
        </div>
        <div
          w-full flex flex-col gap-1
        >
          <ListRow
            v-for="item in row"
            :key="item.id"
            :functional="props.functional"
            :message="item"
            :size="configStore.baseSize / 100 * 240"
          />
        </div>
      </div>
    </template>
    <div
      v-if="props.functional === 'draggable'"
      w-full h-full
    >
      <Draggable
        v-model="messageStore.textEditorMessages"
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
            :functional="props.functional"
            :message="element"
            :size="72"
          />
        </template>
      </Draggable>
    </div>
  </div>
</template>

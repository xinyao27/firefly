<script setup lang="ts">
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'
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
</script>

<template>
  <NTimeline
    v-if="props.mode === 'cardList'"
    px-4 pt-4
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
    w-full p-4
  >
    <div
      v-for="(row, key) in sortedMessages"
      :key="key"
      w-full
    >
      <div w-full font-semibold text-neutral-500 select-none my-2>
        {{ key }}
      </div>
      <div w-full flex flex-col gap-1>
        <ListRow
          v-for="item in row"
          :key="item.id"
          :functional="props.functional"
          :message="item"
          :size="props.functional === 'preview' ? configStore.baseSize / 100 * 240 : 72"
        />
      </div>
    </div>
  </div>
</template>

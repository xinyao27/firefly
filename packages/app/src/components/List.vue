<script setup lang="ts">
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'

const messageStore = useMessageStore()
const configStore = useConfigStore()

const sortedMessages = computed(() => {
  return groupBy(messageStore.messages, v => dayjs(v.updatedAt).format('YYYY/MM/DD'))
})
</script>

<template>
  <NTimeline>
    <NTimelineItem
      v-for="(row, key) in sortedMessages"
      :key="key"
    >
      <div font-semibold text-neutral-500 mb-3 select-none>
        {{ key }}
      </div>
      <div
        relative z-34 flex flex-wrap gap-3 overflow-x-hidden overflow-y-auto overscroll-contain
      >
        <ListCard
          v-for="item in row" :key="item.id"
          :message="item"
          :size="configStore.cardSize"
        />
      </div>
    </NTimelineItem>
  </NTimeline>
</template>

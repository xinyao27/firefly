<script setup lang="ts">
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'

const messagesStore = useMessagesStore()
const configsStore = useConfigsStore()

const sortedMessages = computed(() => {
  return groupBy(messagesStore.messages, v => dayjs(v.updatedAt).format('YYYY/MM/DD'))
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
          :size="configsStore.cardSize"
        />
      </div>
    </NTimelineItem>
  </NTimeline>
</template>

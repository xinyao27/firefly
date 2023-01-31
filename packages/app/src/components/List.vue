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
  <SelectProvider>
    <DragProvider>
      <NTimeline
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
              v-for="item in row" :key="item.id"
              :message="item"
              :size="configStore.baseSize / 100 * 240"
            />
          </div>
        </NTimelineItem>
      </NTimeline>
    </DragProvider>
  </SelectProvider>
</template>

<script setup lang="ts">
const messagesStore = useMessagesStore()
const configsStore = useConfigsStore()
</script>

<template>
  <NTimeline>
    <NTimelineItem
      v-for="(row, key) in messagesStore.sortedAll"
      :key="key"
    >
      <div font-semibold text-neutral-500 mb-3>
        {{ key }}
      </div>
      <div relative z-34 flex flex-wrap gap-3 overflow-x-hidden overflow-y-auto overscroll-contain>
        <ListCard
          v-for="item in row" :key="item.id"
          :message="item"
          :size="configsStore.cardSize"
        />
      </div>
    </NTimelineItem>
  </NTimeline>
</template>

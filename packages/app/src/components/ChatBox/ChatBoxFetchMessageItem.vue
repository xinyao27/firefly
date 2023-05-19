<script setup lang="ts">
import dayjs from 'dayjs'
import type { ChatMessage } from '~/stores/copilot'

const props = defineProps<{
  message: ChatMessage
}>()
</script>

<template>
  <section
    class="message flex flex-col gap-2 overflow-hidden break-words border border-(slate opacity-15) rounded p-3"
  >
    <NCollapse
      :default-expanded-names="['blocks']"
      display-directive="show"
    >
      <template #arrow>
        <i i-ri-arrow-right-s-line text-xs />
      </template>

      <NCollapseItem
        :name="props.message.metadata.link"
      >
        <template #header>
          <div flex="~ gap-2">
            <span text-xs>
              {{ props.message.metadata.title }}
            </span>
            <span text-xs text-neutral>
              {{ props.message.metadata.link }}
            </span>
            <span text-xs text-neutral>
              {{ dayjs(props.message.metadata.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </div>
        </template>
        <div class="border border-(slate opacity-15) rounded p-2">
          {{ props.message.content }}
        </div>
      </NCollapseItem>
    </NCollapse>
  </section>
</template>

<style scoped lang="sass">
.message
  code
    @apply font-mono bg-neutral-600 text-neutral text-xs p-1 rounded-sm before:content-[""] after:content-[""]
</style>

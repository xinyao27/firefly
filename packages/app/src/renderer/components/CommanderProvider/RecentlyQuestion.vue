<script setup lang="ts">
import { useCommanderRecently } from '~renderer/composables/useCommanderRecently'

const emit = defineEmits<{
  (e: 'select', prompt: string): void
}>()

const recently = useCommanderRecently()

function handleSelect(prompt: string) {
  emit('select', prompt)
}
</script>

<template>
  <div p-4 min-h-24 flex justify-start>
    <div v-if="recently.length" flex flex-col gap-4>
      <div text-sm>
        最近问题
      </div>
      <div flex flex-wrap gap-4>
        <NButton
          v-for="item in recently"
          :key="item"
          tertiary
          size="small"
          @click="handleSelect(item)"
        >
          {{ item }}
        </NButton>
      </div>
    </div>
    <div v-else>
      没有最近问题
    </div>
  </div>
</template>

<script setup lang="ts">
const copilotStore = useCopilotStore()

function handleSelect(prompt: string) {
  copilotStore.reset()
  copilotStore.question = prompt
  copilotStore.getCompletion()
}
</script>

<template>
  <div min-h-24 bg-neutral-800 flex justify-start p-4>
    <div
      v-if="copilotStore.recently.length"
      flex flex-col gap-4
    >
      <div text-sm>
        最近问题
      </div>
      <div flex flex-wrap gap-4>
        <NButton
          v-for="item in copilotStore.recently"
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

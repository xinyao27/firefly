<script setup lang="ts">
const commanderStore = useCommanderStore()

function handleSelect(prompt: string) {
  commanderStore.reset()
  commanderStore.question = prompt
  commanderStore.getCompletion()
}
</script>

<template>
  <div p-4 pt-0 min-h-24 flex justify-start>
    <div v-if="commanderStore.recently.length" flex flex-col gap-4>
      <div text-sm>
        最近问题
      </div>
      <div flex flex-wrap gap-4>
        <NButton
          v-for="item in commanderStore.recently"
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

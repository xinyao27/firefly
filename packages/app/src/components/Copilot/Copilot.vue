<script setup lang="ts">
import type { CopilotModel } from '@firefly/common'

const props = defineProps<{
  data: CopilotModel
}>()
</script>

<template>
  <NCard
    class="cursor-pointer"
    :title="props.data.name"
    hoverable
  >
    <div>{{ props.data.description }}</div>
    <div mt-2>
      <span font-semibold mr-1>{{ props.data.interactions }}</span>Interactions
    </div>
  </NCard>
</template>

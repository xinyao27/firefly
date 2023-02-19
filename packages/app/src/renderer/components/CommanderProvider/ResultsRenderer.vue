<script setup lang="ts">
import { KBarResults, useKBarMatches } from '@bytebase/vue-kbar'

const matches = useKBarMatches()

// Tell KBarResults the height of each item will be rendered
const itemHeight = (params: { item: any; index: number }) => {
  if (typeof params.item === 'string') return 32
  return 64
}
</script>

<template>
  <KBarResults
    :items="matches.results"
    :item-height="itemHeight"
    class="max-h-96 p-2"
  >
    <template #item="{ item, active }">
      <div
        v-if="typeof item === 'string'"
        flex items-center px-2 py-1 text-neutral-600 font-semibold
      >
        {{ item }}
      </div>
      <div
        v-else
        flex items-center gap-2 p-2 cursor-pointer rounded transition hover:bg-neutral-700
        :class="{ 'bg-neutral-700': active }"
      >
        <span>
          {{ item.name }}
        </span>
        <span
          v-if="item.subtitle"
          text-neutral-600
        >
          —
        </span>
        <span
          v-if="item.subtitle"
          text-neutral-600
        >
          {{ item.subtitle }}
        </span>
      </div>
    </template>
  </KBarResults>
</template>

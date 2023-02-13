<script setup lang="ts">
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from '@bytebase/vue-kbar'
import { actions } from './actions'
import ResultsRenderer from './ResultsRenderer.vue'
</script>

<template>
  <KBarProvider :actions="actions">
    <KBarPortal>
      <KBarPositioner class="bg-neutral-900 bg-opacity-50 z-10000">
        <KBarAnimator
          class="bg-neutral-800 shadow-lg rounded-lg w-128 overflow-hidden divide-y divide-neutral-700"
        >
          <div flex items-center>
            <i i-ri-search-line text-lg text-neutral-600 ml-3 />
            <KBarSearch
              class="p-3 text-lg w-full bg-inherit box-border outline-none border-none"
              placeholder="搜索信息..."
            />
          </div>
          <ResultsRenderer />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>

    <slot />
  </KBarProvider>
</template>

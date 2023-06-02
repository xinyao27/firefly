<script setup lang="ts">
import type { BlockModel } from '@firefly/common'

const props = defineProps<{
  blocks: BlockModel[]
}>()
</script>

<template>
  <section
    class="message"
    overflow-hidden break-words rounded p-3
    flex="~ col gap-2"
    border="~ neutral opacity-30 dark:slate dark:opacity-15"
  >
    <NCollapse
      :default-expanded-names="['blocks']"
      display-directive="show"
    >
      <template #arrow>
        <i i-ri-arrow-right-s-line text-xs />
      </template>

      <NCollapseItem name="blocks">
        <template #header>
          <div text-xs text-neutral>
            {{ $t('block.blocks') }}
          </div>
        </template>
        <div
          rounded p-2
          border="~ neutral opacity-30 dark:slate dark:opacity-15"
        >
          <ListItem
            v-for="block in props.blocks"
            :key="block.id"
            :data="block"
            :show-options="false"
          />
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

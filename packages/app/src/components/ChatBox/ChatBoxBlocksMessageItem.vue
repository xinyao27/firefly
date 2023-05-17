<script setup lang="ts">
import type { BlockModel } from '@firefly/common'

const props = defineProps<{
  blocks: BlockModel[]
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

      <NCollapseItem name="blocks">
        <template #header>
          <div text-xs text-neutral>
            {{ $t('block.blocks') }}
          </div>
        </template>
        <div class="border border-(slate opacity-15) rounded p-2">
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

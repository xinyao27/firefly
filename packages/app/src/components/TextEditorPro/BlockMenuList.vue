<script setup lang="ts">
const props = defineProps<{
  items: any[]
  command: (params: any) => void
}>()

const selectedIndex = ref(0)
function onKeyDown({ event }: any) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler() {
  selectItem(selectedIndex.value)
}

function selectItem(index: number) {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

defineExpose({ onKeyDown })
</script>

<template>
  <div p-2 bg-dark-300 rounded flex flex-col gap-1>
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        p-1 rounded transition hover:bg-neutral-600 flex items-center gap-2
        :class="{ 'bg-neutral-600': index === selectedIndex }"
        @click="selectItem(index)"
      >
        <div w-10 h-10 bg-white rounded flex items-center justify-center>
          <i :class="item.icon" text-black block />
        </div>
        <div flex flex-col text-left>
          <div truncate>
            {{ item.label }}
          </div>
          <div text-truegray text-xs truncate>
            {{ item.description }}
          </div>
        </div>
      </button>
    </template>
    <div
      v-else
      p-1 rounded flex items-center gap-2
    >
      No result
    </div>
  </div>
</template>

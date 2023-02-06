<script setup lang="ts">
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import type { ScrollbarInst } from 'naive-ui'
import type { CommandItem } from './commands'

const props = defineProps<{
  items: CommandItem[]
  command: (params: any) => void
}>()

const selectedIndex = ref(0)
const buttonRefs = ref<Element[]>([])
const scrollBarRef = ref<ScrollbarInst>()

function setButtonRef(el: any) {
  if (el) buttonRefs.value.push(el)
}

function handleScrollToSelectItem() {
  const el = buttonRefs.value[selectedIndex.value]
  if (el) {
    scrollBarRef.value?.scrollTo({
      left: 0,
      // @ts-expect-error noop
      top: el.offsetTop - 48,
      behavior: 'smooth',
    })
  }
}

function onKeyDown({ event }: SuggestionKeyDownProps) {
  if (event.key === 'ArrowUp') {
    event.stopPropagation()
    event.preventDefault()
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    event.stopPropagation()
    event.preventDefault()
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    event.stopPropagation()
    event.preventDefault()
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
  nextTick(() => {
    handleScrollToSelectItem()
  })
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
  nextTick(() => {
    handleScrollToSelectItem()
  })
}

function enterHandler() {
  handleSelectItem(selectedIndex.value)
}

function handleSelectItem(index: number) {
  const item = props.items[index]

  if (item) {
    setTimeout(() => props.command(item))
  }
}

defineExpose({ onKeyDown })
</script>

<template>
  <div bg-dark-300 rounded p-2>
    <NScrollbar ref="scrollBarRef" max-h-50>
      <template v-if="items.length">
        <button
          v-for="(item, index) in items"
          :key="index"
          :ref="el => setButtonRef(el)"
          w-full p-1 rounded transition flex items-center gap-2
          :class="{ 'bg-neutral-600': index === selectedIndex }"
          @click="handleSelectItem(index)"
          @mouseenter="selectedIndex = index"
        >
          <div w-10 h-10 bg-white rounded flex items-center justify-center>
            <i :class="item.icon" text-black block />
          </div>
          <div flex flex-col text-left>
            <div truncate>
              {{ item.title }}
            </div>
            <div text-neutral text-xs truncate>
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
    </NScrollbar>
  </div>
</template>

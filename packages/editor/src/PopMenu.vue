<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Action } from './types'

const props = defineProps<{
  editor: Editor
  items: Action[]
  command: (action: Action) => void
}>()

const { t } = useI18n()

const selectedIndex = ref(0)
const buttonRefs = ref<Element[]>([])
const scrollBarRef = ref<HTMLElement>()

function setButtonRef(el: any) {
  if (el)
    buttonRefs.value.push(el)
}

function handleScrollToSelectItem() {
  const el = buttonRefs.value[selectedIndex.value] as HTMLElement
  if (el) {
    scrollBarRef.value?.scrollTo({
      left: 0,
      top: el.offsetTop - 48,
      behavior: 'smooth',
    })
  }
}

function onKeyDown({ event }: SuggestionKeyDownProps) {
  if (event.key === 'ArrowUp') {
    event.stopPropagation()
    event.preventDefault()
    selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
    nextTick(() => {
      handleScrollToSelectItem()
    })
    return true
  }

  if (event.key === 'ArrowDown') {
    event.stopPropagation()
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    nextTick(() => {
      handleScrollToSelectItem()
    })
    return true
  }

  if (event.key === 'Enter') {
    event.stopPropagation()
    event.preventDefault()
    if (props.items.length)
      handleSelectItem(selectedIndex.value)
    return true
  }

  return false
}

function handleSelectItem(index: number) {
  const item = props.items[index]
  if (item)
    setTimeout(() => props.command(item))
}

defineExpose({ onKeyDown })
</script>

<template>
  <div bg-white bg-opacity-90 backdrop-blur shadow-lg rounded-sm p-2>
    <div ref="scrollBarRef" max-h-50 overflow-x-hidden overflow-y-auto>
      <template v-if="props.items.length">
        <div
          v-for="(item, index) in props.items"
          :key="index"
          :ref="el => setButtonRef(el)"
          w-full p-1 rounded-sm transition flex items-center gap-2 cursor-pointer
          :class="{ 'bg-neutral-200': index === selectedIndex }"
          @click="handleSelectItem(index)"
          @mouseenter="selectedIndex = index"
        >
          <div
            v-if="item.icon"
            w-10 h-10 bg-white rounded-sm flex items-center justify-center
          >
            <component :is="item.icon" />
          </div>
          <div flex flex-col text-left>
            <div text-neutral-800 truncate>
              {{ item.label }}
            </div>
            <div
              v-if="item.description"
              text-neutral text-xs truncate
            >
              {{ item.description }}
            </div>
          </div>
        </div>
      </template>
      <div
        v-else
        p-1 rounded-sm flex items-center gap-2
      >
        {{ t('common.no-result') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageId } from '~~/models/Message'

const route = useRoute()
const configStore = useConfigStore()
const messageStore = useMessageStore()

const scrollView = ref<HTMLElement | null>(null)
onMounted(() => {
  scrollView.value = document.querySelector('#scroll-view')
})
const selecting = ref(false)
const startX = ref<number | null>(null)
const startY = ref<number | null>(null)
const endX = ref<number | null>(null)
const endY = ref<number | null>(null)
const selectAreaX = computed(() => {
  if (startX.value !== null && endX.value !== null) {
    return Math.min(startX.value, endX.value)
  }
  return null
})
const selectAreaY = computed(() => {
  if (startY.value !== null && endY.value !== null) {
    return Math.min(startY.value, endY.value)
  }
  return null
})
const selectAreaWidth = computed(() => {
  if (startX.value !== null && endX.value !== null) {
    return Math.abs(startX.value - endX.value)
  }
  return null
})
const selectAreaHeight = computed(() => {
  if (startY.value !== null && endY.value !== null) {
    return Math.abs(startY.value - endY.value)
  }
  return null
})
const allMessageCardRects = ref<{ rect: DOMRect; element: Element }[] | null>(null)

function handleSelectMessageCardAndGetIds() {
  const selectedMessageIds: MessageId[] = []
  if (allMessageCardRects.value) {
    for (const { rect, element } of allMessageCardRects.value) {
      if (
        selectAreaX.value !== null
          && selectAreaY.value !== null
          && selectAreaWidth.value !== null
          && selectAreaHeight.value !== null
          && selectAreaX.value < rect.x + rect.width + (scrollView.value?.scrollLeft ?? 0)
          && selectAreaX.value + selectAreaWidth.value > rect.x + (scrollView.value?.scrollLeft ?? 0)
          && selectAreaY.value < rect.y + rect.height + (scrollView.value?.scrollTop ?? 0)
          && selectAreaY.value + selectAreaHeight.value > rect.y + (scrollView.value?.scrollTop ?? 0)
      ) {
        // @ts-expect-error noop
        selectedMessageIds.push(element.dataset.id)
      }
    }
    messageStore.selectMessageIds(selectedMessageIds)
  }
}
function handleMouseDown(e: MouseEvent) {
  e.stopPropagation()

  if (route.path !== '/') return

  // @ts-expect-error noop
  if (e.button === 0 && !('messageCardSelectArea' in e.target?.dataset)) {
    startX.value = e.x + (scrollView.value?.scrollLeft ?? 0) - configStore.rootPaddingLeft
    startY.value = e.y + (scrollView.value?.scrollTop ?? 0) - configStore.rootPaddingTop
    selecting.value = true

    const messageCardRects = Array.from(document.querySelectorAll('[data-message-card]')).map(v => ({
      rect: v.getBoundingClientRect(),
      element: v,
    }))
    allMessageCardRects.value = messageCardRects
  }
}
useEventListener(scrollView, 'mousedown', handleMouseDown)
useEventListener('mouseup', (e) => {
  e.stopPropagation()

  if (selecting.value) {
    if (startX.value !== endX.value || startY.value !== endY.value) {
      handleSelectMessageCardAndGetIds()
    }
    selecting.value = false
    allMessageCardRects.value = null
    startX.value = null
    startY.value = null
    endX.value = null
    endY.value = null
  }
})
useEventListener('mousemove', (e) => {
  e.stopPropagation()

  if (selecting.value) {
    endX.value = e.x + (scrollView.value?.scrollLeft ?? 0) - configStore.rootPaddingLeft
    endY.value = e.y + (scrollView.value?.scrollTop ?? 0) - configStore.rootPaddingTop
    handleSelectMessageCardAndGetIds()
  }
})
</script>

<template>
  <div
    v-show="
      selecting
        && selectAreaX !== null
        && selectAreaY !== null
        && selectAreaWidth !== null
        && selectAreaHeight !== null
    "
    bg-opacity-20 bg-dark-100 border-1 border-dark-50 absolute
    :style="{
      left: `${selectAreaX}px`,
      top: `${selectAreaY}px`,
      width: `${selectAreaWidth}px`,
      height: `${selectAreaHeight}px`,
    }"
  />

  <slot />
</template>

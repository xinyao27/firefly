import type { Ref } from 'vue'
import type { ID } from '~/models/Message'

export function useSelectZone(target: Ref<HTMLDivElement | undefined>) {
  const configsStore = useConfigsStore()
  const messagesStore = useMessagesStore()

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
    const selectedMessages: ID[] = []
    if (allMessageCardRects.value) {
      for (const { rect, element } of allMessageCardRects.value) {
        if (
          selectAreaX.value !== null
          && selectAreaY.value !== null
          && selectAreaWidth.value !== null
          && selectAreaHeight.value !== null
          && selectAreaX.value < rect.x + rect.width + (target.value?.scrollLeft ?? 0)
          && selectAreaX.value + selectAreaWidth.value > rect.x + (target.value?.scrollLeft ?? 0)
          && selectAreaY.value < rect.y + rect.height + (target.value?.scrollTop ?? 0)
          && selectAreaY.value + selectAreaHeight.value > rect.y + (target.value?.scrollTop ?? 0)
        ) {
          // @ts-expect-error noop
          selectedMessages.push(element.dataset.id)
        }
      }
      messagesStore.selectMessageIds(selectedMessages)
    }
  }
  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()

    // 鼠标左键按下
    if (e.button === 0) {
      startX.value = e.x + (target.value?.scrollLeft ?? 0)
      startY.value = e.y + (target.value?.scrollTop ?? 0) - configsStore.rootPaddingTop
      selecting.value = true

      const messageCardRects = Array.from(document.querySelectorAll('[data-message-card]')).map(v => ({
        rect: v.getBoundingClientRect(),
        element: v,
      }))
      allMessageCardRects.value = messageCardRects
    }
  }
  useEventListener('mouseup', (e) => {
    e.stopPropagation()
    e.preventDefault()

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
    e.preventDefault()

    if (selecting.value) {
      endX.value = e.x + (target.value?.scrollLeft ?? 0)
      endY.value = e.y + (target.value?.scrollTop ?? 0) - configsStore.rootPaddingTop
      handleSelectMessageCardAndGetIds()
    }
  })

  return { selecting, selectAreaX, selectAreaY, selectAreaWidth, selectAreaHeight, handleMouseDown }
}

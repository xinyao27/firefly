<script setup lang="ts">
import { useFileDropZone } from '~/composables/useFileDropZone'
import { useSelectZone } from '~/composables/useSelectZone'

const loadingBarTargetRef = ref<HTMLElement>()
const dragView = ref<HTMLDivElement>()

const { isOverDropZone } = useFileDropZone(dragView)
const {
  selecting,
  selectAreaX,
  selectAreaY,
  selectAreaWidth,
  selectAreaHeight,
  handleMouseDown,
} = useSelectZone(dragView)
const { close: closeContextMenu } = useContextMenu()
function handleScroll() {
  closeContextMenu()
}
</script>

<template>
  <NLoadingBarProvider
    :to="loadingBarTargetRef"
    container-style="position: absolute;"
  >
    <div
      ref="loadingBarTargetRef"
      absolute bottom-0 left-0 w-screen h-2px pointer-events-none overflow-hidden
    />
    <UploadProgress />
    <div
      id="drag-view"
      ref="dragView"
      flex-auto relative z-36
      :overflow="isOverDropZone ? 'hidden' : 'overlay'"
      @mousedown="handleMouseDown"
      @scroll="handleScroll"
    >
      <!-- select area -->
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
      <Transition>
        <div
          v-show="isOverDropZone"
          fixed top-8 right-0 bottom-0 left-0 z-35 select-none bg-opacity-20 bg-blue-500 border-2 border-blue-500
        />
      </Transition>
      <Transition>
        <NButton
          v-show="isOverDropZone"
          fixed bottom-6 w-280px ml--140px z-35 transform select-none animate-bounce color-white
          left="1/2"
          bg="blue-500"
          type="primary"
          icon-placement="left"
          size="large"
        >
          <template #icon>
            <i i-ri-inbox-archive-line />
          </template>
          将文件拖放到这里添加
        </NButton>
      </Transition>

      <slot />
    </div>
  </NLoadingBarProvider>
</template>

<style scoped lang="sass">
#drag-view
  &::-webkit-scrollbar-thumb
    @apply bg-transparent
  &:hover
    &::-webkit-scrollbar-thumb
      @apply bg-dark-50
</style>

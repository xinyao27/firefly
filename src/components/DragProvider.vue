<script setup lang="ts">
function onDrop(files: File[] | null) {
  console.warn(files)
}
const { isOverDropZone } = useDropZone(document.documentElement, onDrop)
</script>

<template>
  <div
    id="drag-view"
    flex-auto px-4 relative z-36
    :overflow="isOverDropZone ? 'hidden' : 'overlay'"
  >
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
</template>

<style scoped lang="sass">
#drag-view
  &::-webkit-scrollbar-thumb
    @apply bg-transparent
  &:hover
    &::-webkit-scrollbar-thumb
      @apply bg-dark-50
</style>

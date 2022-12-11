<script setup lang="ts">
const dragging = ref(false)
function dragenterEvent(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()
  dragging.value = true
}
function dragleaveEvent(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (
    // @ts-expect-error noop
    e.target!.nodeName === 'HTML' || e.target === e.explicitOriginalTarget || (!e.fromElement
        && (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))
  ) {
    dragging.value = false
  }
}
function dropEvent(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()
  dragging.value = false
  const files = e.dataTransfer!.files
  console.warn(files)
}
onMounted(() => {
  const doc = document.documentElement
  doc.addEventListener('dragenter', e => e.preventDefault())
  doc.addEventListener('dragleave', e => e.preventDefault())
  doc.addEventListener('dragover', e => e.preventDefault())
  doc.addEventListener('drop', e => e.preventDefault())

  const body = document.body
  body.addEventListener('dragenter', dragenterEvent)
  body.addEventListener('dragleave', dragleaveEvent)
  body.addEventListener('drop', dropEvent)
})
onUnmounted(() => {
  const body = document.body
  body.removeEventListener('dragenter', dragenterEvent)
  body.removeEventListener('dragleave', dragleaveEvent)
  body.removeEventListener('drop', dropEvent)
})
</script>

<template>
  <div
    id="drag-view"
    flex-auto px-4 relative z-36
    :overflow="dragging ? 'hidden' : 'overlay'"
  >
    <Transition>
      <div
        v-show="dragging"
        fixed top-8 right-0 bottom-0 left-0 z-35 select-none bg-opacity-20 bg-blue-500 border-2 border-blue-500
      />
    </Transition>
    <Transition>
      <NButton
        v-show="dragging"
        fixed bottom-6 w-280px ml--140px z-35 transform select-none animate-bounce
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

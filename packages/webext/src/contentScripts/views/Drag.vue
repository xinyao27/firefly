<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { useFilesStore } from '~/store/files'

const [show, toggleShow] = useToggle(false)
const [dragIn, toggleDragIn] = useToggle(false)

const filesStore = useFilesStore()

useEventListener('drag', (e) => {
  e.preventDefault()
  toggleShow(true)
})
useEventListener('dragend', (e) => {
  e.preventDefault()
  toggleShow(false)
})

function handleDragEnter() {
  toggleDragIn(true)
}
function handleDragOver() {
  toggleDragIn(true)
}
function handleDragLeave() {
  toggleDragIn(false)
}
function handleDrop(e: DragEvent) {
  toggleDragIn(false)

  const files = Array.from(e.dataTransfer?.files ?? [])
  filesStore.upload(files.length === 0 ? null : files, e.dataTransfer?.getData('text'))
}
</script>

<template>
  <div
    v-if="show"
    fixed left-0 top-0 m-5 z-1000 flex items-end font-sans select-none leading-1em
  >
    <div w-72 p-3 rounded-2 bg-dark-100>
      <div text-center text-lg font-bold mb-3>
        收集到 Firefly
      </div>
      <div
        p-6 rounded-2 border border-dashed transition leading-1em bg-opacity-30
        :border-color="`${dragIn ? 'blue-500' : 'gray-500'}`"
        :bg="`${dragIn ? 'blue-500' : 'dark-300'}`"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <div h-8 flex items-center justify-center gap-3 :text="`${dragIn ? 'blue-500' : 'gray-500'}`">
          <i
            v-show="!dragIn"
            i-ri-upload-cloud-2-line
            text-lg block
          />
          {{ dragIn ? '松开以完成收藏' : '拖放到这里' }}
        </div>
      </div>
    </div>
  </div>
</template>

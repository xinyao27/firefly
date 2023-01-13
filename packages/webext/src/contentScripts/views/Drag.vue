<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { useFilesStore } from '~/store/files'

const [show, toggleShow] = useToggle(false)
const [dragIn, toggleDragIn] = useToggle(false)
const [uploaded, toggleUploaded] = useToggle(false)
const [uploading, toggleUploading] = useToggle(false)
const errorMessage = ref('')
let counter = 0

const filesStore = useFilesStore()

useEventListener('drag', (e) => {
  e.preventDefault()
  if (counter < 0) { counter = 0 }
  toggleShow(true)
})
useEventListener('dragend', (e) => {
  e.preventDefault()
  if (counter === 0) { toggleShow(false) }
})

function handleDragEnter() {
  counter += 1
  toggleDragIn(true)
}
function handleDragOver() {
  toggleDragIn(true)
}
function handleDragLeave() {
  counter -= 1
  if (counter === 0) { toggleDragIn(false) }
}

function handleDrop(e: DragEvent) {
  toggleDragIn(false)
  if (counter) {
    toggleUploading(true)
    const files = Array.from(e.dataTransfer?.files ?? [])
    filesStore.upload(files.length === 0 ? null : files, e.dataTransfer?.getData('text') ?? null, null)
      .then(() => {
        toggleUploaded(true)
        toggleUploading(false)
        setTimeout(() => {
          toggleShow(false)
          toggleUploaded(false)
          counter = 0
        }, 2000)
      })
      .catch(() => {
        errorMessage.value = '需要打开 Firefly 应用程序才能使用插件, 若已经打开仍然无法使用, 建议关闭代理工具后重试'
        toggleUploaded(true)
        toggleUploading(false)
        setTimeout(() => {
          toggleShow(false)
          toggleUploaded(false)
          counter = 0
          errorMessage.value = ''
        }, 8000)
      })
  }
}
</script>

<template>
  <div
    v-if="show"
    fixed left-0 top-0 m-5 z-1000 flex items-end font-sans select-none leading-1em
  >
    <div w-72 p-3 rounded-2 bg-dark-500>
      <div>
        <!-- title -->
        <div text-center text-lg font-bold mb-3>
          收集到 Firefly
        </div>
        <!-- status -->
        <div
          v-if="errorMessage"
          p-6 rounded-2 border border-dashed border-red-500 transition leading-1em bg-opacity-30 bg-red-500
        >
          <div h-8 flex items-center justify-center gap-3 pointer-events-none text-red-500>
            {{ errorMessage }}
          </div>
        </div>
        <div
          v-else-if="uploaded"
          p-6 rounded-2 border border-dashed border-green-500 transition leading-1em bg-opacity-30 bg-green-500
        >
          <div h-8 flex items-center justify-center gap-3 pointer-events-none text-green-500>
            <i
              i-ri-check-line
              text-lg block
            />
          </div>
        </div>
        <div
          v-else-if="uploading"
          p-6 rounded-2 border border-dashed border-blue-500 transition leading-1em bg-opacity-30 bg-blue-500
        >
          <div h-8 flex items-center justify-center gap-3 pointer-events-none text-blue-500>
            <i
              i-ri-loader-2-line
              text-lg block animate-spin
            />
          </div>
        </div>
        <div
          v-else
          p-6 rounded-2 border border-dashed transition leading-1em bg-opacity-30
          :border-color="`${dragIn ? 'blue-500' : 'gray-500'}`"
          :bg="`${dragIn ? 'blue-500' : 'dark-300'}`"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div
            h-8 flex items-center justify-center gap-3 pointer-events-none
            :text="`${dragIn ? 'blue-500' : 'gray-500'}`"
          >
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
  </div>
</template>

<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { useToggle } from '@vueuse/core'

const [show, toggleShow] = useToggle(__DEV__)
const [dragIn, toggleDragIn] = useToggle(false)
const [uploaded, toggleUploaded] = useToggle(false)
const [uploading, toggleUploading] = useToggle(false)
const errorMessage = ref('')
let counter = 0

const blockStore = useBlockStore()
useEventListener('drag', (e) => {
  e.preventDefault()
  if (counter < 0)
    counter = 0
  toggleShow(true)
})
useEventListener('dragend', (e) => {
  e.preventDefault()
  if (counter === 0)
    toggleShow(false)
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
  if (counter === 0)
    toggleDragIn(false)
}

function handleDrop(e: DragEvent) {
  toggleDragIn(false)
  if (counter) {
    toggleUploading(true)
    const block: BlockModel = {
      content: e.dataTransfer?.getData('text') ?? '',
    }
    blockStore.save(block, 'VTJGc2RHVmtYMStHaXZGOG85OE1yOGs4Zm1FZWxscXNSVWtJbWpJTGJGNG91dEtxNWJobVp2Z1FTbm5NcUcwRW8zTlBkUWphWThYbkU3Nmo1UFJlenVQa2ovaFVhNUZ6cWFQU2xEWkR5YmtoTWd4aG11S0VCTm5RM0p6K2NXSG1RM2RucU5zekI4TE5xbHprRGRxLzlZZmt3a2FUczN6WXBGNzUvN0FZSyt6NnBPSTlqbXB4aGJ1Nm5vWjl6RW5h')
      .then(() => {
        toggleUploaded(true)
        toggleUploading(false)
        setTimeout(() => {
          toggleShow(false)
          toggleUploaded(false)
          counter = 0
        }, 2000)
      })
      .catch((error) => {
        errorMessage.value = error.message || error || '保存失败 请检查网络后重试'
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
    flex items-end font-sans select-none leading-1em
  >
    <div w-full p-3 rounded-2 bg-dark-500>
      <div>
        <!-- title -->
        <div text-center text-lg text-white font-bold mb-3>
          收集到 Firefly
        </div>
        <NButton type="primary">
          test
        </NButton>
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
          p-6 rounded-2 border border-dashed border-primary transition leading-1em bg-opacity-30 bg-primary
        >
          <div h-8 flex items-center justify-center gap-3 pointer-events-none>
            <i
              i-ri-loader-2-line
              text-lg block animate-spin
            />
          </div>
        </div>
        <div
          v-else
          p-6 rounded-2 border border-dashed transition leading-1em bg-opacity-30
          :border-color="`${dragIn ? 'primary' : 'gray-500'}`"
          :bg="`${dragIn ? 'primary' : 'dark-300'}`"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div
            h-8 flex items-center justify-center gap-3 pointer-events-none
            :text="`${dragIn ? 'primary' : 'gray-500'}`"
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

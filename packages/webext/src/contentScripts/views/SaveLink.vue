<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { useToggle } from '@vueuse/core'
import { MESSAGE_API } from '~/constants'
import { getPageMetadata } from '~/utils'
import type { MetaData } from '~/utils/getPageMetadata/types'

const [show, toggleShow] = useToggle(false)
const [uploaded, toggleUploaded] = useToggle(false)
const [uploading, toggleUploading] = useToggle(false)
const [editing, toggleEditing] = useToggle(false)
const errorMessage = ref('')
const metadata = ref<MetaData>()
const blockStore = useBlockStore()

async function handleBlockCreateLink() {
  toggleShow(true)
  const url = window.location.href
  const result = getPageMetadata({ url })
  metadata.value = result
  toggleEditing(true)
}
function handleUpload(e: DragEvent) {
  toggleEditing(false)
  toggleUploading(true)
  const url = window.location.href
  const block: BlockModel = {
    content: e.dataTransfer?.getData('text') ?? '',
    link: url,
    metadata: metadata.value,
  }
  blockStore.save(block, 'VTJGc2RHVmtYMS9nOW42TjA4S3VFVU1FbElUSTB3cTBPcCtnaEpYNzlPTVN4c2xrWmR1ZlhLdnk1OEdFVStDeU9iUm1oUHZrVUl0K1FJSC9ySXRyazhheE52dkZScHlZdGw4MTh3aVZ5bG5yaHhpME85bDRDdnV2VHEwbHErTXpvbndtUmhDVmFpZWdodncrL2Z5d0RxTm9TWlBrd2kyMGVzaWg0SVRCd1YzQWl5UnJOZktFRFNma2tqQTk0MWhD')
    .then(() => {
      toggleUploaded(true)
      toggleUploading(false)
      setTimeout(() => {
        toggleShow(false)
        toggleUploaded(false)
        errorMessage.value = ''
        metadata.value = undefined
      }, 2000)
    })
    .catch((error) => {
      errorMessage.value = error.message || error || '保存失败 请检查网络后重试'
      toggleUploaded(true)
      toggleUploading(false)
      setTimeout(() => {
        toggleShow(false)
        toggleUploaded(false)
        errorMessage.value = ''
        metadata.value = undefined
      }, 8000)
    })
}
function handleClose() {
  toggleShow(false)
  toggleUploaded(false)
  toggleUploading(false)
  toggleEditing(false)
  errorMessage.value = ''
  metadata.value = undefined
}

onBeforeMount(() => {
  browser.runtime.onMessage.addListener((request: Record<string, any>) => {
    const { from, api } = request
    if (from === 'webext') {
      switch (api) {
        case MESSAGE_API.MESSAGE_CREATE_LINK:
          handleBlockCreateLink()
          break
      }
    }
  })
})
</script>

<template>
  <div
    v-if="show"
    fixed left-0 top-0 m-5 z-1000 flex items-end font-sans select-none leading-1em
  >
    <div w-72 p-3 rounded-2 bg-dark-500>
      <div>
        <!-- title -->
        <div text-center text-lg text-white font-bold mb-3>
          收集到 Firefly
        </div>
        <!-- status/edit -->
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
          <div h-8 flex items-center justify-center gap-3 pointer-events-none bg-primary>
            <i
              i-ri-loader-2-line
              text-lg block animate-spin
            />
          </div>
        </div>
        <div
          v-else-if="editing"
          p-2
        >
          <div flex flex-col gap-3>
            <div v-if="metadata?.title">
              <textarea
                v-model="metadata.title"
                w-full h-16 max-h-16
                leading-normal resize-none bg-transparent text-gray-300 border-none outline-none text-lg
              />
            </div>
            <div v-if="metadata?.description">
              <textarea
                v-model="metadata.description"
                w-full h-26 max-h-26 leading-tight resize-none bg-transparent text-gray-500 border-none outline-none
              />
            </div>
            <div v-if="metadata?.image">
              <img
                w-24
                :src="metadata?.image"
              >
            </div>
          </div>
          <!-- action -->
          <div flex items-center justify-between gap-3 mt-3>
            <button
              w-10 h-10
              @click="handleClose"
            >
              <i i-ri-delete-bin-line />
            </button>
            <button
              w-full h-10 bg-primary text-white rounded-full
              @click="handleUpload"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

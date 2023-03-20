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
function handleUpload() {
  toggleEditing(false)
  toggleUploading(true)
  const url = window.location.href
  const block: BlockModel = {
    content: '',
    link: url,
    metadata: metadata.value,
  }
  blockStore.save(block, 'VTJGc2RHVmtYMStHaXZGOG85OE1yOGs4Zm1FZWxscXNSVWtJbWpJTGJGNG91dEtxNWJobVp2Z1FTbm5NcUcwRW8zTlBkUWphWThYbkU3Nmo1UFJlenVQa2ovaFVhNUZ6cWFQU2xEWkR5YmtoTWd4aG11S0VCTm5RM0p6K2NXSG1RM2RucU5zekI4TE5xbHprRGRxLzlZZmt3a2FUczN6WXBGNzUvN0FZSyt6NnBPSTlqbXB4aGJ1Nm5vWjl6RW5h')
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
      console.error(error)
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
    class="flex font-sans m-5 top-0 left-0 leading-1em z-[2147483647] fixed items-end select-none"
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
          <div h-8 flex items-center justify-center gap-3 pointer-events-none text-primary>
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
              <i i-ri-delete-bin-line text-neutral />
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

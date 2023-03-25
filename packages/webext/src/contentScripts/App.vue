<script setup lang="ts">
import Assistant from '@firefly/assistant'
import type { BlockModel } from '@firefly/common'
import { clearContent } from '@firefly/common'
import { MESSAGE_API } from '~/constants'
import { getPageMetadata } from '~/utils'

const { t } = useI18n()

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseFunctionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const [show, toggleShow] = useToggle(false)
const [dragIn, toggleDragIn] = useToggle(false)
let counter = 0
// 'VTJGc2RHVmtYMStHaXZGOG85OE1yOGs4Zm1FZWxscXNSVWtJbWpJTGJGNG91dEtxNWJobVp2Z1FTbm5NcUcwRW8zTlBkUWphWThYbkU3Nmo1UFJlenVQa2ovaFVhNUZ6cWFQU2xEWkR5YmtoTWd4aG11S0VCTm5RM0p6K2NXSG1RM2RucU5zekI4TE5xbHprRGRxLzlZZmt3a2FUczN6WXBGNzUvN0FZSyt6NnBPSTlqbXB4aGJ1Nm5vWjl6RW5h'
const token = useStorageLocal('token', '')
const block = ref<BlockModel | null>(null)

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
    const body: BlockModel = {
      content: clearContent(e.dataTransfer?.getData('text') ?? ''),
    }
    block.value = body
  }
}
function handleClose() {
  toggleShow(false)
  counter = 0
  block.value = null
}
async function handleBlockCreateLink() {
  toggleShow(true)
  const url = window.location.href
  const metadata = getPageMetadata({ url })
  block.value = {
    content: '',
    metadata,
  }
}
function handleBeforeMount() {
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
}
</script>

<template>
  <CustomProvider>
    <Assistant
      v-if="show"
      v-model:token="token"
      v-model:block="block"
      class="w-72 m-5 top-0 left-0 z-[2147483647] fixed shadow-xl rounded-sm bg-neutral-800 bg-opacity-80 backdrop-blur-lg"
      :on-vnode-before-mount="handleBeforeMount"
      :supabase-url="supabaseUrl"
      :supabase-functions-url="supabaseFunctionsUrl"
      :supabase-anon-key="supabaseAnonKey"
      :on-close="handleClose"
    >
      <template #empty>
        <!-- title -->
        <div text-center text-lg text-white font-semibold mb-3>
          {{ t('assistant.title') }}
        </div>
        <div
          p-6 rounded-sm border border-dashed transition leading-1em bg-opacity-30
          :border-color="`${dragIn ? 'primary' : 'neutral-300'}`"
          :bg="`${dragIn ? 'primary' : 'dark-300'}`"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div
            h-8 flex items-center justify-center gap-3 pointer-events-none
            :text="`${dragIn ? 'primary' : 'neutral-300'}`"
          >
            <i
              v-show="!dragIn"
              i-ri-upload-cloud-2-line
              text-lg block
            />
            {{ dragIn ? t('assistant.dropTip') : t('assistant.dragTip') }}
          </div>
        </div>
      </template>
    </Assistant>
  </CustomProvider>
</template>

<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { clearContent } from '@firefly/common'
import Editor from '@firefly/editor'
import { useToggle } from '@vueuse/core'
import { MESSAGE_API } from '~/constants'
import { getPageMetadata } from '~/utils'

const [show, toggleShow] = useToggle(false)
const [dragIn, toggleDragIn] = useToggle(false)
const [loading, toggleLoading] = useToggle(false)
const block = ref<BlockModel | null>(null)
let counter = 0

const TOKEN = 'VTJGc2RHVmtYMStHaXZGOG85OE1yOGs4Zm1FZWxscXNSVWtJbWpJTGJGNG91dEtxNWJobVp2Z1FTbm5NcUcwRW8zTlBkUWphWThYbkU3Nmo1UFJlenVQa2ovaFVhNUZ6cWFQU2xEWkR5YmtoTWd4aG11S0VCTm5RM0p6K2NXSG1RM2RucU5zekI4TE5xbHprRGRxLzlZZmt3a2FUczN6WXBGNzUvN0FZSyt6NnBPSTlqbXB4aGJ1Nm5vWjl6RW5h'

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
async function handleUpdate() {
  try {
    toggleLoading(true)
    if (block.value) {
      block.value.content = clearContent(block.value.content)
      await blockStore.save(block.value, TOKEN)
      handleClose()
    }
  }
  finally {
    toggleLoading(false)
  }
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
    class="flex font-sans m-5 top-0 left-0 leading-1em z-[2147483646] pointer-events-initial fixed items-end select-none"
  >
    <div w-72 p-3 rounded-2 bg-neutral-800 bg-opacity-60 backdrop-blur-lg shadow-lg>
      <!-- title -->
      <div text-center text-lg text-white font-semibold mb-3>
        收集到 Firefly
      </div>
      <div v-if="block">
        <!-- content -->
        <Editor
          class="prose prose-white min-h-24"
          :tags="[{ id: 2, name: '哈哈哈' }, { id: 2, name: 'asd' }]"
          :value="block.content"
          :on-change="value => block!.content = value"
          :bubble-menu="false"
        />
        <!-- metadata -->
        <div
          v-if="block?.metadata"
          flex flex-col gap-3
        >
          <div v-if="block?.metadata?.title">
            <textarea
              v-model="block.metadata.title"
              w-full h-8 max-h-16 text-white
              leading-normal resize-none bg-transparent border-none outline-none text-lg
            />
          </div>
          <div v-if="block?.metadata?.description">
            <textarea
              v-model="block.metadata.description"
              w-full h-20 max-h-26 text-neutral leading-tight resize-none bg-transparent border-none outline-none
            />
          </div>
          <div v-if="block?.metadata?.image">
            <img
              w-24
              :src="block.metadata.image"
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
            @click="handleUpdate"
          >
            <i
              v-if="loading"
              i-ri-loader-2-line
              text-lg inline-block animate-spin
            />
            <span v-else>保存</span>
          </button>
        </div>
      </div>
      <div
        v-else
        p-6 rounded-2 border border-dashed transition leading-1em bg-opacity-30
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
          {{ dragIn ? '松开以完成收藏' : '拖放到这里' }}
        </div>
      </div>
    </div>
  </div>
</template>

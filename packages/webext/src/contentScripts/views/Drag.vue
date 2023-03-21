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
const [copilotLoading, toggleCopilotLoading] = useToggle(false)
const block = ref<BlockModel | null>(null)
let counter = 0

// 'VTJGc2RHVmtYMStHaXZGOG85OE1yOGs4Zm1FZWxscXNSVWtJbWpJTGJGNG91dEtxNWJobVp2Z1FTbm5NcUcwRW8zTlBkUWphWThYbkU3Nmo1UFJlenVQa2ovaFVhNUZ6cWFQU2xEWkR5YmtoTWd4aG11S0VCTm5RM0p6K2NXSG1RM2RucU5zekI4TE5xbHprRGRxLzlZZmt3a2FUczN6WXBGNzUvN0FZSyt6NnBPSTlqbXB4aGJ1Nm5vWjl6RW5h'
const token = useStorageLocal('token', '')
const tokenInput = ref('')

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
async function handleCopilot() {
  if (!block.value?.content)
    return
  toggleCopilotLoading(true)
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      type: 'extractionTags',
      language: 'zh-Hans',
      text: block.value?.content,
    }),
  })
  const data = response.body
  if (!data)
    return

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false
  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    if (block.value)
      block.value.content += chunkValue
  }
  toggleCopilotLoading(false)
}
async function handleUpdate() {
  try {
    toggleLoading(true)
    if (block.value) {
      block.value.content = clearContent(block.value.content)
      await blockStore.save(block.value, token.value)
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
    <div w-72 p-3 rounded-2 bg-neutral-800 bg-opacity-80 backdrop-blur-lg shadow-xl>
      <div v-if="block">
        <div v-if="token">
          <!-- title -->
          <div text-center text-lg text-white font-semibold mb-3>
            收集到 Firefly
          </div>
          <!-- content -->
          <Editor
            v-model="block.content"
            class="prose prose-white min-h-24"
            :tags="[{ id: 2, name: '哈哈哈' }, { id: 2, name: 'asd' }]"
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
            <div flex items-center>
              <button
                w-10 h-10
                @click="handleClose"
              >
                <i i-ri-delete-bin-line text-neutral />
              </button>
              <button
                w-10 h-10
                :disabled="copilotLoading"
                @click="handleCopilot"
              >
                <i
                  v-if="copilotLoading"
                  i-ri-loader-2-line
                  text-lg inline-block animate-spin text-primary
                />
                <i
                  v-else
                  i-tabler-brain text-primary
                />
              </button>
            </div>
            <button
              w-full h-10 bg-primary text-white rounded-full
              :disabled="loading"
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
        <div v-else>
          <div text-center text-lg text-white font-semibold mb-3>
            请先输入 Token
          </div>
          <div flex flex-col gap-3>
            <input
              v-model="tokenInput"
              type="password"
              w-full h-10 pl-2 text-white leading-normal border-none outline-none text-lg
            >
          </div>
          <div flex items-center justify-center mt-3>
            <button
              w-full h-10 bg-primary text-white rounded-full
              @click="token = tokenInput"
            >
              保存
            </button>
          </div>
        </div>
      </div>
      <template v-else>
        <!-- title -->
        <div text-center text-lg text-white font-semibold mb-3>
          收集到 Firefly
        </div>
        <div
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
      </template>
    </div>
  </div>
</template>

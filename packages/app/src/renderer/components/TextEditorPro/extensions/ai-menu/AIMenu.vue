<script setup lang="ts">
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import type { InputInst, ScrollbarInst } from 'naive-ui'
import type { CommandItem } from './commands'
import { supabase } from '~renderer/api'

const props = defineProps<{
  command: (params: any) => void
}>()

const items = ref<CommandItem[]>([])
const selectedIndex = ref(0)
const buttonRefs = ref<Element[]>([])
const scrollBarRef = ref<ScrollbarInst>()

function setButtonRef(el: any) {
  if (el) buttonRefs.value.push(el)
}

function handleScrollToSelectItem() {
  const el = buttonRefs.value[selectedIndex.value]
  if (el) {
    scrollBarRef.value?.scrollTo({
      left: 0,
      // @ts-expect-error noop
      top: el.offsetTop - 48,
      behavior: 'smooth',
    })
  }
}

function onKeyDown({ event }: SuggestionKeyDownProps) {
  if (event.key === 'ArrowUp') {
    event.stopPropagation()
    event.preventDefault()
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    event.stopPropagation()
    event.preventDefault()
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    event.stopPropagation()
    event.preventDefault()
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + items.value.length) - 1) % items.value.length
  nextTick(() => {
    handleScrollToSelectItem()
  })
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % items.value.length
  nextTick(() => {
    handleScrollToSelectItem()
  })
}

function enterHandler() {
  handleSelectItem(selectedIndex.value)
}

function handleSelectItem(index: number) {
  const item = items.value[index]

  if (item) {
    setTimeout(() => props.command(item))
  }
}

defineExpose({ onKeyDown })

const question = ref('宇宙有多大')
const loading = ref(false)
const inputInstRef = ref<InputInst | null>(null)
onMounted(() => {
  inputInstRef.value?.select()
})
function handleKeyUp(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleGetCompletion()
  }
}

async function handleGetCompletion() {
  try {
    loading.value = true
    const { data } = await supabase.functions.invoke('completion', { body: { prompt: question.value } })
    if (data.choices) {
      items.value = (data.choices as any).map(v => ({
        title: v.text?.trim() ?? '',
        type: 'result',
        command: ({ editor }) => {
          editor?.chain().focus().insertContent(`<p>${v.text?.trim()}</p>`).run()
        },
      }))
    }
  }
  finally {
    loading.value = false
    inputInstRef.value?.select()
  }
}
</script>

<template>
  <div w-600px>
    <div shadow-lg mb-1>
      <NInput
        ref="inputInstRef"
        v-model:value="question"
        :disabled="loading"
        autofocus
        placeholder="随便问我点什么..."
        @keyup="handleKeyUp"
      >
        <template #prefix>
          <i i-ri-magic-fill />
        </template>
        <template #suffix>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton
                :disabled="!question"
                :loading="loading"
                quaternary
                size="tiny"
                circle
                @click="handleGetCompletion"
              >
                <template #icon>
                  <i i-ri-arrow-up-circle-fill />
                </template>
              </NButton>
            </template>
            问问AI ↵
          </NTooltip>
        </template>
      </NInput>
    </div>
    <div
      v-if="items.length"
      bg-dark-300 rounded p-2 shadow-lg
    >
      <NScrollbar ref="scrollBarRef" max-h-50>
        <template v-if="items.length">
          <div
            v-for="(item, index) in items"
            :key="index"
            :ref="el => setButtonRef(el)"
            w-full p-1 rounded transition flex items-center gap-2 cursor-pointer
            :class="{ 'bg-neutral-600': index === selectedIndex }"
            @click="handleSelectItem(index)"
            @mouseenter="selectedIndex = index"
          >
            <div w-10 h-10 bg-white rounded flex items-center justify-center>
              <i :class="item.icon" text-black block />
            </div>
            <div flex flex-col text-left>
              <div truncate>
                {{ item.title }}
              </div>
              <div text-neutral text-xs truncate>
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>
        <div
          v-else
          p-1 rounded flex items-center gap-2
        >
          No result
        </div>
      </NScrollbar>
    </div>
  </div>
</template>

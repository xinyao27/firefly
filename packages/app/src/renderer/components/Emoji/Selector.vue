<script setup lang="ts">
import Fuse from 'fuse.js'
import View from './View.vue'
import metadata from '~renderer/emoji/metadata.json'

const props = defineProps<{
  name: string
  color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
  hoverable: boolean
}>()
const emit = defineEmits(['select'])

const show = ref(false)
const el = ref<HTMLElement>()
const group = [
  'Smileys & Emotion',
  'People & Body',
  'Animals & Nature',
  'Food & Drink',
  'Symbols',
  'Travel & Places',
  'Objects',
  'Activities',
  'Flags',
]
const currentGroupIndex = ref(0)
const categories = ref<Record<string, string[]>>({ 'Smileys & Emotion': metadata.categories['Smileys & Emotion'] })
const recentlyUsed = useStorage<string[]>('recentlyUsedEmoji', [])
watchEffect(() => {
  if (recentlyUsed.value.length) {
    categories.value = {
      最近使用: recentlyUsed.value,
      ...categories.value,
    }
  }
})
useInfiniteScroll(
  el,
  () => {
    currentGroupIndex.value = currentGroupIndex.value + 1
    const key = group[currentGroupIndex.value]
    categories.value[key] = (metadata.categories as Record<string, string[]>)[key]
  },
  { distance: 100 },
)

const fuse = new Fuse(metadata.metadata, { keys: ['keywords'] })
const searchResult = ref<Fuse.FuseResult<(typeof metadata.metadata)[0]>[] | null>(null)
const handleSearch = useDebounceFn((e) => {
  setTimeout(() => {
    const result = fuse.search(e)
    searchResult.value = result
  })
}, 500)

const currentColor = ref(props.color)
const showColorSelector = ref(false)

function handleSelect(name: string) {
  emit('select', name)
  show.value = false
  if (recentlyUsed.value.includes(name)) {
    recentlyUsed.value = [name, ...recentlyUsed.value.filter(v => v !== name)]
  }
  else {
    recentlyUsed.value.unshift(name)
    if (recentlyUsed.value.length >= 6) {
      recentlyUsed.value.pop()
    }
  }
}
</script>

<template>
  <NPopover
    :show="show"
    :show-arrow="false"
    trigger="manual"
    placement="bottom-start"
    raw
    @clickoutside="show = false"
  >
    <template #trigger>
      <View
        :name="props.name"
        :color="props.color"
        :hoverable="props.hoverable"
        @click="show = !show"
      />
    </template>
    <div bg-neutral-700 rounded-2 shadow>
      <!-- search -->
      <div flex gap-2 p-2>
        <NInput
          size="small"
          placeholder="搜索 emoji ..."
          @input="handleSearch"
        >
          <template #prefix>
            <i i-ri-search-line />
          </template>
        </NInput>
        <NPopover
          :show="showColorSelector"
          :show-arrow="false"
          trigger="click"
          placement="bottom"
          raw
        >
          <template #trigger>
            <View
              name="hand-with-fingers-splayed"
              :color="currentColor"
              tooltip="选择肤色"
              @click="showColorSelector = !showColorSelector"
            />
          </template>
          <div bg-neutral-700 rounded-2 shadow flex gap-1 p-1>
            <View
              name="hand-with-fingers-splayed"
              color="dark"
              tooltip="dark"
              @click="currentColor = 'dark'; showColorSelector = false"
            />
            <View
              name="hand-with-fingers-splayed"
              color="default"
              tooltip="default"
              @click="currentColor = 'default'; showColorSelector = false"
            />
            <View
              name="hand-with-fingers-splayed"
              color="light"
              tooltip="light"
              @click="currentColor = 'light'; showColorSelector = false"
            />
            <View
              name="hand-with-fingers-splayed"
              color="medium"
              tooltip="medium"
              @click="currentColor = 'medium'; showColorSelector = false"
            />
            <View
              name="hand-with-fingers-splayed"
              color="medium-dark"
              tooltip="medium-dark"
              @click="currentColor = 'medium-dark'; showColorSelector = false"
            />
            <View
              name="hand-with-fingers-splayed"
              color="medium-light"
              tooltip="medium-light"
              @click="currentColor = 'medium-light'; showColorSelector = false"
            />
          </div>
        </NPopover>
      </div>
      <!-- list -->
      <div
        ref="el"
        w-100 h-62 overflow-x-hidden overflow-y-auto flex flex-col gap-4 px-2
      >
        <NGrid
          v-show="searchResult"
          :x-gap="6"
          :y-gap="6"
          :cols="12"
        >
          <NGridItem
            v-for="{ item } in searchResult"
            :key="item.name"
          >
            <View
              :name="item.name"
              :color="currentColor"
              :hoverable="props.hoverable"
              @click="handleSelect(item.name)"
            />
          </NGridItem>
        </NGrid>
        <div
          v-for="(names, category) in categories"
          v-show="!searchResult"
          :key="category"
        >
          <div text-neutral font-semibold px-2 mb-2>
            {{ category }}
          </div>

          <NGrid
            :x-gap="6"
            :y-gap="6"
            :cols="12"
          >
            <NGridItem
              v-for="name in names"
              :key="name"
            >
              <View
                :name="name"
                :color="currentColor"
                :hoverable="props.hoverable"
                @click="handleSelect(name)"
              />
            </NGridItem>
          </NGrid>
        </div>
      </div>
    </div>
  </NPopover>
</template>

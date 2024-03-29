<script setup lang="ts">
import dayjs from 'dayjs'
import type { DropdownOption } from 'naive-ui'
import { useRouteQuery } from '@vueuse/router'
import Mark from 'mark.js'
import type { BlockModel } from '@firefly/common'

const props = withDefaults(
  defineProps<{
    data: BlockModel
    showOptions?: boolean
  }>(),
  {
    showOptions: true,
  },
)

const { t } = useI18n()
const dialog = useDialog()
const assistantStore = useAssistantStore()
const assistantLinkStore = useAssistantLinkStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()
const copilotStore = useCopilotStore()
const router = useRouter()
const query = useRouteQuery('query')
const el = ref<HTMLDivElement>()
const expanded = ref(false)

const options: DropdownOption[] = [
  {
    label: t('common.edit'),
    key: 'edit',
    onClick() {
      if (props.data.category === 'text')
        assistantStore.open('update', props.data)
      else if (props.data.category === 'link')
        assistantLinkStore.open('update', props.data)
    },
  },
  {
    label: () => h('span', { class: 'text-red' }, t('common.delete')),
    key: 'delete',
    onClick() {
      if (props.data.id) {
        dialog.warning({
          title: t('common.warningTitle'),
          content: t('common.warningContent'),
          positiveText: t('common.confirm'),
          negativeText: t('common.cancel'),
          onPositiveClick: () => {
            blockStore.delete(props.data.id!)
          },
        })
      }
    },
  },
]
function handleSelect(_: string, option: DropdownOption) {
  (option.onClick as () => void)?.()
}
function handleCopilot() {
  if (el.value) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el.value)
    selection?.removeAllRanges()
    selection?.addRange(range)

    copilotStore.open(selection?.toString() || '')
  }
}
function handleTagClick(tag: string) {
  router.push({
    name: 'inbox',
    query: {
      tag,
    },
  })
}
const renderContent = computed(() => {
  if (query.value) {
    const instance = new Mark(el.value!)
    instance.unmark({ element: 'span', className: 'highlightText' })
    instance.mark(query.value, { element: 'span', className: 'highlightText' })
  }
  return props.data.content
})
</script>

<template>
  <NCard
    class="bg-(slate opacity-3) hover:bg-(slate opacity-6)"
    size="small"
    hoverable
    :bordered="false"
    :title="dayjs(props.data.updatedAt).format('YYYY-MM-DD HH:mm:ss')"
  >
    <template #header-extra>
      <div>
        <NTooltip v-if="props.data.category === 'text'">
          <template #trigger>
            <NButton
              quaternary
              size="tiny"
              @click="handleCopilot"
            >
              <i i-ri-sparkling-2-fill />
            </NButton>
          </template>
          {{ t('copilot.ref') }}
        </NTooltip>
        <NDropdown
          v-if="props.showOptions"
          size="small"
          trigger="hover"
          :options="options"
          @select="handleSelect"
        >
          <NButton
            quaternary
            size="tiny"
          >
            <i i-ri-more-line />
          </NButton>
        </NDropdown>
      </div>
    </template>
    <div
      v-if="props.data.category === 'link'"
      flex
    >
      <div flex flex-1 flex-col gap-2>
        <div
          v-if="props.data.metadata?.['og:title'] || props.data.metadata?.['twitter:title']"
          truncate text-lg font-bold
        >
          {{ props.data.metadata?.['og:title'] || props.data.metadata?.['twitter:title'] }}
        </div>
        <div
          v-if="props.data.metadata?.['og:description'] || props.data.metadata?.['twitter:description'] || props.data.metadata?.description"
          line-clamp-3 flex-1 text-sm text-gray-400
        >
          {{ props.data.metadata?.['og:description'] || props.data.metadata?.['twitter:description'] || props.data.metadata?.description }}
        </div>
        <NuxtLink
          :to="props.data.link"
          target="_blank"
          rel="noopener"
          line-clamp-2
        >
          {{ props.data.content }}
        </NuxtLink>
      </div>
      <div
        v-if="props.data.metadata?.['og:image'] || props.data.metadata?.['twitter:image:src']"
      >
        <NImage
          width="100"
          :src="(props.data.metadata?.['og:image'] || props.data.metadata?.['twitter:image:src']) as string"
          :alt="(props.data.metadata?.['og:image:alt'] || props.data.metadata?.['og:description'] || props.data.metadata?.description) as string"
        />
      </div>
    </div>
    <div
      v-else
      :cursor="expanded ? 'text' : 'pointer'"
      :class="expanded ? '' : 'line-clamp-10'"
      @click="expanded === false && (expanded = true)"
    >
      <div
        ref="el"
        class="ProseMirror max-w-full prose prose-white"
        v-html="renderContent"
      />
    </div>

    <div
      v-if="props.data.images?.length"
      pt-2
    >
      <NImageGroup>
        <NSpace>
          <NImage
            v-for="image in props.data.images"
            :key="image"
            width="100"
            :src="image"
          />
        </NSpace>
      </NImageGroup>
    </div>

    <div
      v-if="props.data.tags?.length"
      flex flex-wrap gap-2 pt-2
    >
      <NTag
        v-for="tag in props.data.tags"
        :key="tag"
        class="cursor-pointer hover:bg-(slate opacity-30)"
        :bordered="false"
        size="small"
        @click="handleTagClick(tag)"
      >
        <template #avatar>
          <Bubble
            :color="tagStore.findOne(tag)?.color"
          />
        </template>
        {{ tag }}
      </NTag>
    </div>
  </NCard>
</template>

<style lang="sass">
.highlightText
  @apply relative
  &::before
    @apply absolute content-[""] z--1 w-[calc(100%+4px)] h-60% left-[-2px] bottom-0 bg-primary
</style>

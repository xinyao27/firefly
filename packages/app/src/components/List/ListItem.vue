<script setup lang="ts">
import dayjs from 'dayjs'
import type { DropdownOption } from 'naive-ui'
import { useDialog } from 'naive-ui'
import type { BlockModel } from '@firefly/common'

const props = defineProps<{
  data: BlockModel
}>()

const { t } = useI18n()
const dialog = useDialog()
const assistantStore = useAssistantStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()
const copilotStore = useCopilotStore()
const router = useRouter()
const el = ref<HTMLDivElement>()
const expanded = ref(false)

const options: DropdownOption[] = [
  {
    label: t('common.edit'),
    key: 'edit',
    onClick() {
      assistantStore.open('update', props.data)
    },
  },
  {
    label: t('common.delete'),
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
        <NTooltip>
          <template #trigger>
            <NButton
              quaternary
              size="tiny"
              @click="handleCopilot"
            >
              <i i-ri-openai-line />
            </NButton>
          </template>
          {{ t('copilot.ref') }}
        </NTooltip>
        <NDropdown
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
      cursor-pointer
      :class="expanded ? '' : 'line-clamp-10'"
      @click="expanded === false && (expanded = true)"
    >
      <div
        ref="el"
        class="ProseMirror prose prose-white max-w-full"
        v-html="props.data.content"
      />
    </div>

    <div
      v-if="props.data.tags"
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

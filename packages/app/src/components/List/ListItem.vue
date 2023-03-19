<script setup lang="ts">
import dayjs from 'dayjs'
import type { DropdownOption } from 'naive-ui'
import type { BlockModel } from '@firefly/common'

const props = defineProps<{
  data: BlockModel
}>()

const textEditorStore = useTextEditorStore()
const blockStore = useBlockStore()
const configStore = useConfigStore()
const copilotStore = useCopilotStore()
const router = useRouter()
const el = ref<HTMLDivElement>()

const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit',
    onClick() {
      textEditorStore.open('update', props.data)
    },
  },
  {
    label: '删除',
    key: 'delete',
    onClick() {
      if (props.data.id)
        blockStore.delete(props.data.id)
    },
  },
]
function handleSelect(_: string, option: DropdownOption) {
  (option.onClick as () => void)?.()
}
function handleCopilot() {
  // 目前就是选择当前 block 的内容
  if (el.value) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el.value)
    selection?.removeAllRanges()
    selection?.addRange(range)

    if (configStore.isMobileScreen)
      copilotStore.open(selection?.toString() || '')
  }
}

const parsedContent = computed(() => {
  const content = props.data.content
  if (!content)
    return ''

  const result = content.replace(/#\S+/g, '<span class="tag">$&</span>')
  return result
})

onMounted(() => {
  const tags = el.value?.querySelectorAll('.tag')
  tags?.forEach((tag) => {
    tag.addEventListener('click', () => {
      if (tag.textContent?.length && tag.textContent.length > 1) {
        router.push({
          name: 'index',
          query: {
            tag: tag.textContent?.slice(1),
          },
        })
      }
    })
  })
})
</script>

<template>
  <NCard
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
              <i i-tabler-brain />
            </NButton>
          </template>
          AI 分析
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
      ref="el"
      class="ProseMirror prose prose-black"
      v-html="parsedContent"
    />
  </NCard>
</template>

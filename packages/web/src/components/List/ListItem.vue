<script setup lang="ts">
import dayjs from 'dayjs'
import type { DropdownOption } from 'naive-ui'
import type { BlockModel } from '~/models/Block'

const props = defineProps<{
  data: BlockModel
}>()

const copilotStore = useCopilotStore()
const blockStore = useBlockStore()

const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit',
    onClick() {
      copilotStore.open('update', props.data)
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

const parsedContent = computed(() => {
  const content = props.data.content
  if (!content)
    return ''

  const result = content.replace(/#\S+/g, '<span class="tag">$&</span>')
  return result
})
const el = ref<HTMLDivElement>()
const router = useRouter()
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
    :title="dayjs(props.data.updatedAt).format('YYYY-MM-DD HH:mm:ss')"
  >
    <template #header-extra>
      <NDropdown
        size="small"
        trigger="hover"
        :options="options"
        @select="handleSelect"
      >
        <NButton
          quaternary
          size="small"
        >
          <i i-ri-more-line />
        </NButton>
      </NDropdown>
    </template>
    <div
      ref="el"
      class="ProseMirror prose prose-black"
      v-html="parsedContent"
    />
  </NCard>
</template>

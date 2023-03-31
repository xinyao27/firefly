<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import type { TagModel } from '@firefly/common'

const { t } = useI18n()
const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()

function toTree(data: TagModel[]) {
  const tree: TreeOption[] = []
  data.forEach((item) => {
    const arr = item.name.split('/')
    let parent = ''
    let children = tree
    let obj: TreeOption = {}
    arr.forEach((v) => {
      const key = parent + v
      let has = false
      for (let j = 0; j < children.length; j++) {
        if (children[j].label === v) {
          obj = children[j]
          has = true
        }
      }
      if (!has) {
        obj = {
          label: v,
          key,
          prefix: () => item.icon ?? '#',
        }
        children.push(obj)
      }
      parent = `${key}/`
      children = obj.children || (obj.children = [])
    })
  })
  cleanData(tree)
  return tree
}
function cleanData(data: TreeOption[]) {
  data?.forEach((item) => {
    if (item.children?.length === 0)
      delete item.children
    else
      cleanData(item.children!)
  })
  return data
}
const data = computed<TreeOption[]>(() => toTree(tagStore.tags))

function renderPrefix({ option }: { option: TreeOption }) {
  return h(
    NButton,
    { text: true },
    { default: option.prefix },
  )
}
const router = useRouter()
function handleSelect([key]: string[]) {
  router.push({
    name: 'index',
    query: {
      tag: key,
    },
  })
}
</script>

<template>
  <aside h-full flex flex-col gap-4>
    <User />

    <section flex-1>
      <NTree
        :data="data"
        block-line
        selectable
        :render-prefix="renderPrefix"
        @update-selected-keys="handleSelect"
      />
    </section>
    <section>
      <NButton
        block
        secondary
        type="primary"
        @click="textEditorStore.open('create')"
      >
        <template #icon>
          <i i-ri-add-line />
        </template>
        <span>{{ t('block.create') }}</span>
      </NButton>
      <NModal
        v-model:show="textEditorStore.show"
        transform-origin="center"
      >
        <TextEditor />
      </NModal>
    </section>
  </aside>
</template>

<style lang="sass">
.n-card > .n-card__footer
  @apply border-t border-(slate opacity-15) p-3
</style>

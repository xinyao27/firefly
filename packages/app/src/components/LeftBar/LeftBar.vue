<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import type { TagModel } from '~/models/Tag'

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
  </aside>
</template>

<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'

const tagStore = useTagStore()

const data = computed<TreeOption[]>(() => {
  const firstIndex = tagStore.tags.reduce<TreeOption[]>((tags, tag) => {
    const isLeaf = tag.name.includes('/')
    if (!isLeaf) {
      return [
        ...tags,
        {
          label: tag.name,
          key: tag.name,
          prefix: () => tag.icon ?? '#',
        },
      ]
    }
    return tags
  }, [])
  return firstIndex.map((firstTag) => {
    const secondIndex = tagStore.tags.reduce<TreeOption[]>((tags, tag) => {
      const isLeaf = tag.name.includes('/')
      if (isLeaf) {
        const [first, second] = tag.name.split('/')
        if (first === firstTag.label) {
          return [
            ...tags,
            {
              label: second,
              key: tag.name,
              prefix: () => tag.icon ?? '#',
            },
          ]
        }
      }
      return tags
    }, [])
    if (secondIndex.length === 0)
      return firstTag
    return {
      ...firstTag,
      children: secondIndex,
    }
  })
})
function renderPrefix({ option }: { option: TreeOption }) {
  return h(
    NButton,
    { text: true },
    { default: option.prefix },
  )
}
</script>

<template>
  <aside h-full flex flex-col justify-between>
    <section flex-1 p-4>
      <NTree
        block-line
        :data="data"
        expand-on-click
        selectable
        :render-prefix="renderPrefix"
      />
    </section>

    <section />
  </aside>
</template>

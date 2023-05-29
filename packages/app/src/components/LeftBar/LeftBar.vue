<script setup lang="ts">
import type { TagWithChildren, colors } from '@firefly/common'
import type { TreeOption } from 'naive-ui'
import { NCollapseItem, NDropdown } from 'naive-ui'
import { useRouteQuery } from '@vueuse/router'
import menuOptions from './menuOptions'
import BubbleSelector from '~/components/Bubble/BubbleSelector.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const dialog = useDialog()
const tagStore = useTagStore()

function renderTag(tag: TagWithChildren) {
  const option: TreeOption = {
    id: tag.id,
    key: tag.originalName || tag.name,
    label: tag.name,
    suffix: () => tag.id
      ? h(BubbleSelector, {
        color: tag.color,
        onSelect(color: keyof typeof colors) {
          const t = tagStore.findOne(tag.originalName || tag.name)
          if (t) {
            tagStore.update({
              ...t,
              color,
            })
          }
        },
      })
      : null,
  }
  if (tag.children && tag.children.length)
    option.children = tag.children.map(v => renderTag(v))

  return option
}
const tags = computed<TreeOption[]>(() => {
  return tagStore.tags.map(v => renderTag(v))
})
const _query = useRouteQuery('query')
function handleTagSelect([key]: string[]) {
  router.push({
    name: 'inbox',
    query: {
      tag: key,
      query: _query.value,
    },
  })
}

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const dropdownOptions = [
  {
    label: t('tag.delete'),
    key: 'delete',
  },
]
const currentSelectOption = ref<TreeOption>()
function getAllChildren(option: TreeOption): TreeOption[] {
  const result: TreeOption[] = []
  if (option.children) {
    result.push(...option.children)
    option.children.forEach((v) => {
      result.push(...getAllChildren(v))
    })
  }
  return result
}
function handleSelect(key: string) {
  if (key === 'delete') {
    dialog.warning({
      title: t('common.warningTitle'),
      content: t('common.warningContent'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        if (!currentSelectOption.value)
          return
        const tags = [currentSelectOption.value, ...getAllChildren(currentSelectOption.value)]
        tagStore.delete(tags.filter(v => !!v.id).map(v => v.id as string))
      },
    })
  }
  showDropdown.value = false
}
function handleClickOutside() {
  showDropdown.value = false
}
function nodeProps({ option }: { option: TreeOption }) {
  return {
    onContextmenu(e: MouseEvent): void {
      currentSelectOption.value = option
      showDropdown.value = true
      x.value = e.clientX
      y.value = e.clientY
      e.preventDefault()
    },
  }
}
</script>

<template>
  <aside h-full flex flex-col gap-4 p-4>
    <User />

    <section>
      <NMenu
        :value="route.path"
        :options="menuOptions"
        :root-indent="0"
        :icon-size="14"
      />
    </section>

    <section
      v-if="route.path === '/inbox'"
      flex-1 overflow-x-hidden overflow-y-auto
    >
      <NCollapse
        :default-expanded-names="['tags']"
        display-directive="show"
      >
        <template #arrow>
          <i i-ri-arrow-right-s-line text-xs />
        </template>

        <NCollapseItem name="tags">
          <template #header>
            <div text-xs text-neutral>
              {{ t('common.yourTags') }}
            </div>
          </template>
          <NTree
            :data="tags"
            selectable
            block-line
            :keyboard="false"
            :node-props="nodeProps"
            @update-selected-keys="handleTagSelect"
          />
          <NDropdown
            trigger="manual"
            placement="bottom-start"
            :show="showDropdown"
            :options="dropdownOptions"
            :x="x"
            :y="y"
            @select="handleSelect"
            @clickoutside="handleClickOutside"
          />
        </NCollapseItem>
      </NCollapse>
    </section>
  </aside>
</template>

<style lang="sass">
.n-card > .n-card__footer
  @apply border-(t slate opacity-15) p-3
</style>

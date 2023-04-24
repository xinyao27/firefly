<script setup lang="ts">
import type { colors } from '@firefly/common'
import type { TreeOption } from 'naive-ui'
import { NButton, NCollapseItem, NDropdown } from 'naive-ui'
import menuOptions from './menuOptions'
import BubbleSelector from '~/components/Bubble/BubbleSelector.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const dialog = useDialog()
const tagStore = useTagStore()

const tags = computed<TreeOption[]>(() => tagStore.tags.map(v => ({
  key: v.name,
  label: v.name,
  prefix: () => h(BubbleSelector, {
    color: v.color,
    onSelect(color: keyof typeof colors) {
      const tag = tagStore.findOne(v.name)
      if (tag) {
        tagStore.update({
          ...tag,
          color,
        })
      }
    },
  }),
  suffix: () => h(
    NDropdown,
    {
      size: 'small',
      trigger: 'click',
      options: [
        {
          label: t('tag.delete'),
          key: 'delete',
        },
      ],
      onSelect(key: string) {
        if (key === 'delete') {
          dialog.warning({
            title: t('common.warningTitle'),
            content: t('common.warningContent'),
            positiveText: t('common.confirm'),
            negativeText: t('common.cancel'),
            onPositiveClick: () => {
              tagStore.delete(v.id)
            },
          })
        }
      },
    },
    {
      default: () => h(
        NButton,
        {
          class: 'mr-2',
          size: 'tiny',
          quaternary: true,
          onClick: (e: MouseEvent) => e.stopPropagation(),
        },
        {
          default: () => h('i', {
            class: 'i-ri-more-line',
          }),
        }),
    }),
})))
function handleTagSelect([key]: string[]) {
  router.push({
    name: 'inbox',
    query: {
      tag: key,
    },
  })
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
            @update-selected-keys="handleTagSelect"
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

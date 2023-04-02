<script setup lang="ts">
import type { colors } from '@firefly/common'
import type { TreeOption } from 'naive-ui'
import { NButton, NDropdown, useDialog } from 'naive-ui'
import { BubbleSelector } from '~/components/Bubble'

const { t } = useI18n()
const dialog = useDialog()
const textEditorStore = useTextEditorStore()
const tagStore = useTagStore()

const data = computed<TreeOption[]>(() => tagStore.tags.map(v => ({
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
        :keyboard="false"
        @update-selected-keys="handleSelect"
      />
    </section>
    <section>
      <NButton
        class="capitalize"
        block
        secondary
        type="primary"
        @click="textEditorStore.open('create')"
      >
        <template #icon>
          <i i-ri-pencil-line />
        </template>
        {{ t('block.create') }}
      </NButton>
    </section>
  </aside>
</template>

<style lang="sass">
.n-card > .n-card__footer
  @apply border-t border-(slate opacity-15) p-3
</style>

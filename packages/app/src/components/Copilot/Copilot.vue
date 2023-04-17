<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { CopilotWithProfiles } from '~/store/copilotHub'

const props = defineProps<{
  data: CopilotWithProfiles
  enableEdit?: boolean
}>()

const { t } = useI18n()
const router = useRouter()
const dialog = useDialog()
const copilotHubStore = useCopilotHubStore()
const updateCopilotShow = ref(false)

const options: DropdownOption[] = [
  {
    label: t('common.update'),
    key: 'update',
    onClick() {
      if (props.data.id)
        updateCopilotShow.value = true
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
            copilotHubStore.delete(props.data.id!)
          },
        })
      }
    },
  },
]
function handleSelect(_: string, option: DropdownOption) {
  (option.onClick as () => void)?.()
}
function handleUpdated() {
  updateCopilotShow.value = false
  copilotHubStore.findMy()
}
</script>

<template>
  <NCard
    class="cursor-pointer"
    :title="props.data.name"
    hoverable
    @click="router.push(`/copilot-hub/${props.data.id}`)"
  >
    <template #header-extra>
      <div flex items-center gap-2>
        <div
          v-if="props.data.profiles"
          inline-flex items-center gap-2 text-xs
        >
          <NAvatar
            round
            size="small"
            :src="props.data.profiles?.avatarUrl"
          />
          {{ props.data.profiles?.fullName }}
        </div>
        <div
          v-if="props.enableEdit"
        >
          <NDropdown
            size="small"
            trigger="hover"
            :options="options"
            @select="handleSelect"
          >
            <NButton
              quaternary
              size="tiny"
              @click.stop
            >
              <i i-ri-more-line />
            </NButton>
          </NDropdown>
        </div>
      </div>
    </template>
    <div>{{ props.data.description }}</div>
    <div mt-2 flex items-center text-neutral>
      <i i-ri-fire-fill mr-1 text-xs />
      <span font-semibold text-xs leading-normal>{{ props.data.interactions }}</span>
    </div>
  </NCard>
  <CreateOrUpdateCopilot
    v-model:show="updateCopilotShow"
    :data="props.data"
    :on-finished="handleUpdated"
  />
</template>

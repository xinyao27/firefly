import type { SelectOption } from 'naive-ui'
import { NAvatar, NButton, NSelect, NText, NTooltip } from 'naive-ui'
import { useColorMode } from '@vueuse/core'
import type { RenderLabel } from 'naive-ui/es/_internal/select-menu/src/interface'
import type { VNodeChild } from 'vue'
import Copyable from '../Copyable.vue'

export function renderUserInfo() {
  const userStore = useUserStore()
  const { t } = useI18n()

  return (
    <div class="flex flex-col gap-2 px-4 py-2">
      <div class="text-xs font-medium text-neutral">
        {userStore.profiles?.email}
      </div>
      <div class="flex items-center">
        <NAvatar
          class="mr-4"
          round
          src={userStore.profiles?.avatarUrl}
        />
        <div>
          <NText depth={2}>{userStore.profiles?.fullName}</NText>
          {
            userStore.profiles?.token
              ? (
                <div class="flex items-center gap-1">
                  <Copyable
                    class="text-neutral"
                    type="text"
                    text={userStore.profiles?.token}
                  >
                    {userStore.profiles?.token}
                  </Copyable>
                  <NTooltip
                    v-slots={{
                      trigger: () => (
                        <NButton
                          size="small"
                          text
                          onClick={userStore.generateToken}
                          loading={userStore.loading}
                        >
                          <i class="i-ri-refresh-line text-neutral" />
                        </NButton>
                      ),
                    }}
                  >
                    {t('user.generateNewToken')}
                  </NTooltip>
                </div>
                )
              : (
                <NButton
                  size="tiny"
                  onClick={userStore.generateToken}
                  loading={userStore.loading}
                >
                  {t('user.generateToken')}
                </NButton>
                )
          }
        </div>
      </div>
    </div>
  )
}

export function renderCopilotQuota() {
  const userStore = useUserStore()
  const pricingStore = usePricingStore()
  const { t } = useI18n()

  return (
    <div class="flex items-center justify-between gap-4 px-4 py-2 dark:text-neutral">
      <div>
        {`${t('common.copilotQuota')}: `}
        <span class="text-yellow">{userStore.profiles?.copilotQuota ?? 0}</span>
      </div>
      <NButton
        type="warning"
        size="small"
        onClick={() => pricingStore.show = true}
      >
        {t('common.upgrade')}
      </NButton>
    </div>
  )
}

export function renderThemeSwitcher() {
  const options: Array<SelectOption & { icon: VNodeChild }> = [
    {
      label: 'System',
      value: 'auto',
      icon: <i class="i-ri-computer-line" />,
    },
    {
      label: 'Light',
      value: 'light',
      icon: <i class="i-ri-sun-line" />,
    },
    {
      label: 'Dark',
      value: 'dark',
      icon: <i class="i-ri-moon-line" />,
    },
  ]
  const renderLabel: RenderLabel = (option: SelectOption & { icon: VNodeChild }) => {
    return <div class="flex items-center gap-2">
      {option.icon}
      <span>{option.label}</span>
    </div>
  }
  const { store } = useColorMode()

  return (
    <div class="flex items-center justify-between gap-4 px-4 py-2">
      Theme:
      <NSelect
        options={options}
        renderLabel={renderLabel}
        value={store.value}
        onUpdateValue={value => store.value = value}
        size="small"
        class="w-28"
        to={document.body}
      />
    </div>
  )
}

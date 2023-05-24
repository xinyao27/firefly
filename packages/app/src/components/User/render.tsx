import { NAvatar, NButton, NText, NTooltip } from 'naive-ui'
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
    <div class="flex items-center gap-4 px-4 py-2 text-neutral">
      <div>
        {`${t('common.copilotQuota')}: `}
        <span class="text-yellow-200">{userStore.profiles?.copilotQuota ?? 0}</span>
      </div>
      <NButton
        secondary
        type="warning"
        size="small"
        onClick={() => pricingStore.show = true}
      >
        {t('common.upgrade')}
      </NButton>
    </div>
  )
}

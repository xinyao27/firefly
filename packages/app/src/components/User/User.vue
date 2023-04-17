<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { clearCache } from '@firefly/common'
import { renderUserInfo } from './render'
import { supabase } from '~/modules/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()

const options = computed<DropdownOption[]>(() => [
  {
    type: 'render',
    key: 'user',
    render: renderUserInfo,
  },
  {
    key: 'copilotQuota',
    label: `${t('common.copilotQuota')}: ${userStore.profiles?.copilotQuota ?? 0}`,
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: 'downloadDesktopApp',
    label: t('common.downloadDesktopApp'),
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: t('user.logout'),
  },
])
async function handleSelect(key: string) {
  if (key === 'logout') {
    await supabase.auth.signOut()
    await blockStore.clear()
    await tagStore.clear()
    clearCache()
    if (route.path !== '/')
      router.replace('/login')
  }
  else if (key === 'downloadDesktopApp') {
    router.push('/desktop')
  }
}
</script>

<template>
  <NDropdown
    v-if="userStore.profiles"
    :options="options"
    trigger="click"
    @select="handleSelect"
  >
    <section class="flex items-center gap-2 p-1 transition cursor-pointer hover:bg-(slate opacity-15)">
      <NAvatar
        size="small"
        :src="userStore.profiles.avatarUrl"
        fallback-src="https://firefly.best/icon.png"
      />
      <div flex items-center text-white>
        {{ userStore.profiles.fullName }}
        <i i-ri-arrow-down-double-line text-neutral />
      </div>
    </section>
  </NDropdown>
  <NButton
    v-else
    type="primary"
    @click="router.push('/login')"
  >
    {{ t('common.login') }}
  </NButton>
</template>

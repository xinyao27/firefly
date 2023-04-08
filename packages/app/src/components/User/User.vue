<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { NAvatar, NButton, NText, NTooltip } from 'naive-ui'
import { clearCache } from '@firefly/common'
import Copyable from '../Copyable.vue'
import { supabase } from '~/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()

function renderUserInfo() {
  return h(
    'div',
    { class: 'px-4 py-2 flex flex-col gap-2' },
    [
      h('div', {
        class: 'text-xs text-neutral font-medium',
      }, { default: () => userStore.profiles?.email }),
      h(
        'div',
        {
          class: 'flex items-center',
        },
        [
          h(NAvatar, {
            round: true,
            class: 'mr-4',
            src: userStore.profiles?.avatarUrl,
          }),
          h('div', null, [
            h('div', null, [h(NText, { depth: 2 }, { default: () => userStore.profiles?.fullName })]),
            userStore.profiles?.token
              ? h('div', { class: 'flex items-center gap-1' }, [
                h(Copyable, { type: 'text', text: userStore.profiles?.token, class: 'text-neutral' }, () => userStore.profiles?.token),
                h(NTooltip, null, {
                  trigger: () => h(NButton, { size: 'small', text: true, onClick: userStore.generateToken, loading: userStore.loading }, () => h('i', { class: 'i-ri-refresh-line text-neutral' })),
                  default: () => t('user.generateNewToken'),
                }),
              ])
              : h(NButton, { size: 'tiny', onClick: userStore.generateToken, loading: userStore.loading }, () => t('user.generateToken')),
          ]),
        ],
      ),
    ],
  )
}
const options: DropdownOption[] = [
  {
    type: 'render',
    key: 'user',
    render: renderUserInfo,
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
]
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
    router.push('/download')
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

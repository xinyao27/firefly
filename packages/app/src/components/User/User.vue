<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { NAvatar, NButton, NText, NTooltip } from 'naive-ui'
import Copyable from '../Copyable.vue'
import { supabase } from '~/api'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()

onMounted(() => {
  userStore.getUserProfiles()
})

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
                h(Copyable, { type: 'text', text: userStore.profiles?.token }, () => userStore.profiles?.token),
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
    key: 'logout',
    label: t('user.logout'),
  },
]
async function handleSelect(key: string) {
  switch (key) {
    case 'logout':
      await supabase.auth.signOut()
      await blockStore.clear()
      await tagStore.clear()
      router.replace('/login')
      break
  }
}
</script>

<template>
  <NDropdown
    :options="options"
    trigger="click"
    @select="handleSelect"
  >
    <section class="flex items-center gap-2 px-4 py-2 transition cursor-pointer hover:bg-(slate opacity-15)">
      <NAvatar
        size="small"
        :src="userStore.profiles?.avatarUrl"
      />
      <div flex items-center>
        {{ userStore.profiles?.fullName }}
        <i i-tabler-chevrons-down text-neutral />
      </div>
    </section>
  </NDropdown>
</template>

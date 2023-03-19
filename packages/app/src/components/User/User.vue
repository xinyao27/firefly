<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { NAvatar, NButton, NText } from 'naive-ui'
import Copyable from '../Copyable.vue'
import { supabase } from '~/api'

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
              ? h(Copyable, { type: 'text', text: userStore.profiles?.token }, () => userStore.profiles?.token)
              : h(NButton, { size: 'tiny', onClick: userStore.generateToken }, () => '生成 Token'),
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
    label: '退出登录',
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
    <section flex items-center gap-2 px-4 py-2 transition cursor-pointer hover:bg-neutral-200>
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

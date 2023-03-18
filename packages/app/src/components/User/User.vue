<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { NAvatar, NText } from 'naive-ui'
import { supabase } from '~/api'

const router = useRouter()

const user = computedAsync(async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
})

function renderUserInfo() {
  return h(
    'div',
    { class: 'px-4 py-2 flex flex-col gap-2' },
    [
      h('div', {
        class: 'text-xs text-neutral font-medium',
      }, { default: () => user.value?.user_metadata.email }),
      h(
        'div',
        {
          class: 'flex items-center',
        },
        [
          h(NAvatar, {
            round: true,
            class: 'mr-4',
            src: user.value?.user_metadata.avatar_url,
          }),
          h('div', null, [
            h('div', null, [h(NText, { depth: 2 }, { default: () => user.value?.user_metadata.name })]),
            h('div', { class: 'text-xs' }, [
              h(
                NText,
                { depth: 3 },
                { default: () => '毫无疑问，你是办公室里最亮的星' },
              ),
            ]),
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
        :src="user?.user_metadata.avatar_url"
      />
      <div flex items-center>
        {{ user?.user_metadata.name }}
        <i i-tabler-chevrons-down text-neutral />
      </div>
    </section>
  </NDropdown>
</template>

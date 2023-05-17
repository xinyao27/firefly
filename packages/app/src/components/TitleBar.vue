<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { is } from '@firefly/common'
import type { DropdownOption } from 'naive-ui'
import { NTooltip } from 'naive-ui'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const blockStore = useBlockStore()
const assistantStore = useAssistantStore()
const assistantLinkStore = useAssistantLinkStore()
const isMobileScreen = useMobileScreen()
const tag = useRouteQuery<string>('tag')
const tags = computed(() => tag.value?.split('/'))
const isInboxPage = computed(() => route.path === '/inbox')

const creates: DropdownOption[] = [
  {
    label: t('assistant.clipping'),
    key: 'text',
    icon: () => h('i', { class: 'i-ri-pencil-line' }),
  },
  {
    label: t('assistant.website'),
    key: 'link',
    icon: () => h('i', { class: 'i-ri-global-line' }),
  },
]
function handleCreatesSelect(key: string) {
  if (key === 'text')
    assistantStore.open('create')
  if (key === 'link')
    assistantLinkStore.open('create')
}
</script>

<template>
  <div z-99 h-full w-full flex select-none items-center justify-between gap-1 px-2>
    <!-- LeftBar Area -->
    <div
      v-if="!isMobileScreen"
      :style="`width: ${configStore.rootPaddingLeft}px`"
      data-tauri-drag-region h-full flex select-none items-center
    >
      <!-- placeholder -->
      <div v-if="is.desktop() && is.macOS()" h-full w-16 />

      <Logo />
    </div>
    <!-- leftBarShow -->
    <NButton
      v-if="isMobileScreen && (route.path !== '/login' && route.path !== '/signup')"
      size="small"
      quaternary
      :opacity="configStore.leftBarShow ? 100 : 40"
      @click="configStore.toggleLeftBarShow"
    >
      <i i-ri-layout-left-line />
    </NButton>
    <!-- Title Area -->
    <div
      v-if="isInboxPage"
      flex items-center gap-2
    >
      <NBreadcrumb>
        <NBreadcrumbItem
          :clickable="!!tags?.length"
          @click="router.push({ name: 'inbox' })"
        >
          <i i-ri-home-2-line inline-block vertical-middle />
        </NBreadcrumbItem>
        <template v-if="!!tags?.length">
          <NBreadcrumbItem
            v-for="(tag, index) in tags"
            :key="tag"
            :clickable="index !== tags.length - 1"
            @click="router.push({
              name: 'inbox',
              query: {
                tag,
              },
            })"
          >
            {{ tag }}
          </NBreadcrumbItem>
        </template>
      </NBreadcrumb>

      <NTooltip>
        <template #trigger>
          <NButton
            size="tiny"
            text
            :loading="blockStore.loading"
            @click="blockStore.sync"
          >
            <i i-ri-refresh-line />
          </NButton>
        </template>
        {{ t('titleBar.sync') }}
      </NTooltip>
    </div>

    <!-- Drag Area -->
    <div
      data-tauri-drag-region
      h-full flex-auto select-none
    />

    <NDropdown
      v-if="isInboxPage && !isMobileScreen"
      trigger="hover"
      :options="creates"
      placement="bottom-end"
      @select="handleCreatesSelect"
    >
      <NButton
        size="small"
        quaternary
      >
        <i i-ri-add-fill />
      </NButton>
    </NDropdown>
    <template v-if="isInboxPage">
      <!-- RightBar Area -->
      <div>
        <!-- rightBarShow -->
        <NButton
          v-if="isMobileScreen"
          size="small"
          quaternary
          :opacity="configStore.rightBarShow ? 100 : 40"
          @click="configStore.toggleRightBarShow"
        >
          <i i-ri-sparkling-2-fill />
        </NButton>
      </div>
    </template>
    <!-- Settings -->
    <Settings />

    <!-- windows tools -->
    <WindowsTools v-if="is.desktop() && is.windows()" />
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { Logo, is } from '@firefly/common'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const blockStore = useBlockStore()
const tag = useRouteQuery<string>('tag')
const tags = computed(() => tag.value?.split('/'))
const isInboxPage = computed(() => route.path === '/inbox')
</script>

<template>
  <div flex items-center justify-between gap-1 z-99 w-full h-full px-2 select-none>
    <!-- LeftBar Area -->
    <div
      v-if="!configStore.isMobileScreen"
      h-full flex items-center select-none
      :style="`width: ${configStore.rootPaddingLeft}px`"
      data-tauri-drag-region
    >
      <!-- placeholder -->
      <div v-if="is.desktop() && is.macOS()" w-16 h-full />

      <Logo />
    </div>
    <!-- leftBarShow -->
    <NButton
      v-if="configStore.isMobileScreen"
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
      flex-auto h-full select-none
      data-tauri-drag-region
    />

    <template v-if="isInboxPage">
      <!-- RightBar Area -->
      <div>
        <!-- rightBarShow -->
        <NButton
          v-if="configStore.isMobileScreen"
          size="small"
          quaternary
          :opacity="configStore.rightBarShow ? 100 : 40"
          @click="configStore.toggleRightBarShow"
        >
          <i i-ri-openai-line />
        </NButton>
      </div>
    </template>
    <!-- Settings -->
    <Settings />

    <!-- windows tools -->
    <WindowsTools v-if="is.desktop() && is.windows()" />
  </div>
</template>

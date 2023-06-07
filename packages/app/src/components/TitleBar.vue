<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { is } from '@firefly/common'
import { NTooltip } from 'naive-ui'

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
  <div
    h-12 w-full select-none px-2
    flex="~ items-center justify-between gap-1"
    border-b="1px neutral opacity-30"
  >
    <!-- placeholder -->
    <div v-if="is.desktop() && is.macOS()" h-full w-16 />

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

    <div h-full flex-auto select-none />

    <SearchInput v-if="isInboxPage" />

    <template v-if="isInboxPage">
      <!-- RightBar Area -->
      <div>
        <!-- rightBarShow -->
        <NButton
          size="small"
          quaternary
          :opacity="configStore.rightBarShow ? 100 : 40"
          @click="configStore.toggleRightBarShow"
        >
          <i i-ri-sparkling-2-fill />
        </NButton>
      </div>
    </template>
  </div>
</template>

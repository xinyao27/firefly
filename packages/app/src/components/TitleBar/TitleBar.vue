<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { Logo, is } from '@firefly/common'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const blockStore = useBlockStore()
const tag = useRouteQuery<string>('tag')
const tags = computed(() => tag.value?.split('/'))
const isIndexPage = computed(() => route.path === '/')
</script>

<template>
  <div flex items-center justify-between gap-1 z-99 w-full h-full px-2 select-none>
    <!-- LeftBar Area -->
    <div
      h-full flex items-center
      :style="`width: ${configStore.rootPaddingLeft}px`"
      data-tauri-drag-region
    >
      <!-- placeholder -->
      <div v-if="is.isDesktop() && is.isMacOS()" w-16 h-full />
      <template v-if="isIndexPage">
        <!-- leftBarShow -->
        <NButton
          v-if="configStore.isMobileScreen"
          size="small"
          quaternary
          :opacity="configStore.leftBarShow ? 100 : 40"
          @click="configStore.toggleLeftBarShow"
        >
          <i v-if="!configStore.leftBarShow" i-ri-layout-left-line />
          <i v-else i-ri-layout-left-fill />
        </NButton>
      </template>

      <Logo />
    </div>
    <template v-if="isIndexPage">
      <!-- Title Area -->
      <div flex items-center gap-2>
        <NBreadcrumb>
          <NBreadcrumbItem
            :clickable="!!tags?.length"
            @click="router.push({ name: 'index' })"
          >
            Block
          </NBreadcrumbItem>
          <template v-if="!!tags?.length">
            <NBreadcrumbItem
              v-for="(tag, index) in tags"
              :key="tag"
              :clickable="index !== tags.length - 1"
              @click="router.push({
                name: 'index',
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
          立即同步
        </NTooltip>
      </div>
    </template>
    <template v-if="isIndexPage">
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
          <i v-if="!configStore.rightBarShow" i-ri-layout-right-line />
          <i v-else i-ri-layout-right-fill />
        </NButton>
      </div>
    </template>

    <!-- Drag Area -->
    <div
      v-if="!configStore.isMobileScreen"
      flex-auto h-full select-none
      data-tauri-drag-region
    />

    <!-- windows tools -->
    <WindowsTools v-if="is.isDesktop() && is.isWindows()" />
  </div>
</template>

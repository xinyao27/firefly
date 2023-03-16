<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import RouterTools from './RouterTools.vue'

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}

const router = useRouter()
const configStore = useConfigStore()
const blockStore = useBlockStore()
const tag = useRouteQuery<string>('tag')

const tags = computed(() => tag.value?.split('/'))
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- LeftBar Area -->
    <div :style="`width: ${configStore.rootPaddingLeft}px`">
      <!-- leftBarShow -->
      <NTooltip
        v-if="configStore.isMobileScreen"
        trigger="hover"
      >
        <template #trigger>
          <NButton
            size="small"
            quaternary
            :opacity="configStore.leftBarShow ? 100 : 40"
            @click="configStore.toggleLeftBarShow"
          >
            <i v-if="!configStore.leftBarShow" i-ri-layout-left-line />
            <i v-else i-ri-layout-left-fill />
          </NButton>
        </template>
        <template v-if="!configStore.leftBarShow">
          展开
        </template>
        <template v-else>
          收起
        </template>
      </NTooltip>
      <!-- Router Tools  -->
      <RouterTools />
    </div>
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
    <!-- Drag Area -->
    <div
      flex-auto h-full select-none
      style="-webkit-app-region: drag"
      @mousedown="handleMouseDown"
    />
  </div>
</template>

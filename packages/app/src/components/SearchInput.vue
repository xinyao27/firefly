<script setup lang="ts">
import type { InputInst } from 'naive-ui'
import { useRouteQuery } from '@vueuse/router'

const el = ref<InputInst>()
const visible = ref(false)
const router = useRouter()
const _query = useRouteQuery<string>('query')
const _tag = useRouteQuery<string>('tag')
const query = ref(_query.value ?? '')

function handleShow() {
  visible.value = true
  nextTick(() => {
    el.value?.focus()
  })
}
function handleInputBlur() {
  if (query.value === '')
    visible.value = false
}
function handleClear() {
  router.replace({
    path: 'inbox',
    query: {
      query: undefined,
      tag: _tag.value,
    },
  })
}
function handleSearch() {
  router.replace({
    path: 'inbox',
    query: {
      query: query.value,
      tag: _tag.value,
    },
  })
}
function handleEnter(e: KeyboardEvent) {
  if (e.key === 'Enter')
    handleSearch()
}
</script>

<template>
  <div>
    <NButton
      v-if="!visible"
      size="small"
      quaternary
      @click="handleShow"
    >
      <template #icon>
        <i i-ri-search-line />
      </template>
    </NButton>
    <NInput
      v-else
      ref="el"
      v-model:value="query"
      class="input"
      size="small"
      placeholder="Search..."
      clearable
      @input-blur="handleInputBlur"
      @clear="handleClear"
      @keyup="handleEnter"
    >
      <template #prefix>
        <i i-ri-search-line />
      </template>
    </NInput>
  </div>
</template>

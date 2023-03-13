<script setup lang="ts">
import dayjs from 'dayjs'
import type { BlockModel } from '~/models/Block'
import Preview from '~/components/TextEditor/Preview.vue'

const props = defineProps<{
  data: BlockModel
}>()
</script>

<template>
  <NCard
    size="small"
    embedded
  >
    <span>{{ dayjs(props.data.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
    <Preview :value="props.data.content" />
  </NCard>
</template>

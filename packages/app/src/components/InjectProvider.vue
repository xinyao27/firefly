<script setup lang="ts">
import { is } from '@firefly/common'
import { useMessage } from 'naive-ui'

if (!is.ssg()) {
  window.$message = useMessage()
  window.$router = useRouter()
  window.$route = useRoute()
}
</script>

<template>
  <slot />
</template>

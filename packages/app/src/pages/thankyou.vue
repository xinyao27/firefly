<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { OrderModel } from '@firefly/common'
import { edgeFunctions, getUser } from '@firefly/common'

definePageMeta({
  layout: 'none',
})

const router = useRouter()
const message = useMessage()
const licenseKey = useRouteQuery<string>('license_key')
const license = ref('')
const loading = ref(false)

async function handleActivate() {
  try {
    loading.value = true
    const data = await edgeFunctions<OrderModel>('activate', { body: { license: license.value } })
    router.push(`/tickets?id=${data.id}`)
  }
  catch (err: any) {
    message.error(err.message)
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  license.value = licenseKey.value
  await getUser(true)
})
</script>

<template>
  <main
    h-full w-full
    flex="~ items-center justify-center"
  >
    <div
      w-400px
      flex="~ col gap-4"
    >
      <h1 text-center text-4xl font-bold>
        Thank you!
      </h1>
      <NInput
        v-model:value="license"
        :placeholder="$t('user.licenseKeyPlaceholder')"
      />
      <NButton
        block
        type="primary"
        :loading="loading"
        @click="handleActivate"
      >
        {{ $t('user.activate') }}
      </NButton>
    </div>
  </main>
</template>

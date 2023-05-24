<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { OrderModel } from '@firefly/common'
import { edgeFunctions } from '@firefly/common'
import { appName } from '~~/constants'

definePageMeta({
  layout: 'none',
})

const router = useRouter()
const message = useMessage()
const licenseKey = useRouteQuery<string>('license_key')
const license = ref('')
const loading = ref(false)

useHead({
  title: `Thank you | ${appName}`,
})

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
})
</script>

<template>
  <main
    h-full w-full
    flex="~ items-center justify-center"
  >
    <FireflyBg />
    <div
      w-400px
      flex="~ col gap-4"
    >
      <h1 text-center text-4xl font-bold>
        Thank you!
      </h1>
      <p text-neutral>
        {{ $t('user.licenseKeyPlaceholder') }}
      </p>
      <NInput
        v-model:value="license"
        placeholder="license key"
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

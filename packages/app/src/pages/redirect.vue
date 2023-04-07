<script setup lang="ts">
import { Spin } from '@firefly/common'
import { useRouteHash } from '@vueuse/router'
import { useMessage } from 'naive-ui'
import { supabase } from '~/api'
import { bc } from '~/utils'

defineOptions({ name: 'RedirectPage' })

const { t } = useI18n()
const search = useRouteHash()
const router = useRouter()
const message = useMessage()
const error = ref<{ type: string; description: string } | null>(null)

onMounted(async () => {
  const hash = search.value.slice(1)
  const searchParams = new URLSearchParams(hash)
  if (bc.name === 'firefly_auth' && bc.onmessage) {
    bc.postMessage(hash)
  }
  else if (window.opener?.postMessage) {
    window.opener.postMessage({ type: 'firefly_auth', hash }, window.location.origin)
  }
  else if (searchParams.get('type') === 'signup') {
    const searchParams = new URLSearchParams(hash)
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      if (error)
        message.error(error.message)
      else
        router.replace('/inbox')
    }
    else {
      message.error(t('common.loginError'))
    }
  }
  else if (searchParams.get('error')) {
    error.value = {
      type: searchParams.get('error')!,
      description: searchParams.get('error_description')!,
    }
  }
})
</script>

<template>
  <div w-screen h-screen flex justify-center items-center>
    <section
      v-if="error"
      class="p-3 bg-(red opacity-5) rounded"
    >
      <h2>{{ error.type }}</h2>
      <p>{{ error.description }}</p>
    </section>
    <Spin v-else />
  </div>
</template>

<route lang="yaml">
meta:
  layout: index
</route>
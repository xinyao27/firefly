<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { OrderModel, ProfileModel } from '@firefly/common'
import { supabase } from '~/plugins/api'

definePageMeta({
  layout: 'none',
})

const id = useRouteQuery<string>('id')
const graphUrl = ref('')
const productName = ref('Firefly Subscription')
const variantName = ref('Monthly')
const createdAt = ref()
const user = ref<ProfileModel>()
const pageUrl = computed(() => `http://firefly.best/tickets?id=${id.value}`)
const shareText = computed(() => `✨ I just received a beautiful electronic card! Check it out!\n${pageUrl.value}`)

onMounted(async () => {
  const { data } = await supabase
    .from('orders')
    .select(`
      id,
      createdAt,
      productName,
      variantName,
      uniqueImage,
      profiles (
        id,
        fullName,
        avatarUrl
      )
    `)
    .eq('id', id.value)
    .single<OrderModel & { profiles: ProfileModel }>()
  if (data) {
    graphUrl.value = data.uniqueImage ?? ''
    productName.value = data.productName
    variantName.value = data.variantName
    createdAt.value = data.createdAt
    user.value = data.profiles
  }
})
</script>

<template>
  <main
    h-full w-full
    flex="~ items-center justify-center"
  >
    <FireflyBg />
    <div
      class="h-full w-full md:(h-600px w-800px rounded-lg)"
      flex="~ col gap-8 items-center justify-center"
    >
      <p px-12 text-2xl>
        {{ $t('thankyou.uniqueCardTitle') }}
      </p>
      <Ticket
        :graph-url="graphUrl"
        :product-name="productName"
        :variant-name="variantName"
        :created-at="createdAt"
        :user="user"
      />
      <div flex="~ gap-2">
        <NButton
          secondary
          tag="a"
          :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`"
          target="_blank"
        >
          <template #icon>
            <i i-ri-twitter-fill />
          </template>
          {{ $t('thankyou.shareToTwitter') }}
        </NButton>
        <NButton
          secondary
          tag="a"
          href="https://firefly.lemonsqueezy.com/checkout/buy/043aac19-17a9-4223-adf5-48c798a02306"
          target="_blank"
        >
          <template #icon>
            <i i-ri-ai-generate />
          </template>
          {{ $t('thankyou.getNewTicket') }}
        </NButton>
      </div>
    </div>
  </main>
</template>

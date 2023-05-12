<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { supabase } from '~/plugins/api'

definePageMeta({
  layout: 'none',
})

const id = useRouteQuery<string>('id')
const graphUrl = ref('')
const productName = ref('Firefly Subscription')
const variantName = ref('Monthly')

onMounted(async () => {
  const order = supabase.from('orders').select('*').eq('id', id.value).single()
  console.log('order: ', order)
})

const ticketRef = ref()
async function handleShareTicket() {
  // TODO 改为单独的 tickets 页面 每次新建卡片在数据库存一条记录, 将卡片信息/激活信息存入数据库, 生成一个唯一的 url
}
</script>

<template>
  <main
    h-full w-full
    flex="~ items-center justify-center"
  >
    <div
      class="h-full w-full md:(h-600px w-800px rounded-lg)"
      flex="~ col gap-8 items-center justify-center"
    >
      <p px-12 text-lg>
        {{ $t('thankyou.uniqueCardTitle') }}
      </p>
      <div ref="ticketRef">
        <Ticket
          :graph-url="graphUrl"
          :product-name="productName"
          :variant-name="variantName"
        />
      </div>
      <NButton tertiary @click="handleShareTicket">
        <template #icon>
          <i i-ri-twitter-fill />
        </template>
        {{ $t('thankyou.shareToTwitter') }}
      </NButton>
    </div>
  </main>
</template>

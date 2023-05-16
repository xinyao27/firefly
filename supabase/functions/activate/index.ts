import { Configuration, OpenAIApi } from 'openai'
import type { OrderDetail, OrderModel } from 'models'
import { v4 as uuid } from 'uuid'
import { serve } from '../_shared/serve.ts'
import { basePath } from '../_shared/api.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'
import { createSupabaseClient, getUser } from '../_shared/auth.ts'
import { base64ToArrayBuffer } from '../_shared/transform.ts'

interface Body {
  license: string
}

const LEMON_SQUEEZY_API_KEY = Deno.env.get('LEMON_SQUEEZY_API_KEY')
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath,
})
const openai = new OpenAIApi(configuration)

async function activateLicenseKey(licenseKey: string) {
  // https://docs.lemonsqueezy.com/help/licensing/license-api
  const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      license_key: licenseKey,
      instance_name: 'Firefly',
    }),
  })
  const result = await response.json() as OrderDetail
  return result
}

serve({
  POST: async (req) => {
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    if (!LEMON_SQUEEZY_API_KEY) {
      throw new ApplicationError(
        'Missing environment variable LEMON_SQUEEZY_API_KEY',
      )
    }
    const body = await req.json() as Body
    if (!body)
      throw new UserError('Missing request data')

    const supabase = createSupabaseClient(Authorization)

    const user = await getUser(supabase)
    if (!user)
      throw new UserError('Invalid Authorization')

    // 判断 license 有没有记录
    const { data: order } = await supabase.from('orders').select('*').eq('license', body.license).single<OrderModel>()
    if (order)
      return order

    const response = await activateLicenseKey(body.license)
    if (!response.activated)
      throw new UserError('licenseKey is not validated!')
    if (response.error)
      throw new ApplicationError(response.error)

    if (response.meta.product_name === 'Firefly Quotas') {
      if (response.meta.variant_name === '100 Copilot Quotas') {
        const { error } = await supabase.rpc('handle_profile_copilot_quota_increment', { uid: user.id, quota: 100 })
        if (error)
          throw new ApplicationError(error.message)
      }
      if (response.meta.variant_name === '300 Copilot Quotas') {
        const { error } = await supabase.rpc('handle_profile_copilot_quota_increment', { uid: user.id, quota: 300 })
        if (error)
          throw new ApplicationError(error.message)
      }
      if (response.meta.variant_name === '600 Copilot Quotas') {
        const { error } = await supabase.rpc('handle_profile_copilot_quota_increment', { uid: user.id, quota: 600 })
        if (error)
          throw new ApplicationError(error.message)
      }
    }
    // else if (response.meta.product_name === 'Firefly Subscription') {
    //   const { data: profile, error } = await supabase.from('profiles').select().single<ProfileModel>()
    //   const subscriptionExpirationAt = dayjs(profile?.subscriptionExpirationAt || new Date())
    //   if (error)
    //     throw new ApplicationError(error.message)
    //   if (response.meta.variant_name === 'Monthly') {
    //     const newSubscriptionExpirationAt = subscriptionExpirationAt.add(1, 'month').endOf('day')
    //     const { error } = await supabase.from('profiles').update({ subscriptionExpirationAt: newSubscriptionExpirationAt }).eq('id', profile.id)
    //     if (error)
    //       throw new ApplicationError(error.message)
    //   }
    //   if (response.meta.variant_name === 'Yearly') {
    //     const newSubscriptionExpirationAt = subscriptionExpirationAt.add(1, 'year').endOf('day')
    //     const { error } = await supabase.from('profiles').update({ subscriptionExpirationAt: newSubscriptionExpirationAt }).eq('id', profile.id)
    //     if (error)
    //       throw new ApplicationError(error.message)
    //   }
    // }

    let url: string | undefined
    try {
      const openaiResponse = await openai.createImage({
        prompt: 'abstract 6 layers of waves on a dark background with light refracting through it, very cool subtle minimal dark illustration, blue light leak with subtle highlights',
        n: 1,
        size: '256x256',
        response_format: 'b64_json',
      })
      const base64 = openaiResponse.data.data[0].b64_json!
      const filename = `${user?.id}/${uuid()}.png`
      const { error } = await supabase.storage
        .from('graphs')
        .upload(
          filename,
          base64ToArrayBuffer(base64),
          {
            contentType: 'image/png',
          },
        )
      if (error)
        throw error
      const { data: { publicUrl } } = supabase
        .storage
        .from('graphs')
        .getPublicUrl(filename)
      url = publicUrl
    }
    catch (err) {
      console.error(err)
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        uid: user.id,
        license: body.license,
        detail: response,
        productName: response.meta.product_name,
        variantName: response.meta.variant_name,
        uniqueImage: url,
      })
      .select('id')
      .limit(1)
      .single()
    if (error)
      throw new ApplicationError(error.message)

    return data
  },
})

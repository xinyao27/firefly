import { Configuration, OpenAIApi } from 'openai'
import dayjs from 'dayjs'
import type { OrderDetail, OrderModel, ProfileModel } from '@firefly/common'
import { ApplicationError, UserError, createErrorHandler, createSupabaseClient, getUser } from '../utils'

interface Body {
  license: string
}

const { LEMON_SQUEEZY_API_KEY, OPENAI_API_KEY, LEMON_SQUEEZY_URL } = useRuntimeConfig()

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath,
})
const openai = new OpenAIApi(configuration)

async function activateLicenseKey(licenseKey: string) {
  // https://docs.lemonsqueezy.com/help/licensing/license-api
  const response = await fetch(`${LEMON_SQUEEZY_URL}/v1/licenses/activate`, {
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

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    if (!LEMON_SQUEEZY_API_KEY) {
      throw new ApplicationError(
        'Missing environment variable LEMON_SQUEEZY_API_KEY',
      )
    }
    const body = await readBody<Body>(event)
    if (!body)
      throw new UserError('Missing request data')

    const supabase = createSupabaseClient(Authorization)

    const user = await getUser(supabase)
    if (!user)
      throw new UserError('Invalid Authorization')

    const response = await activateLicenseKey(body.license)
    if (!response.activated)
      throw new UserError('licenseKey is not validated!')
    if (response.error)
      throw new ApplicationError(response.error)
    if (response.meta.product_name === 'Firefly Subscription') {
      const { data: profile, error } = await supabase.from('profiles').select().single<ProfileModel>()
      const subscriptionExpirationAt = dayjs(profile?.subscriptionExpirationAt || new Date())
      if (error)
        throw new ApplicationError(error.message)
      if (response.meta.variant_name === 'Monthly') {
        const newSubscriptionExpirationAt = subscriptionExpirationAt.add(1, 'month').endOf('day')
        const { error } = await supabase.from('profiles').update({ subscriptionExpirationAt: newSubscriptionExpirationAt }).eq('id', profile.id)
        if (error)
          throw new ApplicationError(error.message)
      }
      if (response.meta.variant_name === 'Yearly') {
        const newSubscriptionExpirationAt = subscriptionExpirationAt.add(1, 'year').endOf('day')
        const { error } = await supabase.from('profiles').update({ subscriptionExpirationAt: newSubscriptionExpirationAt }).eq('id', profile.id)
        if (error)
          throw new ApplicationError(error.message)
      }
    }
    else if (response.meta.product_name === 'Firefly Quotas') {
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

    let url: string | undefined
    try {
      const openaiResponse = await openai.createImage({
        prompt: 'abstract 6 layers of waves on a dark background with light refracting through it, very cool subtle minimal dark illustration, blue light leak with subtle highlights',
        n: 1,
        size: '512x512',
      })
      url = openaiResponse.data.data[0].url
    }
    catch (_) {}
    // const filename = `${user?.id}/${uuid()}.png`
    // const { data, error } = await supabase.storage
    //   .from('graphs')
    //   .upload(
    //     filename,
    //     url!,
    //     {
    //       contentType: 'image/png',
    //     },
    //   )

    const { data, error } = await supabase.from('orders').insert<OrderModel>({
      uid: user.id,
      license: body.license,
      detail: response,
      productName: response.meta.product_name,
      variantName: response.meta.variant_name,
      uniqueImage: url,
    })
    if (error)
      throw new ApplicationError(error.message)

    return {
      data,
    }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

import type { ProfileModel } from '@firefly/common'
import { UserError, createErrorHandler, createSupabaseClient } from '../utils'

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')

    const supabase = createSupabaseClient(Authorization)

    const { data, error } = await supabase.from('profiles').select().single<ProfileModel>()
    if (error)
      throw new UserError(error.message)

    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

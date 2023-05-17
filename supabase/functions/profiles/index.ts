import type { ProfileModel } from 'models'
import { serve } from '../_shared/serve.ts'
import { UserError } from '../_shared/errors.ts'
import { createSupabaseClient } from '../_shared/auth.ts'

serve({
  GET: async (req) => {
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')

    const supabase = createSupabaseClient(Authorization)

    const { data, error } = await supabase.from('profiles').select().single<ProfileModel>()
    if (error)
      throw new UserError(error.message)

    return data
  },
})

import type { SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto-js'
import { encode } from 'js-base64'
import { serve } from '../_shared/serve.ts'
import { createSupabaseClient, getUser } from '../_shared/auth.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'

const SECRET = Deno.env.get('SECRET')

async function generateToken(supabase: SupabaseClient) {
  const user = await getUser(supabase)
  if (user) {
    const data = {
      id: user?.id,
      email: user?.email,
      updatedAt: new Date(),
    }
    // generate a token
    const token = crypto.AES.encrypt(JSON.stringify(data), SECRET!).toString()
    const base64 = encode(token)
    // update the user's token
    const { error } = await supabase
      .from('profiles')
      .update({
        token: base64,
        updatedAt: data.updatedAt,
      })
      .eq(
        'id',
        user.id,
      )
    if (error)
      throw error
    return base64
  }
  else {
    throw new UserError('Invalid Authorization')
  }
}

serve({
  POST: async (req) => {
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    if (!SECRET) {
      throw new ApplicationError(
        'Missing environment variable SECRET',
      )
    }

    const supabase = createSupabaseClient(Authorization)
    const data = await generateToken(supabase)

    return data
  },
})

import { serve } from 'std/server'
import { SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto-js'
import { encode } from 'js-base64'
import { corsHeaders } from '../_shared/cors.ts'
import { getUser } from '../_shared/auth.ts'
import { ApplicationError, createErrorHandler, UserError } from '../_shared/errors.ts'
import { createSupabaseClient } from '../_shared/auth.ts'

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
    if (error) throw error
    return base64
  } else {
    throw new UserError('Invalid Authorization')
  }
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }
    if (!SECRET) {
      throw new ApplicationError(
        'Missing environment variable SECRET',
      )
    }
    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      throw new UserError('Missing Authorization, Please log in to use.')
    }

    const supabase = createSupabaseClient(Authorization)
    const data = await generateToken(supabase)
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})

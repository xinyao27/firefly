import type { BlockModel } from 'models'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto-js'
import { decode } from 'js-base64'
import { serve } from '../_shared/serve.ts'
import { createBlock } from '../_shared/api.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SECRET = Deno.env.get('SECRET')

async function handler(req: Request) {
  const Authorization = req.headers.get('Authorization')
  if (!Authorization)
    throw new UserError('Missing Authorization, Please log in to use.')
  if (!SUPABASE_URL) {
    throw new ApplicationError(
      'Missing environment variable SUPABASE_URL',
    )
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApplicationError(
      'Missing environment variable SUPABASE_SERVICE_ROLE_KEY',
    )
  }
  if (!SECRET) {
    throw new ApplicationError(
      'Missing environment variable SECRET',
    )
  }
  const body = await req.json() as BlockModel
  if (!body)
    throw new UserError('Missing request data')

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  const decodedToken = decode(Authorization)
  const bytes = crypto.AES.decrypt(decodedToken, SECRET)
  const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8)) as any
  if (!decryptedData || !decryptedData.id)
    throw new UserError('Invalid token')

  const { data: { user }, error } = await supabase.auth.admin.getUserById(
    decryptedData.id,
  )
  if (error)
    throw error

  const data = await createBlock(supabase, body, user?.id)

  return data
}

serve({
  POST: handler,
  PUT: handler,
})

import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto-js'
import { decode } from 'js-base64'
import { corsHeaders } from '../_shared/cors.ts'
import { ApplicationError, createErrorHandler, UserError } from '../_shared/errors.ts'
import { BlockModel } from '../../../packages/common/src/models/Block.ts'
import { createBlock, updateBlock } from '../_shared/api.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SECRET = Deno.env.get('SECRET')

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const taskPattern = new URLPattern({ pathname: '/api/:token' })
    const matchingPath = taskPattern.exec(req.url)
    const token = matchingPath ? matchingPath.pathname.groups.token : null
    if (!token) {
      throw new UserError('Missing token')
    }
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

    const requestData = (await req.json()) as BlockModel
    if (!requestData) {
      throw new UserError('Missing request data')
    }

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

    const decodedToken = decode(token)
    const bytes = crypto.AES.decrypt(decodedToken, SECRET)
    const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8))
    if (!decryptedData || !decryptedData.id) {
      throw new UserError('Invalid token')
    }
    const { data: { user }, error } = await supabase.auth.admin.getUserById(
      decryptedData.id,
    )
    if (error) {
      throw error
    }

    let data
    switch (true) {
      case req.method === 'POST':
        data = await createBlock(supabase, requestData, user?.id)
        break
      case req.method === 'PUT': {
        if (!requestData.id) {
          throw new UserError('Missing id in request data')
        }
        data = await updateBlock(supabase, requestData.id, requestData)
        break
      }
      default:
        data = await createBlock(supabase, requestData, user?.id)
        break
    }
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})

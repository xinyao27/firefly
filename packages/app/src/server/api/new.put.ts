import type { BlockModel } from '@firefly/common'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto-js'
import { decode } from 'js-base64'
import { UserError, createErrorHandler } from '../utils'
import { createBlock } from '../utils/api'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SECRET } = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
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
    const body = await readBody<BlockModel>(event)
    if (!body)
      throw new UserError('Missing request data')
    if (!body.id)
      throw new UserError('Missing id in request data')

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

    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

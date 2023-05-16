import type { BlockModel } from 'models'
import { serve } from '../_shared/serve.ts'
import { createSupabaseClient } from '../_shared/auth.ts'
import { UserError } from '../_shared/errors.ts'
import { createBlock } from '../_shared/api.ts'

async function handler(req: Request) {
  const Authorization = req.headers.get('Authorization')
  if (!Authorization)
    throw new UserError('Missing Authorization, Please log in to use.')
  const body = await req.json() as BlockModel
  if (!body)
    throw new UserError('Missing request data')

  const supabase = createSupabaseClient(Authorization)
  const data = await createBlock(supabase, body)

  return data
}

serve({
  POST: handler,
  PUT: handler,
})

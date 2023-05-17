import type { CopilotModel } from 'models'
import { serve } from '../_shared/serve.ts'
import { UserError } from '../_shared/errors.ts'
import { createSupabaseClient, getUser } from '../_shared/auth.ts'
import { createOrUpdateCopilot } from '../_shared/copilot.ts'

async function handler(req: Request) {
  const Authorization = req.headers.get('Authorization')
  if (!Authorization)
    throw new UserError('Missing Authorization, Please log in to use.')
  const body = await req.json() as CopilotModel & { blockIds: string[] }
  if (!body)
    throw new UserError('Missing request data')

  const { blockIds, ...copilot } = body

  const supabase = createSupabaseClient(Authorization)
  const user = await getUser(supabase)
  if (!user)
    throw new UserError('Invalid Authorization')

  const data = await createOrUpdateCopilot(supabase, blockIds, copilot, user.id)

  return data
}

serve({
  POST: handler,
  PUT: handler,
})

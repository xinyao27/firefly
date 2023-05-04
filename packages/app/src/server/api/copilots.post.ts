import type { CopilotModel } from '@firefly/common'
import { UserError, createErrorHandler, createOrUpdateCopilot, createSupabaseClient, getUser } from '../utils'

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<CopilotModel & { blockIds: string[] }>(event)
    if (!body)
      throw new UserError('Missing request data')

    const { blockIds, ...copilot } = body

    const supabase = createSupabaseClient(Authorization)
    const user = await getUser(supabase)
    if (!user)
      throw new UserError('Invalid Authorization')

    const data = await createOrUpdateCopilot(supabase, blockIds, copilot, user.id)

    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

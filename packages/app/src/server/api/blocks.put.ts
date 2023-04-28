import type { BlockModel } from '@firefly/common'
import { UserError, createErrorHandler, updateBlock } from '../utils'

defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<BlockModel>(event)
    if (!body)
      throw new UserError('Missing request data')
    if (!body.id)
      throw new UserError('Missing request data id')

    const supabase = createSupabaseClient(Authorization)
    const data = await updateBlock(supabase, body.id, body)

    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

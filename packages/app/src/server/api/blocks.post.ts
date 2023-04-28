import type { BlockModel } from '@firefly/common'
import { UserError, createErrorHandler } from '../utils'
import { createBlock } from '../utils/api'

defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<BlockModel>(event)
    if (!body)
      throw new UserError('Missing request data')

    const supabase = createSupabaseClient(Authorization)
    const data = await createBlock(supabase, body)

    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

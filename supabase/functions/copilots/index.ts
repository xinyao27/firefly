import { serve } from 'std/server'
import { corsHeaders } from '../_shared/cors.ts'
import { createErrorHandler, UserError } from '../_shared/errors.ts'
import { CopilotModel } from '../_shared/models/Copilot.ts'
import { createCopilot } from '../_shared/copilot.ts'
import { createSupabaseClient } from '../_shared/auth.ts'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const requestData = (await req.json()) as CopilotModel
    if (!requestData) {
      throw new UserError('Missing request data')
    }
    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      throw new UserError('Missing Authorization')
    }

    const supabase = createSupabaseClient(Authorization)
    let data
    switch (true) {
      case req.method === 'POST':
        data = await createCopilot(supabase, requestData)
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

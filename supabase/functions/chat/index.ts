import { serve } from 'std/server'
import { corsHeaders } from '../_shared/cors.ts'
import { createErrorHandler, UserError } from '../_shared/errors.ts'
import { Context, generateCompletion } from './chat.ts'
import { getOpenAiCompletionsStream } from '../_shared/api.ts'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }
    const requestData = (await req.json()) as Context
    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const completionOptions = generateCompletion(requestData.messages)
    const stream = await getOpenAiCompletionsStream(completionOptions)

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})

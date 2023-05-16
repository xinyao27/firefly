import { serve as baseServe } from 'std/http/server.ts'
import { corsHeaders } from './cors.ts'
import { ApplicationError, UserError } from './errors.ts'

type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type P = {
  [k in METHOD]?: (req: Request) => Promise<any>;
}

export function serve(p: P) {
  baseServe(async (req) => {
    try {
      if (req.method === 'OPTIONS')
        return new Response('ok', { headers: corsHeaders })

      const callback = p[req.method as METHOD]
      if (!callback) {
        return new Response('Method Not Allowed', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        })
      }

      const data = await callback?.(req)

      if (data) {
        if (data instanceof Response)
          return data

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      return new Response('Not Found', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }
    catch (err) {
      if (err instanceof UserError) {
        return new Response(
          JSON.stringify({
            error: err.message,
            data: err.data,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
      else if (err instanceof ApplicationError) {
        return new Response(
          JSON.stringify({
            error: err.message,
            data: err.data,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
      else {
        // Print out unexpected errors as is to help with debugging
        console.error(err)
      }

      return new Response(
        JSON.stringify({
          error: err.message || err
            || 'There was an error processing your request',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
  })
}

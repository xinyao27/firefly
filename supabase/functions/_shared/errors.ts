import { corsHeaders } from './cors.ts'

export class ApplicationError extends Error {
  // deno-lint-ignore no-explicit-any
  constructor(message: string, public data: Record<string, any> = {}) {
    super(message)
  }
}

export class UserError extends ApplicationError {}

export function createErrorHandler(err: Error) {
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
  } else if (err instanceof ApplicationError) {
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
  } else {
    // Print out unexpected errors as is to help with debugging
    console.error(err)
  }

  return new Response(
    JSON.stringify({
      error: err.message || err ||
        'There was an error processing your request',
    }),
    {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}

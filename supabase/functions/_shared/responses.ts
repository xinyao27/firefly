import { corsHeaders } from './cors.ts'

export function createStreamResponseHandler(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
    },
  })
}

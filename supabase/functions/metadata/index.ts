import { serve } from 'std/server'
import getMetaData from 'url-metadata'
import { corsHeaders } from '../_shared/cors.ts'
import { createErrorHandler, UserError } from '../_shared/errors.ts'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const u = new URL(req.url)
    const url = u.searchParams.get('url')
    if (!url) {
      throw new UserError('Missing url')
    }
    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      throw new UserError('Missing Authorization, Please log in to use.')
    }

    let data
    switch (true) {
      case req.method === 'GET': {
        const metadata = await getMetaData(url)
        data = {
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
          'og:title': metadata['og:title'],
          'og:description': metadata['og:description'],
          'og:image': metadata['og:image'],
          'twitter:title': metadata['twitter:title'],
          'twitter:image': metadata['twitter:image'],
          'twitter:image:alt': metadata['twitter:image:alt'],
        }
        break
      }
    }
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})

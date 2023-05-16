import { serve } from '../_shared/serve.ts'
import { UserError } from '../_shared/errors.ts'
import { getMetaDataByLink } from '../_shared/api.ts'

serve({
  GET: async (req) => {
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const searchParams = new URL(req.url).searchParams
    const url = searchParams.get('url')
    if (!url)
      throw new UserError('Missing url')

    const metadata = await getMetaDataByLink(url)
    const data = {
      'title': metadata?.title,
      'description': metadata?.description,
      'image': metadata?.image,
      'og:title': metadata?.['og:title'],
      'og:description': metadata?.['og:description'],
      'og:image': metadata?.['og:image'],
      'twitter:title': metadata?.['twitter:title'],
      'twitter:image': metadata?.['twitter:image'],
      'twitter:image:alt': metadata?.['twitter:image:alt'],
    }
    return data
  },
})

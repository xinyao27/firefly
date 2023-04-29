import { UserError, createErrorHandler, getMetaDataByLink } from '../utils'

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const u = new URL(event.node.req.url!)
    const url = u.searchParams.get('url')
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
    return { data }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

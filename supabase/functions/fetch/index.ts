import Parser from 'rss-parser'
import { getText } from 'langchain/tools/webbrowser'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import dayjs from 'dayjs'
import { serve } from '../_shared/serve.ts'
import { UserError } from '../_shared/errors.ts'
import { isRssLink } from '../_shared/validate.ts'

const MAX_TOKENS = Deno.env.get('MAX_TOKENS')!

const parser = new Parser()
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: parseInt(MAX_TOKENS, 10),
  chunkOverlap: 200,
})

serve({
  GET: async (req) => {
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const searchParams = new URL(req.url).searchParams
    const url = decodeURIComponent(searchParams.get('url')!)
    if (!url)
      throw new UserError('Missing url')
    const range = (searchParams.get('range'))?.split(',').map(d => dayjs(parseInt(d))) || [dayjs().subtract(1, 'day'), dayjs()]

    if (await isRssLink(url)) {
      const feed = await parser.parseURL(url)
      const filteredFeed = feed.items?.filter((item) => {
        const itemDate = dayjs(item.pubDate)
        return itemDate.isAfter(dayjs(range[0])) && itemDate.isBefore(dayjs(range[1]))
      })

      const result: {
        title?: string
        link?: string
        createdAt?: string
        author?: string
        content?: string
      }[] = []
      for (const item of filteredFeed) {
        const text = item.contentSnippet ?? ''
        const content = (await textSplitter.splitText(text)).slice(0, 1).join('\n')
        result.push({
          title: item.title,
          link: item.link,
          createdAt: item.pubDate,
          author: item.creator || item.author,
          content,
        })
      }
      return result
    }
    else {
      const html = await fetch(url).then(res => res.text())
      const text = getText(html, url, true)
      const content = (await textSplitter.splitText(text)).slice(0, 1).join('\n')
      return [
        {
          title: '',
          link: url,
          content,
        },
      ]
    }
  },
})

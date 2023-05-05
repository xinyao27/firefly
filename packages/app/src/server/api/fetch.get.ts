import Parser from 'rss-parser'
import { getText } from 'langchain/tools/webbrowser'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import dayjs from 'dayjs'
import { UserError, createErrorHandler, isRssLink } from '../utils'

const { MAX_TOKENS } = useRuntimeConfig()

const parser = new Parser()
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: MAX_TOKENS,
  chunkOverlap: 200,
})

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const query = getQuery(event)
    const url = decodeURIComponent(query.url as string)
    if (!url)
      throw new UserError('Missing url')
    const range = (query.range as string)?.split(',').map(d => dayjs(parseInt(d))) || [dayjs().subtract(1, 'day'), dayjs()]

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
        const text = getText(item.content!, url, true)
        const content = (await textSplitter.splitText(text)).slice(0, 1).join('\n')
        result.push({
          title: item.title,
          link: item.link,
          createdAt: item.pubDate,
          author: item.creator || item.author,
          content,
        })
      }
      return {
        data: result,
      }
    }
    else {
      const html = await fetch(url).then(res => res.text())
      const text = getText(html, url, true)
      const content = (await textSplitter.splitText(text)).slice(0, 1).join('\n')
      return {
        data: [
          {
            title: '',
            link: url,
            content,
          },
        ],
      }
    }
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

import { Redis } from '@upstash/redis'
import Parser from 'rss-parser'
import { OpenAI } from 'langchain/llms/openai'
import { LLMChain, MapReduceDocumentsChain, StuffDocumentsChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PromptTemplate } from 'langchain/prompts'
import { getText } from 'langchain/tools/webbrowser'
import dayjs from 'dayjs'
import { codeBlock, oneLine } from 'common-tags'
import { clearHTMLTags } from '@firefly/common'
import { UserError, basePath, createErrorHandler, isRssLink, tokenizer } from '../utils'

interface Body {
  copilotId: string
  range: [number, number]
}

const { OPENAI_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, MAX_TOKENS } = useRuntimeConfig()
if (!OPENAI_API_KEY)
  console.error('No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.')

const model = new OpenAI(
  {
    modelName: 'gpt-3.5-turbo-0301',
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0,
    maxTokens: MAX_TOKENS,
  },
  { basePath },
)

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1024,
  chunkOverlap: 200,
})

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

const parser = new Parser()

export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<Body>(event)
    if (!body)
      throw new UserError('Missing request data.')
    if (!body.copilotId)
      throw new UserError('Missing copilotId.')
    if (!body.range)
      throw new UserError('Missing range.')

    const { copilotId, range } = body
    const CACHED_KEY = `executor_${copilotId}_${range[0]}_${range[1]}`
    const result = {
      data: '',
    }

    const data = await redis.get<string>(CACHED_KEY)
    if (data) {
      result.data = data
      return result
    }

    const supabase = createSupabaseClient(Authorization)

    const { data: copilot, error: copilotError } = await supabase
      .from('copilots')
      .select('name,description,prompt')
      .eq('id', copilotId)
      .single()
    if (copilotError)
      throw new UserError(copilotError.message)
    const { data: blocks, error: blocksError } = await supabase
      .from('blocks')
      .select(`
        id,
        content,
        category,
        link,
        copilots!inner (
          id,
          name
        )
      `)
      .eq('copilots.id', copilotId)
      .limit(50) // 限制最大数 避免数据量过大消耗太多 token
    if (blocksError)
      throw new UserError(blocksError.message)

    if (blocks.length) {
      const contents: {
        link?: string
        title?: string
        content: string
      }[] = []

      async function getContents() {
        let tokenCount = 0
        const ALL_TOKENS = MAX_TOKENS * 7
        for (const block of blocks!) {
          if (block.category === 'text') {
            const encoded = tokenizer.encode(block.content)
            if (encoded.length <= MAX_TOKENS) {
              tokenCount += encoded.length
              if (tokenCount > ALL_TOKENS)
                return

              contents.push({
                link: block.id,
                content: block.content,
              })
            }
          }
          else if (block.category === 'link') {
            if (await isRssLink(block.link)) {
              const feed = await parser.parseURL(block.link)
              const filteredFeed = feed.items?.filter((item) => {
                const itemDate = dayjs(item.pubDate)
                return itemDate.isAfter(dayjs(range[0])) && itemDate.isBefore(dayjs(range[1]))
              })
              for (const item of filteredFeed) {
                const _content = item.content ? clearHTMLTags(item.content).slice(0, 100) : ''
                const content = (await textSplitter.splitText(_content)).slice(0, 4).join('\n')
                const encoded = tokenizer.encode(content)
                if (encoded.length <= MAX_TOKENS) {
                  tokenCount += encoded.length
                  if (tokenCount > ALL_TOKENS)
                    return

                  contents.push({
                    link: item.link,
                    title: item.title,
                    content,
                  })
                }
              }
            }
            else {
              const html = await fetch(block.link).then(res => res.text())
              const text = getText(html, block.link, true)
              const content = (await textSplitter.splitText(text)).slice(0, 4).join('\n')
              const encoded = tokenizer.encode(content)
              if (encoded.length <= MAX_TOKENS) {
                tokenCount += encoded.length
                if (tokenCount > ALL_TOKENS)
                  return

                contents.push({
                  link: block.link,
                  content,
                })
              }
            }
          }
        }
      }
      await getContents()
      if (!contents.length)
        throw new UserError('No contents found.')

      const docs = await textSplitter.createDocuments(contents.map(v => JSON.stringify(v)))
      const prompt = new PromptTemplate({
        inputVariables: ['text'],
        template: codeBlock`
      Pretend you are GPT4.
      ${copilot.prompt}
      ${oneLine`
        Output as markdown.
        The data you will receive will be in JSON format, which may contain three fields: link, title, and content.
        The content field is the information you need to summarize.
        If the link and title fields have values, please indicate where they come from in the results.
        This is an example:
        1. [title](link) content
        2. [title](link) content
      `}

      The Data:

      {text}

      YOUR RESPONSE:
    `,
      })
      const llmChain = new LLMChain({ prompt, llm: model })
      const combineLLMChain = new LLMChain({ prompt, llm: model })
      const combineDocumentChain = new StuffDocumentsChain({
        llmChain: combineLLMChain,
        documentVariableName: 'text',
      })
      const chain = new MapReduceDocumentsChain({
        llmChain,
        combineDocumentChain,
        documentVariableName: 'text',
        maxTokens: MAX_TOKENS,
      })

      const res = await chain.call({
        input_documents: docs,
      })

      await redis.set(CACHED_KEY, res.text)
      result.data = res.text
    }

    return result
  }
  catch (err) {
    throw createErrorHandler(err as Error)
  }
})

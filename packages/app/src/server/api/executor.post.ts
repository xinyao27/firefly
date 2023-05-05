import { Redis } from '@upstash/redis'
import { OpenAI } from 'langchain/llms/openai'
import { LLMChain, MapReduceDocumentsChain, StuffDocumentsChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PromptTemplate } from 'langchain/prompts'
import * as tokenizer from 'gpt-3-encoder'
import { UserError, basePath, createErrorHandler } from '../utils'

interface Body {
  copilotId: string
  range: [number, number]
  messages: {
    role: 'blocks' | 'fetch'
    content: string
    metadata?: any
  }[]
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
  chunkSize: MAX_TOKENS,
  chunkOverlap: 200,
})

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

const ALL_TOKENS = MAX_TOKENS * 7

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

    const { copilotId, range, messages } = body
    const CACHED_KEY = `executor_${copilotId}_${range[0]}_${range[1]}`
    interface Content {
      link?: string
      title?: string
      content: string
    }
    const result: {
      data: string
      contents: Content[]
    } = {
      data: '',
      contents: [],
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

    let tokenCount = 0
    const texts: string[] = []
    for (const message of messages) {
      const encoded = tokenizer.encode(message.content)

      tokenCount += encoded.length
      if (tokenCount > ALL_TOKENS)
        break
      texts.push(message.content)
    }

    const docs = await textSplitter.createDocuments(texts)
    const prompt = new PromptTemplate({
      inputVariables: ['text'],
      template: `
      Pretend you are GPT4.
      ${copilot.prompt}
      Output as markdown.
      The data you will receive will be in JSON format, which may contain three fields: link, title, and content.
      The content field is the information you need to summarize.
      If the link and title fields have values, please indicate where they come from in the results.
      This is an example:
      1. [title](link) content
      2. [link](link) content

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

    return result
  }
  catch (err) {
    throw createErrorHandler(err as Error)
  }
})

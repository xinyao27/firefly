import { Redis } from '@upstash/redis'
import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PromptTemplate } from 'langchain/prompts'
import { serve } from '../_shared/serve.ts'
import { modelName, tokenizer } from '../_shared/tokenizer.ts'
import { basePath } from '../_shared/api.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'
import { createSupabaseClient } from '../_shared/auth.ts'

interface Body {
  copilotId: string
  range: [number, number]
  messages: {
    role: 'blocks' | 'fetch'
    content: string
    metadata?: any
  }[]
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const UPSTASH_REDIS_REST_URL = Deno.env.get('UPSTASH_REDIS_REST_URL')
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN')
const MAX_TOKENS = Deno.env.get('MAX_TOKENS')!

const model = new OpenAI(
  {
    modelName,
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0,
    maxTokens: parseInt(MAX_TOKENS, 10),
  },
  { basePath },
)

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: parseInt(MAX_TOKENS, 10),
  chunkOverlap: 200,
})

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

const ALL_TOKENS = parseInt(MAX_TOKENS, 10) * 10

serve({
  POST: async (req) => {
    if (!OPENAI_API_KEY)
      throw new ApplicationError('No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.')
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await req.json() as Body
    if (!body)
      throw new UserError('Missing request data.')
    if (!body.copilotId)
      throw new UserError('Missing copilotId.')
    if (!body.range)
      throw new UserError('Missing range.')

    const { copilotId, range, messages } = body
    const CACHED_KEY = `executor_${copilotId}_${range[0]}_${range[1]}`
    const result: {
      data: string
    } = {
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

    let tokenCount = 0
    const texts: string[] = []
    for (const message of messages) {
      const encoded = tokenizer.encode(message.content)

      tokenCount += encoded.length
      if (tokenCount > ALL_TOKENS)
        break
      texts.push(JSON.stringify({
        content: message.content,
        ...message.metadata,
      }))
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

"{text}"

YOUR RESPONSE:
`,
    })
    const chain = loadSummarizationChain(model, { type: 'map_reduce', combinePrompt: prompt, combineMapPrompt: prompt })

    const res = await chain.call({
      input_documents: docs,
    })
    result.data = res.text

    await redis.set(CACHED_KEY, res.text)

    return result
  },
})

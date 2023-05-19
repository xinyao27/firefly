import { Redis } from '@upstash/redis'
import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PromptTemplate } from 'langchain/prompts'
import { CallbackManager } from 'langchain/callbacks'
import { serve } from '../_shared/serve.ts'
import { modelName, tokenizer } from '../_shared/tokenizer.ts'
import { basePath } from '../_shared/api.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'
import { createSupabaseClient } from '../_shared/auth.ts'
import { getExecutorPrompt } from '../_shared/prompts.ts'
import { corsHeaders } from '../_shared/cors.ts'

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
const MAX_TOKENS = parseInt(Deno.env.get('MAX_TOKENS') || '1000')

const encoder = new TextEncoder()

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
})

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

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

    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const data = await redis.get<string>(CACHED_KEY)
    if (data) {
      // deno-lint-ignore no-inner-declarations
      async function write() {
        await writer.ready
        for (const token of data)
          await writer.write(encoder.encode(token))
        await writer.close()
      }
      write()
      return new Response(stream.readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
        },
      })
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
      const content = JSON.stringify({
        content: message.content,
        metadata: message.metadata,
      })
      const encoded = tokenizer.encode(content)

      tokenCount += encoded.length
      if (tokenCount > MAX_TOKENS)
        break
      texts.push(content)
    }

    const docs = await textSplitter.createDocuments(texts)
    const prompt = new PromptTemplate({
      inputVariables: ['text'],
      template: getExecutorPrompt(copilot.prompt),
    })
    let text = ''
    const model = new OpenAI(
      {
        modelName,
        openAIApiKey: OPENAI_API_KEY,
        temperature: 0,
        maxTokens: -1,
        streaming: true,
        callbackManager: CallbackManager.fromHandlers({
          handleLLMNewToken: async (token) => {
            text += token
            await writer.ready
            await writer.write(encoder.encode(token))
          },
          handleLLMEnd: async () => {
            await redis.set(CACHED_KEY, text)
            await writer.ready
            await writer.close()
          },
          handleLLMError: async (e) => {
            await writer.ready
            await writer.abort(e)
          },
        }),
      },
      { basePath },
    )
    const chain = loadSummarizationChain(model, { type: 'map_reduce', combinePrompt: prompt, combineMapPrompt: prompt })

    chain.call({
      input_documents: docs,
    })

    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })
  },
})

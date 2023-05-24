import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage, SystemChatMessage } from 'langchain/schema'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { CallbackManager } from 'langchain/callbacks'
import type { ChatCompletionRequestMessage } from 'openai'
import { serve } from '../_shared/serve.ts'
import { ApplicationError, UserError } from '../_shared/errors.ts'
import type { Context } from '../_shared/api.ts'
import { basePath } from '../_shared/api.ts'
import { createSupabaseClient, getUser } from '../_shared/auth.ts'
import { capMessages, modelName, tokenizer } from '../_shared/tokenizer.ts'
import { corsHeaders } from '../_shared/cors.ts'

const encoder = new TextEncoder()

function clearHTMLTags(text: string) {
  return text.replace(/<.*?>/g, '')
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const MAX_TOKENS = Deno.env.get('MAX_TOKENS')!

serve({
  POST: async (req) => {
    if (!OPENAI_API_KEY)
      throw new ApplicationError('No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.')
    const Authorization = req.headers.get('Authorization')
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await req.json() as Context
    if (!body)
      throw new UserError('Missing request data')

    let messages = body.messages
    const systemMessage = messages.find(({ role }) => role === 'system')
    const contextMessages: ChatCompletionRequestMessage[] = messages
      .filter(({ role }) => role !== 'system')
      .map(({ role, content }) => {
        if (
          ![
            'assistant',
            'user',
          ].includes(role as 'assistant' | 'user')
        )
          throw new Error(`Invalid message role '${role}'`)

        return {
          role,
          content: content.trim(),
        }
      })
    const [userMessage] = contextMessages.filter(({ role }) => role === 'user').slice(-1)
    if (!userMessage)
      throw new Error('No message with role \'user\'')

    const supabase = createSupabaseClient(Authorization)

    const user = await getUser(supabase)
    if (!user)
      throw new UserError('Invalid Authorization')

    const { data } = await supabase.rpc('handle_profile_copilot_quota_decrement', { uid: user.id })
    if (data < 0 || data === null)
      throw new UserError('No quota left')

    if (body.type === 'copilot') {
      const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings({
          timeout: 3000,
          openAIApiKey: OPENAI_API_KEY,
        },
        {
          basePath,
        }),
        {
          client: supabase,
          tableName: 'blocks',
          queryName: 'handle_match_blocks_v2',
        },
      )

      const result = await vectorStore.similaritySearch(userMessage.content, 10, {
        copilotId: body.copilotId,
      })

      let tokenCount = 0
      let contextText = ''

      for (let i = 0; i < result.length; i++) {
        const block = result[i].pageContent
        const content = clearHTMLTags(block)
        const encoded = tokenizer.encode(content)
        tokenCount += encoded.length

        if (tokenCount >= 1500)
          break

        contextText += `${content.trim()}\n---\n`
      }
      // eslint-disable-next-line no-console
      console.info(`copilotId: ${body.copilotId} question: ${userMessage.content}`, result, contextText)
      const initMessages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content:
          contextText
            ? `
                ${`${systemMessage?.content ?? 'You are in a room with a chatbot.'}`}
                ${`Your name is ${body.copilotName}.`}
                Answer all future questions using only the above context data. You must also follow the below rules when answering:
                - What you may be given in the context is content in HTML format. You can choose to ignore the HTML tags and only read the content, or further interpret the meaning of the context based on the semantic meaning of the HTML tags.
                - Do not make up answers that are not provided in the context data.
                - If you are unsure and the answer is not explicitly written in the context data, say "Sorry, I don't know how to help with that."
                - Prefer splitting your response into multiple paragraphs.
                - Output as markdown.
                - Include code snippets if available.

                Here is the context data:
                ${contextText}
            `
            : systemMessage?.content
              ?? `You are in a room with a chatbot. Your name is ${body.copilotName}. ${body.copilotDescription ? `Your description is ${body.copilotDescription}.` : ''}`,
        },
      ]

      messages = capMessages(
        initMessages,
        contextMessages,
        parseInt(MAX_TOKENS, 10),
        modelName,
      )
    }
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const llm = new ChatOpenAI(
      {
        modelName,
        openAIApiKey: OPENAI_API_KEY,
        maxTokens: parseInt(MAX_TOKENS, 10),
        streaming: true,
        callbackManager: CallbackManager.fromHandlers({
          handleLLMNewToken: async (token) => {
            await writer.ready
            await writer.write(encoder.encode(token))
          },
          handleLLMEnd: async () => {
            await writer.ready
            await writer.close()
          },
          handleLLMError: async (e) => {
            await writer.ready
            await writer.abort(e)
          },
        }),
      },
      {
        basePath,
      },
    )
    llm.call(messages.map((v) => {
      if (v.role === 'system')
        return new SystemChatMessage(v.content)
      else if (v.role === 'assistant')
        return new AIChatMessage(v.content)
      return new HumanChatMessage(v.content)
    }))

    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })
  },
})

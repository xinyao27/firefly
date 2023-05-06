// Thanks to supabase

import { Readable } from 'node:stream'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIChatMessage, HumanChatMessage, SystemChatMessage } from 'langchain/schema'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { yieldStream } from 'yield-stream'
import type { Context } from '../utils'
import { ApplicationError, UserError, basePath, capMessages, createErrorHandler, createSupabaseClient, getUser, tokenizer } from '../utils'
import type { ChatCompletionRequestMessage } from '~/types'

const encoder = new TextEncoder()

export function clearHTMLTags(text: string) {
  return text.replace(/<.*?>/g, '')
}

const { OPENAI_API_KEY, MAX_TOKENS } = useRuntimeConfig()
const model = 'gpt-3.5-turbo-0301'
export default defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<Context>(event)
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
    const [userMessage] = contextMessages.filter(({ role }) => role === 'user')
      .slice(-1)
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
      const embeddings = new OpenAIEmbeddings(
        {
          timeout: 1000,
          openAIApiKey: OPENAI_API_KEY,
        },
        {
          basePath,
        },
      )
      const embedding = await embeddings.embedQuery(userMessage.content)

      const { error: matchError, data: blocks } = await supabase
        .rpc('handle_match_blocks', {
          embedding,
          match_threshold: 0.78,
          min_content_length: 10,
          copilot_id: body.copilotId,
        })
        .limit(10)

      // eslint-disable-next-line no-console
      console.log(`copilotId: ${body.copilotId} question: ${userMessage.content}`, blocks)

      if (matchError)
        throw new ApplicationError('Failed to match blocks', matchError)

      let tokenCount = 0
      let contextText = ''

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        // eslint-disable-next-line no-console
        console.info(`${body.copilotId}:`, block)
        const content = clearHTMLTags(block.content)
        const encoded = tokenizer.encode(content)
        tokenCount += encoded.length

        if (tokenCount >= 1500)
          break

        contextText += `${content.trim()}\n---\n`
      }

      const initMessages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: `
            ${`${systemMessage?.content ?? 'You are in a room with a chatbot.'}`}
            ${`Your name is ${body.copilotName}. ${body.copilotDescription}`}
          `,
        },
        {
          role: 'user',
          content: `
            Here is the context data:
            ${contextText}
          `,
        },
        {
          role: 'user',
          content: `
            Answer all future questions using only the above context data. You must also follow the below rules when answering:
            - What you may be given in the context is content in HTML format. You can choose to ignore the HTML tags and only read the content, or further interpret the meaning of the context based on the semantic meaning of the HTML tags.
            - Do not make up answers that are not provided in the context data.
            - If you are unsure and the answer is not explicitly written in the context data, say "Sorry, I don't know how to help with that."
            - Prefer splitting your response into multiple paragraphs.
            - Output as markdown.
            - Include code snippets if available.
          `,
        },
      ]

      messages = capMessages(
        initMessages,
        contextMessages,
        MAX_TOKENS,
        model,
      )
    }

    const stream = new ReadableStream({
      async start(controller) {
        const llm = new ChatOpenAI(
          {
            modelName: model,
            openAIApiKey: OPENAI_API_KEY,
            maxTokens: MAX_TOKENS,
            streaming: true,
            callbacks: [
              {
                handleLLMNewToken: async (token) => {
                  controller.enqueue(encoder.encode(token))
                },
                handleLLMEnd: async () => {
                  controller.close()
                },
                handleLLMError: async (e) => {
                  controller.error(e)
                  controller.close()
                },
              },
            ],
          },
          {
            basePath,
          },
        )
        await llm.call(messages.map((v) => {
          if (v.role === 'system')
            return new SystemChatMessage(v.content)
          else if (v.role === 'assistant')
            return new AIChatMessage(v.content)
          return new HumanChatMessage(v.content)
        }))
      },
    })

    return sendStream(event, Readable.from(yieldStream(stream)))
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

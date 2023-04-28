// Thanks to supabase

import type { ChatCompletionRequestMessage } from 'openai'
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
import { codeBlock, oneLine } from 'common-tags'
import type { Context } from '../utils'
import { ApplicationError, UserError, capMessages, createErrorHandler, createSupabaseClient, generateCompletion, getOpenAiCompletionsStream, getUser, tokenizer } from '../utils'

export function clearHTMLTags(text: string) {
  return text.replace(/<.*?>/g, '')
}

const { OPENAI_API_KEY } = useRuntimeConfig()

defineEventHandler(async (event) => {
  try {
    const Authorization = event.node.req.headers.authorization
    if (!Authorization)
      throw new UserError('Missing Authorization, Please log in to use.')
    const body = await readBody<Context>(event)
    if (!body)
      throw new UserError('Missing request data')

    let messages = body.messages
    const systemMessage = messages.find(({ role }) => role === ChatCompletionRequestMessageRoleEnum.System)
    const contextMessages: ChatCompletionRequestMessage[] = messages
      .filter(({ role }) => role !== ChatCompletionRequestMessageRoleEnum.System)
      .map(({ role, content }) => {
        if (
          ![
            ChatCompletionRequestMessageRoleEnum.Assistant,
            ChatCompletionRequestMessageRoleEnum.User,
          ].includes(role as 'assistant' | 'user')
        )
          throw new Error(`Invalid message role '${role}'`)

        return {
          role,
          content: content.trim(),
        }
      })
    const [userMessage] = contextMessages.filter(({ role }) => role === ChatCompletionRequestMessageRoleEnum.User)
      .slice(-1)
    if (!userMessage)
      throw new Error('No message with role \'user\'')

    const supabase = createSupabaseClient(Authorization)
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY })
    const openai = new OpenAIApi(configuration)

    const user = await getUser(supabase)
    if (!user)
      throw new UserError('Invalid Authorization')

    const { data } = await supabase.rpc('handle_profile_copilot_quota_decrement', { uid: user.id })
    if (data < 0 || data === null)
      throw new UserError('No quota left')

    // Moderate the content to comply with OpenAI T&C
    // const moderationResponses = await Promise.all(
    //   contextMessages.map((message) => openai.createModeration({ input: message.content })),
    // )
    // for (const moderationResponse of moderationResponses) {
    //   const [results] = moderationResponse.data.results
    //   if (results.flagged) {
    //     throw new UserError('Flagged content, please enter a compliant question.', {
    //       flagged: true,
    //       categories: results.categories,
    //     })
    //   }
    // }

    if (body.type === 'copilot') {
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: userMessage.content.replaceAll('\n', ' '),
      })

      if (embeddingResponse.status !== 200)
        throw new ApplicationError('Failed to create embedding for query', embeddingResponse)

      const [{ embedding }] = embeddingResponse.data.data

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
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: codeBlock`
            ${oneLine`
              ${systemMessage?.content ?? 'You are in a room with a chatbot.'}
            `}
            ${oneLine`
              Your name is ${body.copilotName}. ${body.copilotDescription}
            `}
          `,
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: codeBlock`
            Here is the context data:
            ${contextText}
          `,
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: codeBlock`
            ${oneLine`
              Answer all future questions using only the above context data.
              You must also follow the below rules when answering:
            `}
            ${oneLine`
              - What you may be given in the context is content in HTML format.
              You can choose to ignore the HTML tags and only read the content,
              or further interpret the meaning of the context based on the semantic meaning of the HTML tags.
            `}
            ${oneLine`
              - Do not make up answers that are not provided in the context data.
            `}
            ${oneLine`
              - If you are unsure and the answer is not explicitly written
              in the context data, say
              "Sorry, I don't know how to help with that."
            `}
            ${oneLine`
              - Prefer splitting your response into multiple paragraphs.
            `}
            ${oneLine`
              - Output as markdown.
            `}
            ${oneLine`
              - Include code snippets if available.
            `}
          `,
        },
      ]

      const model = 'gpt-3.5-turbo-0301'
      const maxCompletionTokenCount = 1024

      messages = capMessages(
        initMessages,
        contextMessages,
        maxCompletionTokenCount,
        model,
      )
    }

    const completionOptions = generateCompletion(messages)
    const stream = await getOpenAiCompletionsStream(completionOptions)

    return stream
  }
  catch (err) {
    return createErrorHandler(err as Error)
  }
})

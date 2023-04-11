// Thanks to supabase

import { serve } from 'std/server'
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
import { codeBlock, oneLine } from 'common-tags'
import { corsHeaders } from '../_shared/cors.ts'
import { ApplicationError, createErrorHandler, UserError } from '../_shared/errors.ts'
import { Context, generateCompletion } from './chat.ts'
import { getOpenAiCompletionsStream } from '../_shared/api.ts'
import { createSupabaseClient, getOpenAIKey, getUser } from '../_shared/auth.ts'
import { getChatRequestTokenCount, getMaxTokenCount, tokenizer } from '../_shared/tokenizer.ts'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }
    const requestData = (await req.json()) as Context
    if (!requestData) {
      throw new UserError('Missing request data')
    }
    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      throw new UserError('Missing Authorization, Please log in to use.')
    }

    let messages = requestData.messages
    const systemMessage = messages.find(({ role }) => role === ChatCompletionRequestMessageRoleEnum.System)
    const contextMessages: ChatCompletionRequestMessage[] = messages
      .filter(({ role }) => role !== ChatCompletionRequestMessageRoleEnum.System)
      .map(({ role, content }) => {
        if (
          ![
            ChatCompletionRequestMessageRoleEnum.Assistant,
            ChatCompletionRequestMessageRoleEnum.User,
          ].includes(role as 'assistant' | 'user')
        ) {
          throw new Error(`Invalid message role '${role}'`)
        }
        return {
          role,
          content: content.trim(),
        }
      })
    const [userMessage] = contextMessages.filter(({ role }) => role === ChatCompletionRequestMessageRoleEnum.User)
      .slice(-1)
    if (!userMessage) {
      throw new Error('No message with role \'user\'')
    }

    const supabase = createSupabaseClient(Authorization)
    const openAIKey = getOpenAIKey()
    const configuration = new Configuration({ apiKey: openAIKey })
    const openai = new OpenAIApi(configuration)

    const user = await getUser(supabase)
    if (!user) {
      throw new UserError('Invalid Authorization')
    }
    const { data } = await supabase.rpc('handle_profile_copilot_quota_decrement', { uid: user.id })
    if (data < 0 || data === null) {
      throw new UserError('No quota left')
    }

    // Moderate the content to comply with OpenAI T&C
    const moderationResponses = await Promise.all(
      contextMessages.map((message) => openai.createModeration({ input: message.content })),
    )
    for (const moderationResponse of moderationResponses) {
      const [results] = moderationResponse.data.results
      if (results.flagged) {
        throw new UserError('Flagged content', {
          flagged: true,
          categories: results.categories,
        })
      }
    }

    if (requestData.type === 'copilot') {
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: userMessage.content.replaceAll('\n', ' '),
      })

      if (embeddingResponse.status !== 200) {
        throw new ApplicationError('Failed to create embedding for query', embeddingResponse)
      }

      const [{ embedding }] = embeddingResponse.data.data

      const { error: matchError, data: blocks } = await supabase
        .rpc('handle_match_blocks', {
          embedding,
          match_threshold: 0.78,
          min_content_length: 50,
        })
        .select('content')
        .limit(10)

      if (matchError) {
        throw new ApplicationError('Failed to match blocks', matchError)
      }

      let tokenCount = 0
      let contextText = ''

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        console.info(`${requestData.copilotId}:`,  block)
        const content = block.content
        const encoded = tokenizer.encode(content)
        tokenCount += encoded.length

        if (tokenCount >= 1500) {
          break
        }

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
              Your name is ${requestData.copilotName}. ${requestData.copilotDescription}
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

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})

/**
 * Remove context messages until the entire request fits
 * the max total token count for that model.
 *
 * Accounts for both message and completion token counts.
 */
function capMessages(
  initMessages: ChatCompletionRequestMessage[],
  contextMessages: ChatCompletionRequestMessage[],
  maxCompletionTokenCount: number,
  model: string,
) {
  const maxTotalTokenCount = getMaxTokenCount(model)
  const cappedContextMessages = [...contextMessages]
  let tokenCount = getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model) +
    maxCompletionTokenCount

  // Remove earlier context messages until we fit
  while (tokenCount >= maxTotalTokenCount) {
    cappedContextMessages.shift()
    tokenCount = getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model) +
      maxCompletionTokenCount
  }

  return [...initMessages, ...cappedContextMessages]
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import type { CreateChatCompletionRequest } from 'openai'
import { getOpenAIKey, getUser } from './auth.ts'
import { ApplicationError } from './errors.ts'
import type { BlockModel } from './models/Block.ts'
import { validateBlock } from './validate.ts'

async function insertTags(supabase: SupabaseClient, tags: string[]) {
  const uid = (await getUser(supabase))?.id
  const { data } = await supabase
    .from('tags')
    .select('name')
    .in('name', tags)
  await supabase
    .from('tags')
    .insert(
      tags
        .filter((tag) => !(data?.some((v) => v.name === tag)))
        .map((tag) => ({
          name: tag,
          uid,
        })),
    )
}

export async function updateBlock(
  supabase: SupabaseClient,
  id: string,
  block: BlockModel,
) {
  validateBlock(block)
  const { error } = await supabase
    .from('blocks')
    .update(block)
    .eq('id', id)
  if (error) {
    throw new ApplicationError(error.message)
  }

  if (block.tags) {
    await insertTags(supabase, block.tags)
  }

  return block
}

export async function createBlock(
  supabase: SupabaseClient,
  block: BlockModel,
  uid?: string,
) {
  validateBlock(block)
  const _uid = uid || (await getUser(supabase))?.id
  const { data, error } = await supabase
    .from('blocks')
    .insert({
      ...block,
      uid: _uid,
    })
    .select()
    .limit(1)
    .single()
  if (error) {
    throw new ApplicationError(error.message)
  }

  if (block.tags) {
    await insertTags(supabase, block.tags)
  }

  return data
}

export async function getOpenAiCompletionsStream(
  completionOptions: CreateChatCompletionRequest,
) {
  const openAIKey = getOpenAIKey()
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(completionOptions),
  })
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === '[DONE]') {
            // active
            controller.close()
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''

            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            // maybe parse error
            controller.error(e)
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse)
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of response.body!) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })
  return stream
}

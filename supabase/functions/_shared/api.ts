import type { SupabaseClient } from '@supabase/supabase-js'
import getMetaData from 'url-metadata'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import type { CreateChatCompletionRequest } from 'openai'
import { getOpenAIKey, getUser } from './auth.ts'
import { ApplicationError } from './errors.ts'
import type { BlockMetadata, BlockModel } from '../_shared/models/Block.ts'
import { validateBlock } from './validate.ts'

export async function getMetaDataByLink(link: string) {
  try {
    const metadata = await getMetaData(link) as BlockMetadata
    const result: BlockMetadata = {}
    for (const key in metadata) {
      const value = metadata[key]
      if (value) {
        result[key] = value
      }
    }
    if (Object.keys(result).length === 0) return null
    return result
  } catch (err) {
    console.error(err)
    return null
  }
}

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

  if (block.category === 'link' && block.link && !block.metadata) {
    const metadata = await getMetaDataByLink(block.link)
    if (metadata) block.metadata = metadata
  }

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

  if (block.category === 'link' && block.link) {
    const metadata = await getMetaDataByLink(block.link)
    if (metadata) block.metadata = metadata
  }

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
export async function getOpenAiCompletions(
  completionOptions: CreateChatCompletionRequest,
) {
  const openAIKey = getOpenAIKey()
  const response = await fetch('https://openai.firefly.best/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(completionOptions),
  })
  const json = await response.json()
  return json
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
export interface Context {
  type: 'default' | 'copilot'
  copilotId: string
  copilotName?: string
  copilotDescription?: string
  language: string
  messages: ChatMessage[]
}

export function generateCompletion(messages: ChatMessage[]) {
  const completionOptions: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo-0301',
    messages,
    max_tokens: 1024,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
  }

  return completionOptions
}

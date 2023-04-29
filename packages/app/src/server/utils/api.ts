import type { SupabaseClient } from '@supabase/supabase-js'
import getMetaData from 'url-metadata'
import type { BlockMetadata, BlockModel } from '@firefly/common'
import { is } from '@firefly/common'
import { getUser } from './auth'
import { ApplicationError } from './errors'
import { validateBlock } from './validate'

export async function getMetaDataByLink(link: string) {
  try {
    const metadata = await getMetaData(link) as BlockMetadata
    const result: BlockMetadata = {}
    for (const key in metadata) {
      const value = metadata[key]
      if (value)
        result[key] = value
    }
    if (Object.keys(result).length === 0)
      return null
    return result
  }
  catch (err) {
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
        .filter(tag => !(data?.some(v => v.name === tag)))
        .map(tag => ({
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
    if (metadata)
      block.metadata = metadata
  }

  const { error } = await supabase
    .from('blocks')
    .update(block)
    .eq('id', id)
  if (error)
    throw new ApplicationError(error.message)

  if (block.tags)
    await insertTags(supabase, block.tags)

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
    if (metadata)
      block.metadata = metadata
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
  if (error)
    throw new ApplicationError(error.message)

  if (block.tags)
    await insertTags(supabase, block.tags)

  return data
}

export const basePath = is.development() ? 'https://openai.firefly.best/v1' : 'https://api.openai.com/v1'

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

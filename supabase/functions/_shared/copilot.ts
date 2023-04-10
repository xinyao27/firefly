import type { SupabaseClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'
import { CopilotModel } from '../_shared/models/Copilot.ts'
import { getOpenAIKey, getUser } from './auth.ts'
import { ApplicationError } from './errors.ts'
import { validateCopilot } from './validate.ts'
import { inspect } from 'https://deno.land/std@0.177.0/node/util.ts'

export async function createCopilot(
  supabase: SupabaseClient,
  tags: string[],
  copilot: CopilotModel,
  uid: string,
) {
  validateCopilot(copilot)

  const blocks = await supabase
        .from('blocks')
        .select('id,content')
        .eq('uid', uid)
        .contains('tags', JSON.stringify(tags))
  if (blocks.error) {
    throw new ApplicationError(`${blocks.error.message}: ${blocks.error.details}`)
  }
  if (blocks.data?.length === 0) {
    throw new ApplicationError('No blocks found for tags: ' + tags.join(', '))
  }

  for (const block of blocks.data) {
    const input = block.content.replace(/\n/g, ' ')

    try {
      const configuration = new Configuration({
        apiKey: getOpenAIKey(),
      })
      const openai = new OpenAIApi(configuration)

      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input,
      })

      if (embeddingResponse.status !== 200) {
        throw new Error(inspect(embeddingResponse.data, false, 2))
      }

      const [responseData] = embeddingResponse.data.data

      const { error } = await supabase
        .from('blocks')
        .update({
          embedding: responseData.embedding,
        })
        .eq('id', block.id)

      if (error) {
        throw error
      }
    } catch (err) {
      console.error(
        `Failed to generate embeddings for '${tags}' starting with '${
          input.slice(
            0,
            40,
          )
        }...'`,
      )

      throw err
    }
  }

  const _uid = uid || (await getUser(supabase))?.id
  const { data, error } = await supabase
    .from('copilots')
    .insert({
      ...copilot,
      uid: _uid,
    })
    .select()
    .limit(1)
    .single()
  if (error) {
    throw new ApplicationError(error.message)
  }
  await supabase
    .from('copilots_blocks')
    .upsert(blocks.data.map((block) => ({
      copilotId: data.id,
      blockId: block.id,
      uid: _uid,
    })))

  return data
}

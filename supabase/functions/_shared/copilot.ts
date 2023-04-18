import type { SupabaseClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'
import { CopilotModel } from '../_shared/models/Copilot.ts'
import { getOpenAIKey, getUser } from './auth.ts'
import { ApplicationError } from './errors.ts'
import { validateCopilot } from './validate.ts'
import { inspect } from 'https://deno.land/std@0.177.0/node/util.ts'

export async function createOrUpdateCopilot(
  supabase: SupabaseClient,
  tags: string[],
  copilot: CopilotModel,
  uid: string,
) {
  validateCopilot(copilot)

  const _uid = uid || (await getUser(supabase))?.id
  let blocks: {
    id: string
    content: string
  }[] = []

  if (tags.length) {
    const { data: _blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('id,content')
      .eq('uid', uid)
      .contains('tags', JSON.stringify(tags))
    if (blocksError) {
      throw new ApplicationError(`${blocksError.message}: ${blocksError.details}`)
    }
    if (_blocks.length) {
      blocks = _blocks
      for (const block of blocks) {
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
    }
  }

  const { data, error: copilotsError } = await supabase
    .from('copilots')
    .upsert({
      ...copilot,
      uid: _uid,
    })
    .select()
    .limit(1)
    .single()
  if (copilotsError) {
    throw new ApplicationError(copilotsError.message)
  }

  const copilotsBlocks = blocks.map((block) => ({
    copilotId: data.id,
    blockId: block.id,
    uid: _uid,
  })).filter((v) => !!v.copilotId && !!v.blockId && !!v.uid)
  const { error: copilotsBlocksError } = await supabase
    .from('copilots_blocks')
    .upsert(copilotsBlocks)
  if (copilotsBlocksError) {
    throw new ApplicationError(copilotsBlocksError.message)
  }

  return data
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { CopilotModel } from 'models'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { getUser } from './auth.ts'
import { ApplicationError } from './errors.ts'
import { validateCopilot } from './validate.ts'
import { basePath } from './api.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

export async function createOrUpdateCopilot(
  supabase: SupabaseClient,
  blockIds: string[],
  copilot: CopilotModel,
  uid: string,
) {
  validateCopilot(copilot)

  const _uid = uid || (await getUser(supabase))?.id
  let blocks: {
    id: string
    content: string
    category: string
  }[] = []

  if (blockIds.length) {
    const { data: _blocks, error: blocksError } = await supabase
      .from('blocks')
      .select('id,content,category')
      .in('id', blockIds)
      .eq('uid', uid)
    if (blocksError)
      throw new ApplicationError(`${blocksError.message}: ${blocksError.details}`)

    if (_blocks.length) {
      blocks = _blocks
      for (const block of blocks) {
        if (block.category !== 'text')
          continue

        const input = block.content.replace(/\n/g, ' ')

        try {
          const embeddings = new OpenAIEmbeddings(
            {
              timeout: 3000,
              openAIApiKey: OPENAI_API_KEY,
            },
            {
              basePath,
            },
          )
          const embedding = await embeddings.embedQuery(input)

          const { error } = await supabase
            .from('blocks')
            .update({
              embedding,
            })
            .eq('id', block.id)

          if (error)
            throw error
        }
        catch (err) {
          throw new ApplicationError(`Failed to generate embeddings for '${blockIds}' starting with '${
            input.slice(
              0,
              40,
            )
          }...'`)
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
  if (copilotsError)
    throw new ApplicationError(copilotsError.message)

  const { error: deleteCopilotsBlocksError } = await supabase
    .from('copilots_blocks')
    .delete()
    .eq('copilotId', data.id)
  if (deleteCopilotsBlocksError)
    throw new ApplicationError(deleteCopilotsBlocksError.message)
  const copilotsBlocks = blocks.map(block => ({
    copilotId: data.id,
    blockId: block.id,
    uid: _uid,
  })).filter(v => !!v.copilotId && !!v.blockId && !!v.uid)
  const { error: copilotsBlocksError } = await supabase
    .from('copilots_blocks')
    .upsert(copilotsBlocks)
  if (copilotsBlocksError)
    throw new ApplicationError(copilotsBlocksError.message)

  return data
}

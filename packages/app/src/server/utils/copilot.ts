import type { SupabaseClient } from '@supabase/supabase-js'
import type { CopilotModel } from '@firefly/common'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { getUser } from './auth'
import { ApplicationError } from './errors'
import { validateCopilot } from './validate'
import { basePath } from './api'

const { OPENAI_API_KEY } = useRuntimeConfig()

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
    if (blocksError)
      throw new ApplicationError(`${blocksError.message}: ${blocksError.details}`)

    if (_blocks.length) {
      blocks = _blocks
      for (const block of blocks) {
        const input = block.content.replace(/\n/g, ' ')

        try {
          const embeddings = new OpenAIEmbeddings(
            {
              timeout: 1000,
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
  if (copilotsError)
    throw new ApplicationError(copilotsError.message)

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

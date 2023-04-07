import { BlockModel } from './models/Block.ts'

export function validateBlock(block: BlockModel) {
  if (!block) {
    throw new Error('Block is null')
  }
  if (!block.content) {
    throw new Error('Block content is null')
  }
  if (block.content.length > 20000) {
    throw new Error('Block content is too long')
  }
}

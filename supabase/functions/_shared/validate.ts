import { BlockModel } from '../_shared/models/Block.ts'
import { CopilotModel } from '../_shared/models/Copilot.ts'

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

export function validateCopilot(copilot: CopilotModel) {
  if (!copilot) {
    throw new Error('Copilot is null')
  }
  if (!copilot.name) {
    throw new Error('Copilot name is null')
  }
  if (!copilot.description) {
    throw new Error('Copilot description is null')
  }
  if (copilot.description.length > 2000) {
    throw new Error('Copilot description is too long')
  }
  if (copilot.prompt && copilot.prompt.length > 2000) {
    throw new Error('Copilot prompt is too long')
  }
  if (copilot.visibility && copilot.visibility === 'private') {
    throw new Error('Private is not currently supported.')
  }
}

import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Block, BlockId } from '~/models/Block'
import { trpc } from '~renderer/api'

function find(id: string, array: Block[]): Block | null {
  let result: Block | null = null
  for (const v of array) {
    if (v.id === id) {
      result = v
      break
    }
    else {
      result = find(id, v.children || [])
      if (result)
        break
    }
  }
  return result
}

export const useBlockStore = defineStore('block', {
  state: () => {
    return {
      blocks: [] as Block[],
      selectedBlockIds: [] as BlockId[],
      currentBlockId: null as BlockId | null,
      draggingBlock: null as Block | null,
    }
  },
  getters: {
    currentBlock(state) {
      if (state.currentBlockId)
        return find(state.currentBlockId, state.blocks)
      return null
    },
  },
  actions: {
    async find() {
      const blocks = await trpc.block.find.query()
      this.blocks = blocks
    },
    async findOne(id: BlockId) {
      return trpc.block.findOne.query(id)
    },
    async remove(id: BlockId) {
      await trpc.block.remove.mutate({ id })
      await this.find()
    },
    selectBlockIds(selected: BlockId[] = []) {
      this.selectedBlockIds = selected
    },
    async move(targetBlockId: BlockId, dragBlockId: BlockId) {
      await trpc.block.update.mutate({
        id: dragBlockId,
        parentId: targetBlockId,
      })
      await this.find()
    },

    async createFolder() {
      const title = dayjs().format('YYMMDDHHmmss')
      await trpc.block.create.mutate({ title, category: 'folder', from: 'pc' })
      await this.find()
    },
    async createArticle() {
      const title = dayjs().format('YYMMDDHHmmss')
      await trpc.block.create.mutate({ title, category: 'article', from: 'pc' })
      await this.find()
    },
    async updateArticleTitle(id: BlockId, title: string) {
      await trpc.block.update.mutate({
        id,
        title,
      })
      await this.find()
    },
    async updateArticleContent(id: BlockId, content: string) {
      await trpc.block.update.mutate({
        id,
        content,
      })
    },
  },
})

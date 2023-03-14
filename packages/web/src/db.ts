import type { DBSchema, IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import type { BlockModel } from './models/Block'

interface BlockDB extends DBSchema {
  blocks: {
    value: BlockModel
    key: string
    indexes: {
      'id': string
      createdAt: string
      updatedAt: string
      tags: string[]
    }
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Promise<IDBPDatabase<BlockDB>>

export async function initDB() {
  db = openDB<BlockDB>('firefly', 1, {
    upgrade(db) {
      const blockStore = db.createObjectStore('blocks', { keyPath: 'id' })
      blockStore.createIndex('createdAt', 'createdAt')
      blockStore.createIndex('updatedAt', 'updatedAt')
      blockStore.createIndex('tags', 'tags')
    },
  })
  return db
}

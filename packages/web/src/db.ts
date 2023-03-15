import type { DBSchema, IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import type { BlockModel } from './models/Block'
import type { TagModel } from './models/Tag'

interface FireflyDB extends DBSchema {
  blocks: {
    value: BlockModel
    key: string
    indexes: {
      id: string
      createdAt: string
      updatedAt: string
      tags: string[]
    }
  }
  tags: {
    value: TagModel
    key: string
    indexes: {
      id: number
      name: string
      count: number
      lastUsedAt: string
      pinned: number
      icon: string
      createdAt: string
      updatedAt: string
    }
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Promise<IDBPDatabase<FireflyDB>>

export async function initDB() {
  db = openDB<FireflyDB>('firefly', 1, {
    upgrade(db) {
      const blockStore = db.createObjectStore('blocks', { keyPath: 'id' })
      blockStore.createIndex('createdAt', 'createdAt')
      blockStore.createIndex('updatedAt', 'updatedAt')
      blockStore.createIndex('tags', 'tags')

      const tagStore = db.createObjectStore('tags', { keyPath: 'id' })
      tagStore.createIndex('name', 'name')
      tagStore.createIndex('count', 'count')
      tagStore.createIndex('lastUsedAt', 'lastUsedAt')
      tagStore.createIndex('pinned', 'pinned')
      tagStore.createIndex('icon', 'icon')
      tagStore.createIndex('createdAt', 'createdAt')
      tagStore.createIndex('updatedAt', 'updatedAt')
    },
  })
  return db
}

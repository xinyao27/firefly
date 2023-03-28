import type { DBSchema, IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import type { BlockModel, TagModel } from '@firefly/common'

interface FireflyDB extends DBSchema {
  blocks: {
    value: BlockModel
    key: string
    indexes: {
      id: string
      uid: string
      tags: string[]
      createdAt: string
      updatedAt: string
    }
  }
  tags: {
    value: TagModel
    key: string
    indexes: {
      id: number
      uid: number
      name: string
      pinned: number
      icon: string
      createdAt: string
      updatedAt: string
    }
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Promise<IDBPDatabase<FireflyDB>>

export function initDB() {
  db = openDB<FireflyDB>('firefly', 1, {
    upgrade(db) {
      const blockStore = db.createObjectStore('blocks', { keyPath: 'id' })
      blockStore.createIndex('uid', 'uid')
      blockStore.createIndex('tags', 'tags')
      blockStore.createIndex('createdAt', 'createdAt')
      blockStore.createIndex('updatedAt', 'updatedAt')

      const tagStore = db.createObjectStore('tags', { keyPath: 'id' })
      tagStore.createIndex('uid', 'uid')
      tagStore.createIndex('name', 'name')
      tagStore.createIndex('pinned', 'pinned')
      tagStore.createIndex('icon', 'icon')
      tagStore.createIndex('createdAt', 'createdAt')
      tagStore.createIndex('updatedAt', 'updatedAt')
    },
  })
  return db
}

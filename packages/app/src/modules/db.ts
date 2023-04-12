import type { DBSchema, IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import type { BlockModel, TagModel } from '@firefly/common'
import { type UserModule } from '~/types'

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
      id: string
      uid: number
      name: string
      pinned: number
      color: string
      createdAt: string
      updatedAt: string
    }
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Promise<IDBPDatabase<FireflyDB>>

export const install: UserModule = ({ isClient }) => {
  if (!isClient)
    return

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
      tagStore.createIndex('color', 'color')
      tagStore.createIndex('createdAt', 'createdAt')
      tagStore.createIndex('updatedAt', 'updatedAt')
    },
  })
}

import Database from 'tauri-plugin-sql-api'
import { v4 as uuid } from 'uuid'
import type { ID, Message } from '~/models/Message'
import { useMessagesStore } from '~/store/messages'

let db: null | Database = null

async function connect() {
  const s = useMessagesStore()
  try {
    db = await Database.load('sqlite:firefly.db')
    s.setDbConnectionString(db.path)
    return db
  }
  catch (e) {
    console.error(e)
    s.setErrorState(e as string)
    return null
  }
}

async function all() {
  const db = await connect()

  return db?.select('SELECT * FROM messages ORDER BY updatedAt DESC')
}

async function create(data: Omit<Message, 'id'>): Promise<Message> {
  const message: Omit<Message, 'tags'> & { tags: string } = {
    ...data,
    id: uuid(),
    updatedAt: data.updatedAt ?? new Date(),
    createdAt: data.createdAt ?? new Date(),
    tags: (data.tags ?? []).join(','),
    category: data.category ?? 'text',
    fileFrom: data.fileFrom ?? 'pc',
  }

  if (db) {
    await db.execute('INSERT INTO messages (id, title, thumb, createdAt, updatedAt, tags, category, content, fileExt, filePath, fileFrom, link, size, width, height) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [
      message.id,
      message.title,
      message.thumb,
      message.createdAt,
      message.updatedAt,
      message.tags,
      message.category,
      message.content,
      message.fileExt,
      message.filePath,
      message.fileFrom,
      message.link,
      message.size,
      message.width,
      message.height,
    ])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
  return {
    ...message,
    tags: message.tags.split(','),
  }
}

async function remove(id: ID) {
  return db?.execute('DELETE FROM messages WHERE id = $1', [id])
}

async function clear() {
  return db?.execute('DELETE FROM messages')
}

export default {
  connect,
  all,
  create,
  remove,
  clear,
}

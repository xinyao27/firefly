// import Database from 'tauri-plugin-sql-api'
import { v4 as uuid } from 'uuid'
import type { ID, Message } from '~/models/Message'
import { useMessagesStore } from '~/store/messages'

let db = null

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

async function all(): Promise<Message[] | undefined> {
  const db = await connect()

  return db?.select<Message[]>('SELECT * FROM messages ORDER BY updatedAt DESC')
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
    await db.execute('INSERT INTO messages (id, title, thumb, createdAt, updatedAt, tags, category, content, fileExt, filePath, fileFrom, link, size, width, height, isTrash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', [
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
      message.isTrash,
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

async function update(id: ID, message: Omit<Message, 'id'>): Promise<Message> {
  if (db) {
    await db.execute('UPDATE messages SET title = $1, thumb = $2, createdAt = $3, updatedAt = $4, tags = $5, category = $6, content = $7, fileExt = $8, filePath = $9, fileFrom = $10, link = $11, size = $12, width = $13, height = $14, isTrash = $15 WHERE id = $16', [
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
      message.isTrash,
      id,
    ])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
  return { id, ...message }
}

async function moveToTrash(id: ID) {
  if (db) {
    await db.execute('UPDATE messages SET isTrash = true WHERE id = $1', [id])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
}

async function moveToDashboard(id: ID) {
  if (db) {
    await db.execute('UPDATE messages SET isTrash = false WHERE id = $1', [id])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
}

async function remove(id: ID) {
  if (db) {
    db?.execute('DELETE FROM messages WHERE id = $1', [id])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
}

async function clear() {
  if (db) {
    db?.execute('DELETE FROM messages')
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
}

export default {
  connect,
  all,
  create,
  update,
  moveToTrash,
  moveToDashboard,
  remove,
  clear,
}

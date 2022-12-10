import Database from 'tauri-plugin-sql-api'
import { nanoid } from 'nanoid/async'
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
  }
}

async function all() {
  const db = await connect()

  return db?.select('SELECT * FROM messages')
}

async function create(title: string): Promise<Message> {
  const message: Message = {
    id: await nanoid(),
    title,
    thumb: '',
    updatedAt: new Date(),
    createdAt: new Date(),
  }

  if (db) {
    await db.execute('INSERT INTO messages (id, title, thumb, createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5)', [
      message.id,
      message.title,
      message.thumb,
      message.createdAt,
      message.updatedAt,
    ])
  }
  else {
    console.warn('There is not a valid DB connection, adding Message to local storage only')
  }
  return message
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

import Database from 'tauri-plugin-sql-api'
import { nanoid } from 'nanoid/async'
import type { Todo, uuid } from '~/models/Todo'
import { useStore } from '~/store/todos'

let db: null | Database = null

async function connect() {
  const s = useStore()
  try {
    db = await Database.load('sqlite:test.db')
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

  return db?.select('SELECT * FROM todos')
}

async function create(title: string): Promise<Todo> {
  const newTodo = {
    id: await nanoid(),
    title,
    completed: false,
  }
  if (db) {
    await db.execute('INSERT INTO todos (id, title, completed) VALUES ($1,$2,$3)', [
      newTodo.id,
      title,
      false,
    ])
  }
  else {
    console.warn('There is not a valid DB connection, adding TODO to local storage only')
  }
  return newTodo
}

async function update(todo: Todo): Promise<Todo> {
  await db?.execute('UPDATE todos SET title = $1, completed = $2 WHERE id = $3', [
    todo.title,
    todo.completed,
    todo.id,
  ])
  return todo
}

async function remove(id: uuid) {
  return db?.execute('DELETE FROM todos WHERE id = $1', [id])
}

async function clear() {
  return db?.execute('DELETE FROM todos')
}

export default {
  connect,
  all,
  create,
  update,
  remove,
  clear,
}

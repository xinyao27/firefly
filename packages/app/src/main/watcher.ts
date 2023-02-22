import { basename, extname, join } from 'node:path'
import chokidar from 'chokidar'
import { log } from 'electron-log'
import type { Repository } from 'typeorm'
import { readFile, stat } from 'fs-extra'
import mime from 'mime-types'
import { getAppDataPath } from './ipcMain'
import { getCategoryAndThumb, getImageMetadata } from './utils'
import { Message } from '~/entities/message'
import { DataBase } from '~/api/database'
import { MESSAGE_SAVE_DIR_PATH } from '~/constants'

async function handleFileAdded(path: string, repository: Repository<Message>) {
  log(`File ${path} has been added`)
  const appDataPath = getAppDataPath()
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  // 没有对应记录 需要创建
  if (!message) {
    const name = basename(path)
    const relativeFilePath = join(MESSAGE_SAVE_DIR_PATH, name)
    const fileExt = extname(path).split('.')[1]
    const { category, thumb } = await getCategoryAndThumb({
      ext: fileExt,
      filePath: relativeFilePath,
    })
    const mimetype = mime.lookup(path)
    const content = mimetype === 'text/plain'
      ? await readFile(path, 'utf-8')
      : undefined
    const fileName = basename(path, fileExt ? `.${fileExt}` : '')
    const finalMetadata = category === 'image' ? await getImageMetadata(path) : undefined
    const size = (await stat(path)).size

    await repository.save({
      title: fileName,
      thumb,
      category,
      content,
      fileExt,
      filePath: relativeFilePath,
      from: 'pc',
      size,
      metadata: finalMetadata,
      where: 'default',
    })
  }
}
async function handleFileChanged(path: string, repository: Repository<Message>) {
  log(`File ${path} has been changed`)
  const appDataPath = getAppDataPath()
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  // text 类型文件需要单独更新 content
  if (message && message.category === 'text') {
    const content = await readFile(path, 'utf-8')
    message.content = content
    await repository.save(message)
  }
}
async function handleFileUnlinked(path: string, repository: Repository<Message>) {
  log(`File ${path} has been removed`)
  const appDataPath = getAppDataPath()
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  if (message) {
    await repository.remove(message)
  }
}
async function handleDirAdded(path: string, repository: Repository<Message>) {
  log(`Dir ${path} has been added`, repository)
}
async function handleDirUnlinked(path: string, repository: Repository<Message>) {
  log(`Dir ${path} has been removed`, repository)
}

export default function(dirPath?: string) {
  if (dirPath) {
    const db = new DataBase('firefly').dataSource
    const messageRepository = db.getRepository(Message)
    const watcher = chokidar.watch(dirPath)
    watcher.on('add', (path: string) => handleFileAdded(path, messageRepository))
      .on('change', (path: string) => handleFileChanged(path, messageRepository))
      .on('unlink', (path: string) => handleFileUnlinked(path, messageRepository))
      .on('addDir', (path: string) => handleDirAdded(path, messageRepository))
      .on('unlinkDir', (path: string) => handleDirUnlinked(path, messageRepository))
  }
}

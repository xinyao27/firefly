import { basename, dirname, extname } from 'node:path'
import chokidar from 'chokidar'
import { log } from 'electron-log'
import type { DataSource, Repository } from 'typeorm'
import { readFile, stat } from 'fs-extra'
import mime from 'mime-types'
import { getAppDataPath, getMessageDirPath } from './ipcMain'
import { getCategoryAndThumb, getImageMetadata } from './utils'
import { Message } from '~/entities/message'

const messageDirPath = getMessageDirPath()
const appDataPath = getAppDataPath()

async function handleFileAdded(path: string, repository: Repository<Message>) {
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  // 没有对应记录 需要创建
  if (!message) {
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
    const dirPath = dirname(path)
    const messageObject = repository.create({
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
    // 非顶层目录
    if (dirPath !== messageDirPath) {
      const relativeDirPath = dirPath.split(appDataPath)[1]
      const folderMessage = await repository.findOneBy({ filePath: relativeDirPath })
      if (folderMessage) {
        messageObject.parent = folderMessage
      }
    }
    await repository.save(messageObject)
    log(`File ${path} has been added`)
  }
}
async function handleFileChanged(path: string, repository: Repository<Message>) {
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  // text 类型文件需要单独更新 content
  if (message && message.category === 'text') {
    const content = await readFile(path, 'utf-8')
    message.content = content
    await repository.save(message)
    log(`File ${path} has been changed`)
  }
}
async function handleDirAdded(path: string, repository: Repository<Message>) {
  if (path === messageDirPath) return

  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  if (!message) {
    const title = basename(path)
    await repository.save({
      title,
      category: 'folder',
      filePath: relativeFilePath,
      from: 'pc',
      where: 'default',
    })
    log(`Dir ${path} has been added`)
  }
}
async function handleUnlinked(path: string, repository: Repository<Message>) {
  const relativeFilePath = path.split(appDataPath)[1]
  const message = await repository.findOneBy({ filePath: relativeFilePath })
  if (message) {
    await repository.remove(message)
    log(`${path} has been removed`)
  }
}

export default function(db: DataSource) {
  if (messageDirPath) {
    const messageRepository = db.getRepository(Message)
    const watcher = chokidar.watch(messageDirPath)
    watcher.on('add', (path: string) => handleFileAdded(path, messageRepository))
      .on('change', (path: string) => handleFileChanged(path, messageRepository))
      .on('addDir', (path: string) => handleDirAdded(path, messageRepository))
      .on('unlink', (path: string) => handleUnlinked(path, messageRepository))
      .on('unlinkDir', (path: string) => handleUnlinked(path, messageRepository))
  }
}

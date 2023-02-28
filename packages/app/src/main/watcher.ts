import { basename, dirname, extname } from 'node:path'
import chokidar from 'chokidar'
import { log } from 'electron-log'
import type { DataSource, Repository, TreeRepository } from 'typeorm'
import { readFile, stat } from 'fs-extra'
import mime from 'mime-types'
import { getAppDataPath, getBlockDirPath } from './ipcMain'
import { getCategoryAndThumb, getImageMetadata } from './utils'
import { Block } from '~/entities/block'

const blockDirPath = getBlockDirPath()
const appDataPath = getAppDataPath()

async function handleFileAdded(path: string, repository: TreeRepository<Block>) {
  const relativePath = path.split(appDataPath)[1]
  const block = await repository.findOneBy({ path: relativePath })
  // 没有对应记录 需要创建
  if (!block) {
    const fileExt = extname(path).split('.')[1]
    const { category, thumb } = await getCategoryAndThumb({
      ext: fileExt,
      path: relativePath,
    })
    const mimetype = mime.lookup(path)
    const content = mimetype === 'text/plain'
      ? await readFile(path, 'utf-8')
      : undefined
    const fileName = basename(path, fileExt ? `.${fileExt}` : '')
    const finalMetadata = category === 'image' ? await getImageMetadata(path) : undefined
    const size = (await stat(path)).size
    const blockObject = repository.create({
      title: fileName,
      thumb,
      category,
      content,
      fileExt,
      path: relativePath,
      from: 'pc',
      size,
      metadata: finalMetadata,
      where: 'default',
    })
    const dirPath = dirname(path)
    // 非顶层目录
    if (dirPath !== blockDirPath) {
      const relativeDirPath = dirPath.split(appDataPath)[1]
      const folderBlock = await repository.findOneBy({ path: relativeDirPath })
      if (folderBlock)
        blockObject.parent = folderBlock
    }
    // 顶层目录
    else {
      const fireflyBlock = await repository.findOneBy({ id: '0' })
      if (fireflyBlock)
        blockObject.parent = fireflyBlock
    }
    await repository.save(blockObject)
    log(`File ${path} has been added`)
  }
}
async function handleFileChanged(path: string, repository: Repository<Block>) {
  const relativePath = path.split(appDataPath)[1]
  const block = await repository.findOneBy({ path: relativePath })
  // text 类型文件需要单独更新 content
  if (block && block.category === 'text') {
    const content = await readFile(path, 'utf-8')
    block.content = content
    await repository.save(block)
    log(`File ${path} has been changed`)
  }
}
async function handleDirAdded(path: string, repository: TreeRepository<Block>) {
  if (path === blockDirPath)
    return

  const relativePath = path.split(appDataPath)[1]
  const block = await repository.findOneBy({ path: relativePath })
  if (!block) {
    const title = basename(path)
    const blockObject = repository.create({
      title,
      category: 'folder',
      path: relativePath,
      from: 'pc',
      where: 'default',
    })
    const dirPath = dirname(path)
    // 非顶层目录
    if (dirPath !== blockDirPath) {
      const relativeDirPath = dirPath.split(appDataPath)[1]
      const folderBlock = await repository.findOneBy({ path: relativeDirPath })
      if (folderBlock)
        blockObject.parent = folderBlock
    }
    // 顶层目录
    else {
      const fireflyBlock = await repository.findOneBy({ id: '0' })
      if (fireflyBlock)
        blockObject.parent = fireflyBlock
    }
    await repository.save(blockObject)
    log(`Dir ${path} has been added`)
  }
}
async function handleUnlinked(path: string, repository: Repository<Block>) {
  const relativePath = path.split(appDataPath)[1]
  const block = await repository.findOneBy({ path: relativePath })
  if (block) {
    await repository.remove(block)
    log(`${path} has been removed`)
  }
}

export default function (db: DataSource) {
  if (blockDirPath) {
    const blockRepository = db.getTreeRepository(Block)
    const watcher = chokidar.watch(blockDirPath)
    watcher.on('add', (path: string) => handleFileAdded(path, blockRepository))
      .on('change', (path: string) => handleFileChanged(path, blockRepository))
      .on('addDir', (path: string) => handleDirAdded(path, blockRepository))
      .on('unlink', (path: string) => handleUnlinked(path, blockRepository))
      .on('unlinkDir', (path: string) => handleUnlinked(path, blockRepository))
  }
}

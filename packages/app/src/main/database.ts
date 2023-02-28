import { join } from 'node:path'
import { DataSource } from 'typeorm'
import log from 'electron-log'
import { Block } from '~/entities/block'
import { DATABASES_DIR_PATH } from '~/constants'
import { getAppDataPath, getBlockDirPath } from '~main/ipcMain'

export class DataBase {
  dataSource: DataSource

  constructor(database: string) {
    const basePath = join(
      getAppDataPath(),
      `${DATABASES_DIR_PATH}/${database}.db`,
    )
    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      entities: [Block],
      database: basePath,
      synchronize: true,
    })
    this.dataSource.initialize()
      .then(async() => {
        log.info(`Database connected with ${basePath}`)

        const blockRepository = this.dataSource.manager.getTreeRepository(Block)
        const fireflyBlock = await blockRepository.findOneBy({ id: '0' })
        if (fireflyBlock) return
        return blockRepository.save({
          id: '0',
          title: 'Firefly',
          category: 'folder',
          from: 'pc',
          path: getBlockDirPath().split(getAppDataPath())[1],
        })
      })
      .catch(error => log.error(error))
  }
}

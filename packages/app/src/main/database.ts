import { join } from 'node:path'
import { DataSource } from 'typeorm'
import log from 'electron-log'
import { Message } from '~/entities/message'
import { DATABASES_DIR_PATH } from '~/constants'
import { getAppDataPath, getMessageDirPath } from '~main/ipcMain'

export class DataBase {
  dataSource: DataSource

  constructor(database: string) {
    const basePath = join(
      getAppDataPath(),
      `${DATABASES_DIR_PATH}/${database}.db`,
    )
    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      entities: [Message],
      database: basePath,
      synchronize: true,
    })
    this.dataSource.initialize()
      .then(async() => {
        log.info(`Database connected with ${basePath}`)

        const messageRepository = this.dataSource.manager.getTreeRepository(Message)
        const fireflyMessage = await messageRepository.findOneBy({ id: '0' })
        if (fireflyMessage) return
        return messageRepository.save({
          id: '0',
          title: 'Firefly',
          category: 'folder',
          from: 'pc',
          path: getMessageDirPath().split(getAppDataPath())[1],
        })
      })
      .catch(error => log.error(error))
  }
}

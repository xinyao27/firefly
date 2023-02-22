import { join } from 'node:path'
import { DataSource } from 'typeorm'
import log from 'electron-log'
import { Message } from '~/entities/message'
import { DATABASES_DIR_PATH } from '~/constants'
import { getAppDataPath } from '~main/ipcMain'

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
      .then(() => {
        log.info(`Database connected with ${basePath}`)
      })
      .catch(error => log.error(error))
  }
}

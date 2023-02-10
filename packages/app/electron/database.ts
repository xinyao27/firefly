import { join } from 'node:path'
import { DataSource } from 'typeorm'
import log from 'electron-log'
import is from 'electron-is'
import { Message } from '~~/entities/message'
import { Article } from '~~/entities/article'

export class DataBase {
  dataSource: DataSource

  constructor(database: string) {
    const basePath = join(
      is.dev()
        ? __dirname
        : process.env.APP_DATA_PATH!,
      `./databases/${database}.db`,
    )
    this.dataSource = new DataSource({
      type: 'sqlite',
      entities: [Message, Article],
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

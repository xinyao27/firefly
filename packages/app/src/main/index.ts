import path from 'node:path'
import { app } from 'electron'
import * as dotenv from 'dotenv'
import Launcher from './launcher'

dotenv.config()

process.env.APP_NAME = 'Firefly'
process.env.APP_DATA_PATH = path.join(app.getPath('documents'), process.env.APP_NAME)
// eslint-disable-next-line no-new
new Launcher()

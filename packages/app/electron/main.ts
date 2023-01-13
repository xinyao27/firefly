import path from 'node:path'
import { app } from 'electron'
import Launcher from './launcher'

process.env.DIST_ELECTRON = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.DIST_ELECTRON, './dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, './public')
  : process.env.DIST
process.env.APP_NAME = 'Firefly'
process.env.APP_DATA_PATH = app.getPath('userData')

// eslint-disable-next-line no-new
new Launcher()

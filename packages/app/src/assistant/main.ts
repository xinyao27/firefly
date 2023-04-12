import { createApp } from 'vue'
import { type ViteSSGContext } from 'vite-ssg'
import App from './App.vue'
import { install as installPinia } from '~/modules/pinia'
import { install as installDB } from '~/modules/db'
import { install as installI18n } from '~/modules/i18n'

import 'uno.css'
import '~/styles/normalize.css'
import '~/styles/main.sass'

const app = createApp(App)
const context = { app } as ViteSSGContext
installPinia(context)
installDB(context)
installI18n(context)

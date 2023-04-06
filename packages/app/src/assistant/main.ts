import { createApp } from 'vue'
import App from './App.vue'
import { init } from '~/init'

import 'uno.css'
import '../styles/normalize.css'
import '../styles/main.sass'

const app = createApp(App)
init(app)

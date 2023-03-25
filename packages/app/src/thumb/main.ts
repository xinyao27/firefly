import { createApp } from 'vue'
import App from './App.vue'

import 'uno.css'
import '../styles/normalize.css'
import '../styles/main.sass'

document.oncontextmenu = () => false

const app = createApp(App)

app.mount('#app')

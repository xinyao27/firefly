import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import '~/styles'

const app = createApp(App)
setupApp(app)
app.mount('#app')

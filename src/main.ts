import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import pptist from './components/pptist/index'

const app = createApp(App)
app.use(pptist.Icon)
app.use(pptist.Directive)
app.use(createPinia())
app.mount('#app')

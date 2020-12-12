import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/styles/global.scss'

import IconFont from '@/components/IconFont.vue'
import contextmenu from './plugins/contextmenu'
import clickOutside from './plugins/clickOutside'

const app = createApp(App)
app.component('IconFont', IconFont)
app.use(contextmenu)
app.use(clickOutside)
app.use(store)
app.use(router)
app.mount('#app')

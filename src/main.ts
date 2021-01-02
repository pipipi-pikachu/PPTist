import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import 'prosemirror-view/style/prosemirror.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import 'animate.css'

import contextmenu from './plugins/contextmenu'
import clickOutside from './plugins/clickOutside'

const app = createApp(App)
app.use(contextmenu)
app.use(clickOutside)
app.use(store)
app.mount('#app')

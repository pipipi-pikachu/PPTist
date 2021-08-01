import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/antd.scss'
import '@/assets/styles/font.scss'
import 'animate.css'

// 自定义插件
import IconPark from '@/plugins/iconPark'
import Antd from '@/plugins/antd'
import PptCustomComponent from '@/plugins/PptCustomComponent'

const app = createApp(App)
app.use(IconPark)
app.use(Antd)
app.use(PptCustomComponent)
app.use(store, key)
app.mount('#app')

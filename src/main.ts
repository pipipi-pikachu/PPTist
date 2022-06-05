import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './registerServiceWorker'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'

import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/antd.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Component from '@/plugins/component'
import Directive from '@/plugins/directive'

import {
  InputNumber,
  Divider,
  Button,
  Tooltip,
  Popover,
  Slider,
  Select,
  Switch,
  Radio,
  Input,
  Modal,
  Dropdown,
  Menu,
  Checkbox,
  Drawer,
  Spin,
} from 'ant-design-vue'

const app = createApp(App)

app.component('InputNumber', InputNumber)
app.component('Divider', Divider)
app.component('Button', Button)
app.component('ButtonGroup', Button.Group)
app.component('Tooltip', Tooltip)
app.component('Popover', Popover)
app.component('Slider', Slider)
app.component('Select', Select)
app.component('SelectOption', Select.Option)
app.component('SelectOptGroup', Select.OptGroup)
app.component('Switch', Switch)
app.component('Radio', Radio)
app.component('RadioGroup', Radio.Group)
app.component('RadioButton', Radio.Button)
app.component('Input', Input)
app.component('InputGroup', Input.Group)
app.component('TextArea', Input.TextArea)
app.component('Modal', Modal)
app.component('Dropdown', Dropdown)
app.component('Menu', Menu)
app.component('MenuItem', Menu.Item)
app.component('Checkbox', Checkbox)
app.component('Drawer', Drawer)
app.component('Spin', Spin)

app.use(Icon)
app.use(Component)
app.use(Directive)

app.use(createPinia())
app.mount('#app')

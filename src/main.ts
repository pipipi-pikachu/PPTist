import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/antd.scss'
import 'animate.css'

import Contextmenu from './plugins/contextmenu'
import ClickOutside from './plugins/clickOutside'
import IconPark from './plugins/iconPark'

import FileInput from '@/components/FileInput.vue'
import SvgWrapper from '@/components/SvgWrapper.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

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
app.component('Switch', Switch)
app.component('Radio', Radio)
app.component('RadioGroup', Radio.Group)
app.component('RadioButton', Radio.Button)
app.component('Input', Input)
app.component('InputGroup', Input.Group)
app.component('Modal', Modal)
app.component('Dropdown', Dropdown)
app.component('Menu', Menu)
app.component('MenuItem', Menu.Item)

app.directive('contextmenu', Contextmenu)
app.directive('click-outside', ClickOutside)
app.use(IconPark)

app.component('FileInput', FileInput)
app.component('SvgWrapper', SvgWrapper)
app.component('CheckboxButton', CheckboxButton)
app.component('CheckboxButtonGroup', CheckboxButtonGroup)
app.component('ColorPicker', ColorPicker)

app.use(store)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import 'prosemirror-view/style/prosemirror.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/antd.scss'
import 'animate.css'

import contextmenu from './plugins/contextmenu'
import clickOutside from './plugins/clickOutside'

import IconFont from '@/components/IconFont'
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

app.use(contextmenu)
app.use(clickOutside)

app.component('IconFont', IconFont)
app.component('FileInput', FileInput)
app.component('SvgWrapper', SvgWrapper)
app.component('CheckboxButton', CheckboxButton)
app.component('CheckboxButtonGroup', CheckboxButtonGroup)
app.component('ColorPicker', ColorPicker)

app.use(store)
app.mount('#app')

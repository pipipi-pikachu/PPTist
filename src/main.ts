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
import Contextmenu from './plugins/contextmenu'
import ClickOutside from './plugins/clickOutside'
import IconPark from './plugins/iconPark'

// 自定义组件
import FileInput from '@/components/FileInput.vue'
import SvgWrapper from '@/components/SvgWrapper.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

// antd 组件
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

app.directive('contextmenu', Contextmenu)
app.directive('click-outside', ClickOutside)
app.use(IconPark)

app.component('FileInput', FileInput)
app.component('SvgWrapper', SvgWrapper)
app.component('CheckboxButton', CheckboxButton)
app.component('CheckboxButtonGroup', CheckboxButtonGroup)
app.component('ColorPicker', ColorPicker)

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
app.component('Modal', Modal)
app.component('Dropdown', Dropdown)
app.component('Menu', Menu)
app.component('MenuItem', Menu.Item)
app.component('Checkbox', Checkbox)
app.component('Drawer', Drawer)
app.component('Spin', Spin)

app.use(store, key)
app.mount('#app')

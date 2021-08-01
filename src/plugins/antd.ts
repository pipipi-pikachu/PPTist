import { App } from 'vue'

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

export default {
  install(app: App) {
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
  }
}

import { icons } from '@/plugins/icon'
import { components } from '@/plugins/component'

import FileInput from '@/components/FileInput.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'

type Icon = typeof icons

declare module 'vue' {
  export interface GlobalComponents extends Icon {
    FileInput: typeof FileInput
    CheckboxButton: typeof CheckboxButton
    CheckboxButtonGroup: typeof CheckboxButtonGroup
    ColorPicker: typeof ColorPicker
    FullscreenSpin: typeof FullscreenSpin
    MoveablePanel: typeof MoveablePanel

    // antd 组件
    InputNumber: typeof import('ant-design-vue')['InputNumber']
    Divider: typeof import('ant-design-vue')['Divider']
    Button: typeof import('ant-design-vue')['Button']
    ButtonGroup: typeof import('ant-design-vue')['Button']['Group']
    Tooltip: typeof import('ant-design-vue')['Tooltip']
    Popover: typeof import('ant-design-vue')['Popover']
    Slider: typeof import('ant-design-vue')['Slider']
    Select: typeof import('ant-design-vue')['Select']
    SelectOption: typeof import('ant-design-vue')['Select']['Option']
    SelectOptGroup: typeof import('ant-design-vue')['Select']['OptGroup']
    Switch: typeof import('ant-design-vue')['Switch']
    Radio: typeof import('ant-design-vue')['Radio']
    RadioGroup: typeof import('ant-design-vue')['Radio']['Group']
    RadioButton: typeof import('ant-design-vue')['Radio']['Button']
    Input: typeof import('ant-design-vue')['Input']
    InputGroup: typeof import('ant-design-vue')['Input']['Group']
    TextArea: typeof import('ant-design-vue')['Input']['TextArea']
    Modal: typeof import('ant-design-vue')['Modal']
    Dropdown: typeof import('ant-design-vue')['Dropdown']
    Menu: typeof import('ant-design-vue')['Menu']
    MenuItem: typeof import('ant-design-vue')['Menu']['Item']
    Checkbox: typeof import('ant-design-vue')['Checkbox']
    Drawer: typeof import('ant-design-vue')['Drawer']
    Spin: typeof import('ant-design-vue')['Spin']
  }
}

export {}
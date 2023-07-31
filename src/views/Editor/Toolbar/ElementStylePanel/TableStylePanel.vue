<template>
  <div class="table-style-panel">
    <InputGroup compact class="row">
      <Select style="flex: 3;" :value="textAttrs.fontname"
        @change="value => updateTextAttrs({ fontname: value as string })">
        <template #suffixIcon>
          <IconFontSize />
        </template>
        <SelectOptGroup label="system font">
          <SelectOption v-for="font in availableFonts" :key="font.value" :value="font.value">
            <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup label="Online font">
          <SelectOption v-for="font in WEB_FONTS" :key="font.value" :value="font.value">
            <span>{{ font.label }}</span>
          </SelectOption>
        </SelectOptGroup>
      </select>
      <Select style="flex: 2;" :value="textAttrs.fontsize"
        @change="value => updateTextAttrs({ fontsize: value as string })">
        <template #suffixIcon>
          <IconAddText />
        </template>
        <SelectOption v-for="fontsize in fontSizeOptions" :key="fontsize" :value="fontsize">
          {{ fontsize }}
        </SelectOption>
      </select>
    </InputGroup>

    <ButtonGroup class="row">
      <Popover trigger="click">
        <template #content>
          <ColorPicker :modelValue="textAttrs.color" @update:modelValue="value => updateTextAttrs({ color: value })" />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Text Color">
          <TextColorButton :color="textAttrs.color" style="flex: 1;">
            <IconText />
          </TextColorButton>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker :modelValue="textAttrs.backcolor"
            @update:modelValue="value => updateTextAttrs({ backcolor: value })" />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Cell Fill">
          <TextColorButton :color="textAttrs.backcolor" style="flex: 1;">
            <IconFill />
          </TextColorButton>
        </Tooltip>
      </Popover>
    </ButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Bold">
        <CheckboxButton style="flex: 1;" :checked="textAttrs.bold" @click="updateTextAttrs({ bold: !textAttrs.bold })">
          <IconTextBold />
        </CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Italics">
        <CheckboxButton style="flex: 1;" :checked="textAttrs.em" @click="updateTextAttrs({ em: !textAttrs.em })">
          <IconTextItalic />
        </CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Underline">
        <CheckboxButton style="flex: 1;" :checked="textAttrs.underline"
          @click="updateTextAttrs({ underline: !textAttrs.underline })">
          <IconTextUnderline />
        </CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Strikethrough">
        <CheckboxButton style="flex: 1;" :checked="textAttrs.strikethrough"
          @click="updateTextAttrs({ strikethrough: !textAttrs.strikethrough })">
          <IconStrikethrough />
        </CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <RadioGroup class="row" button-style="solid" :value="textAttrs.align"
      @change="e => updateTextAttrs({ align: e.target.value })">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Left alignment">
        <RadioButton value="left" style="flex: 1;">
          <IconAlignTextLeft />
        </RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Center">
        <RadioButton value="center" style="flex: 1;">
          <IconAlignTextCenter />
        </RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Right Align">
        <RadioButton value="right" style="flex: 1;">
          <IconAlignTextRight />
        </RadioButton>
      </Tooltip>
    </RadioGroup>

    <Divider />

    <ElementOutline :fixed="true" />

    <Divider />

    <div class="row">
      <div style="flex: 2;">Number of lines:</div>
      <div class="set-count" style="flex: 3;">
        <Button class="btn" :disabled="rowCount <= 1" @click="setTableRow(rowCount - 1)">
          <IconMinus />
        </Button>
        <div class="count-text">{{ rowCount }}</div>
        <Button class="btn" :disabled="rowCount >= 30" @click="setTableRow(rowCount + 1)">
          <IconPlus />
        </Button>
      </div>
    </div>
    <div class="row">
      <div style="flex: 2;">Number of columns:</div>
      <div class="set-count" style="flex: 3;">
        <Button class="btn" :disabled="colCount <= 1" @click="setTableCol(colCount - 1)">
          <IconMinus />
        </Button>
        <div class="count-text">{{ colCount }}</div>
        <Button class="btn" :disabled="colCount >= 30" @click="setTableCol(colCount + 1)">
          <IconPlus />
        </Button>
      </div>
    </div>

    <Divider />
    <div class="row theme-switch">
      <div style="flex: 2;">Enable theme table:</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch :checked="hasTheme" @change="checked => toggleTheme(checked as boolean)" />
      </div>
    </div>

    <template v-if="theme">
      <div class="row">
        <Checkbox @change="e => updateTheme({ rowHeader: e.target.checked })" :checked="theme.rowHeader" style="flex: 1;">
          Title Row</Checkbox>
        <Checkbox @change="e => updateTheme({ rowFooter: e.target.checked })" :checked="theme.rowFooter" style="flex: 1;">
          Summary row</Checkbox>
      </div>
      <div class="row">
        <Checkbox @change="e => updateTheme({ colHeader: e.target.checked })" :checked="theme.colHeader" style="flex: 1;">
          First Column</Checkbox>
        <Checkbox @change="e => updateTheme({ colFooter: e.target.checked })" :checked="theme.colFooter" style="flex: 1;">
          Last Column</Checkbox>
      </div>
      <div class="row">
        <div style="flex: 2;">Theme color:</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker :modelValue="theme.color" @update:modelValue="value => updateTheme({ color: value })" />
          </template>
          <ColorButton :color="theme.color" style="flex: 3;" />
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTTableElement, TableCell, TableCellStyle, TableTheme } from '@/types/slides'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ColorButton from '../common/ColorButton.vue'
import TextColorButton from '../common/TextColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import {
  Divider,
  Button,
  Tooltip,
  Popover,
  Select,
  Switch,
  Checkbox,
  Radio,
  Input,
} from 'ant-design-vue'
const { Group: RadioGroup, Button: RadioButton } = Radio
const { OptGroup: SelectOptGroup, Option: SelectOption } = Select
const InputGroup = Input.Group
const ButtonGroup = Button.Group

const slidesStore = useSlidesStore()
const { handleElement, handleElementId, selectedTableCells: selectedCells, availableFonts } = storeToRefs(useMainStore())
const themeColor = computed(() => slidesStore.theme.themeColor)

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
]
const textAttrs = ref({
  bold: false,
  em: false,
  underline: false,
  strikethrough: false,
  color: '#000',
  backcolor: '',
  fontsize: '12px',
  fontname: 'Microsoft Yahei',
  align: 'left',
})

const theme = ref<TableTheme>()
const hasTheme = ref(false)
const rowCount = ref(0)
const colCount = ref(0)
const minRowCount = ref(0)
const minColCount = ref(0)

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'table') return

  theme.value = handleElement.value.theme
  hasTheme.value = !!theme.value

  rowCount.value = handleElement.value.data.length
  colCount.value = handleElement.value.data[0].length

  minRowCount.value = handleElement.value.data.length
  minColCount.value = handleElement.value.data[0].length
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

// Update the text style state of the currently selected cell
const updateTextAttrState = () => {
  if (!handleElement.value || handleElement.value.type !== 'table') return

  let rowIndex = 0
  let colIndex = 0
  if (selectedCells.value.length) {
    const selectedCell = selectedCells.value[0]
    rowIndex = +selectedCell.split('_')[0]
    colIndex = +selectedCell.split('_')[1]
  }
  const style = handleElement.value.data[rowIndex][colIndex].style

  if (!style) {
    textAttrs.value = {
      bold: false,
      em: false,
      underline: false,
      strikethrough: false,
      color: '#000',
      backcolor: '',
      fontsize: '12px',
      fontname: 'Microsoft Yahei',
      align: 'left',
    }
  }
  else {
    textAttrs.value = {
      bold: !!style.bold,
      em: !!style.em,
      underline: !!style.underline,
      strikethrough: !!style.strikethrough,
      color: style.color || '#000',
      backcolor: style.backcolor || '',
      fontsize: style.fontsize || '12px',
      fontname: style.fontname || 'Microsoft Yahei',
      align: style.align || 'left',
    }
  }
}

onMounted(() => {
  if (selectedCells.value.length) updateTextAttrState()
})

watch(selectedCells, updateTextAttrState)

const updateElement = (props: Partial<PPTTableElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// Set the cell content text style
const updateTextAttrs = (textAttrProp: Partial<TableCellStyle>) => {
  const _handleElement = handleElement.value as PPTTableElement

  const data: TableCell[][] = JSON.parse(JSON.stringify(_handleElement.data))

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (!selectedCells.value.length || selectedCells.value.includes(`${i}_${j}`)) {
        const style = data[i][j].style || {}
        data[i][j].style = { ...style, ...textAttrProp }
      }
    }
  }
  updateElement({ data })
  updateTextAttrState()
}

// Update table theme: theme color, header row, summary row, first column, last column
const updateTheme = (themeProp: Partial<TableTheme>) => {
  if (!theme.value) return
  const _theme = { ...theme.value, ...themeProp }
  updateElement({ theme: _theme })
}

// Turn on/off the table theme
const toggleTheme = (checked: boolean) => {
  if (checked) {
    const props = {
      theme: {
        color: themeColor.value,
        rowHeader: true,
        rowFooter: false,
        colHeader: false,
        colFooter: false,
      }
    }
    updateElement(props)
  }
  else {
    slidesStore.removeElementProps({ id: handleElementId.value, propName: 'theme' })
    addHistorySnapshot()
  }
}

// Set the number of table rows
const setTableRow = (value: number) => {
  const _handleElement = handleElement.value as PPTTableElement
  const rowCount = _handleElement.data.length

  if (value > rowCount) {
    const rowCells: TableCell[] = new Array(colCount.value).fill({ id: nanoid(10), colspan: 1, rowspan: 1, text: '' })
    const newTableCells: TableCell[][] = new Array(value - rowCount).fill(rowCells)

    const tableCells: TableCell[][] = JSON.parse(JSON.stringify(_handleElement.data))
    tableCells.push(...newTableCells)

    updateElement({ data: tableCells })
  }
  else {
    const tableCells: TableCell[][] = _handleElement.data.slice(0, value)
    updateElement({ data: tableCells })
  }
}

// Set the number of table columns
const setTableCol = (value: number) => {
  const _handleElement = handleElement.value as PPTTableElement
  const colCount = _handleElement.data[0].length

  let tableCells = _handleElement.data
  let colSizeList = _handleElement.colWidths.map(item => item * _handleElement.width)

  if (value > colCount) {
    tableCells = tableCells.map(item => {
      const cells: TableCell[] = new Array(value - colCount).fill({ id: nanoid(10), colspan: 1, rowspan: 1, text: '' })
      item.push(...cells)
      return item
    })

    const newColSizeList: number[] = new Array(value - colCount).fill(100)
    colSizeList.push(...newColSizeList)
  }
  else {
    tableCells = tableCells.map(item => item.slice(0, value))
    colSizeList = colSizeList.slice(0, value)
  }

  const width = colSizeList.reduce((a, b) => a + b)
  const colWidths = colSizeList.map(item => item / width)

  const props = {
    width,
    data: tableCells,
    colWidths,
  }
  updateElement(props)
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.theme-switch {
  margin-bottom: 18px;
}

.switch-wrapper {
  text-align: right;
}

.set-count {
  display: flex;
  justify-content: center;
  align-items: center;

  .btn {
    padding: 4px 8px;
  }

  .count-text {
    flex: 1;
    text-align: center;
    margin: 0 8px;
  }
}
</style>
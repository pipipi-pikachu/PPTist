<template>
  <div class="chart-data-editor">
    <div class="editor-content">
      <div class="range-box">
        <div class="temp-range" :style="{
          width: tempRangeSize.width + 'px',
          height: tempRangeSize.height + 'px',
        }"></div>
        <div :class="['range-line', line.type]" v-for="line in rangeLines" :key="line.type" :style="line.style"></div>
        <div class="resizable" :style="resizablePointStyle" @mousedown.stop="changeSelectRange($event)"></div>
      </div>
      <table>
        <tbody>
          <tr v-for="rowIndex in 31" :key="rowIndex">
            <td v-for="colIndex in 7" :key="colIndex"
              :class="{ 'head': (colIndex === 1 && rowIndex <= selectedRange[1]) || (rowIndex === 1 && colIndex <= selectedRange[0]) }">
              <input :class="['item', { 'selected': rowIndex <= selectedRange[1] && colIndex <= selectedRange[0] }]"
                :id="`cell-${rowIndex - 1}-${colIndex - 1}`" autocomplete="off"
                @focus="focusCell = [rowIndex - 1, colIndex - 1]"
                @paste="$event => handlePaste($event, rowIndex - 1, colIndex - 1)">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btns">
      <div class="left">
        <Button class="btn" @click="clear()">Clear</Button>
      </div>
      <div class="right">
        <Button class="btn" @click="closeEditor()">Cancel</Button>
        <Button type="primary" class="btn" @click="getTableData()" style="margin-left: 10px;">Confirm</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, ref } from 'vue'
import { ChartData } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'
import { pasteCustomClipboardString, pasteExcelClipboardString } from '@/utils/clipboard'

import { Button, Input } from 'ant-design-vue'

const props = defineProps({
  data: {
    type: Object as PropType<ChartData>,
    required: true,
  }
})

const emit = defineEmits<{
  (event: 'save', payload: ChartData): void
  (event: 'close'): void
}>()

const CELL_WIDTH = 100
const CELL_HEIGHT = 32

const selectedRange = ref([0, 0])
const tempRangeSize = ref({ width: 0, height: 0 })
const focusCell = ref<[number, number] | null>(null)

// The border line position of the current selection
const rangeLines = computed(() => {
  const width = selectedRange.value[0] * CELL_WIDTH
  const height = selectedRange.value[1] * CELL_HEIGHT
  return [
    { type: 't', style: { width: width + 'px' } },
    { type: 'b', style: { top: height + 'px', width: width + 'px' } },
    { type: 'l', style: { height: height + 'px' } },
    { type: 'r', style: { left: width + 'px', height: height + 'px' } },
  ]
})

// The zoom point position of the current selection
const resizablePointStyle = computed(() => {
  const width = selectedRange.value[0] * CELL_WIDTH
  const height = selectedRange.value[1] * CELL_HEIGHT
  return { left: width + 'px', top: height + 'px' }
})

// Initialize chart data: format and populate data to DOM
const initData = () => {
  const _data: string[][] = []

  const { labels, legends, series } = props.data
  const rowCount = labels.length
  const colCount = series.length

  _data.push(['', ...legends])
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = [labels[rowIndex]]
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      row.push(series[colIndex][rowIndex] + '')
    }
    _data.push(row)
  }

  for (let rowIndex = 0; rowIndex < rowCount + 1; rowIndex++) {
    for (let colIndex = 0; colIndex < colCount + 1; colIndex++) {
      const inputRef = document.querySelector(`#cell-${rowIndex}-${colIndex}`) as HTMLInputElement
      if (!inputRef) continue
      inputRef.value = _data[rowIndex][colIndex] + ''
    }
  }

  selectedRange.value = [colCount + 1, rowCount + 1]
}

onMounted(initData)

// Shortcut key monitoring: Enter to move the focus to the next line
const moveNextRow = () => {
  if (!focusCell.value) return

  const [rowIndex, colIndex] = focusCell.value
  const inputRef = document.querySelector(`#cell-${rowIndex + 1}-${colIndex}`) as HTMLInputElement
  inputRef && inputRef.focus()
}

const keyboardListener = (e: KeyboardEvent) => {
  const key = e.key.toUpperCase()
  if (key === KEYS.ENTER) moveNextRow()
}

onMounted(() => {
  document.addEventListener('keydown', keyboardListener)
})
onUnmounted(() => {
  document.removeEventListener('keydown', keyboardListener)
})

// Get the data in the DOM of the current chart, arrange and format it and pass it out
const getTableData = () => {
  const [col, row] = selectedRange.value

  const labels: string[] = []
  const legends: string[] = []
  const series: number[][] = []

  // The first row is the series name, the first column is the project name, and the actual data starts from the second row and the second column
  for (let rowIndex = 1; rowIndex < row; rowIndex++) {
    let labelsItem = `category ${rowIndex}`
    const labelInputRef = document.querySelector(`#cell-${rowIndex}-0`) as HTMLInputElement
    if (labelInputRef && labelInputRef.value) labelsItem = labelInputRef.value
    labels.push(labelsItem)
  }
  for (let colIndex = 1; colIndex < col; colIndex++) {
    let legendsItem = `Series ${colIndex}`
    const labelInputRef = document.querySelector(`#cell-0-${colIndex}`) as HTMLInputElement
    if (labelInputRef && labelInputRef.value) legendsItem = labelInputRef.value
    legends.push(legendsItem)
  }

  for (let colIndex = 1; colIndex < col; colIndex++) {
    const seriesItem = []
    for (let rowIndex = 1; rowIndex < row; rowIndex++) {
      const valueInputRef = document.querySelector(`#cell-${rowIndex}-${colIndex}`) as HTMLInputElement
      let value = 0
      if (valueInputRef && valueInputRef.value && !!(+valueInputRef.value)) {
        value = +valueInputRef.value
      }
      seriesItem.push(value)
    }
    series.push(seriesItem)
  }

  emit('save', { labels, legends, series })
}

// Clear form data
const clear = () => {
  for (let rowIndex = 1; rowIndex < 31; rowIndex++) {
    for (let colIndex = 1; colIndex < 7; colIndex++) {
      const inputRef = document.querySelector(`#cell-${rowIndex}-${colIndex}`) as HTMLInputElement
      if (!inputRef) continue
      inputRef.value = ''
    }
  }
}
// custom paste event (try to read the table data in the clipboard)
const handlePaste = (e: ClipboardEvent, rowIndex: number, colIndex: number) => {
  e.preventDefault()

  if (!e.clipboardData) return

  const clipboardDataFirstItem = e.clipboardData.items[0]

  if (clipboardDataFirstItem && clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain') {
    clipboardDataFirstItem.getAsString(text => {
      const clipboardData = pasteCustomClipboardString(text)
      if (typeof clipboardData === 'object') return

      const excelData = pasteExcelClipboardString(text)
      if (excelData) {
        const maxRow = rowIndex + excelData.length
        const maxCol = colIndex + excelData[0].length
        for (let i = rowIndex; i < maxRow; i++) {
          for (let j = colIndex; j < maxCol; j++) {
            const inputRef = document.querySelector(`#cell-${i}-${j}`) as HTMLInputElement
            if (!inputRef) continue
            inputRef.value = excelData[i - rowIndex][j - colIndex]
          }
        }
      }
    })
  }
}

// Close the chart data editor
const closeEditor = () => emit('close')

// Mouse drag to modify the selected data range
const changeSelectRange = (e: MouseEvent) => {
  let isMouseDown = true

  const startPageX = e.pageX
  const startPageY = e.pageY

  const originWidth = selectedRange.value[0] * CELL_WIDTH
  const originHeight = selectedRange.value[1] * CELL_HEIGHT

  document.onmousemove = e => {
    if (!isMouseDown) return

    const currentPageX = e.pageX
    const currentPageY = e.pageY

    const x = currentPageX - startPageX
    const y = currentPageY - startPageY

    const width = originWidth + x
    const height = originHeight + y

    tempRangeSize.value = { width, height }
  }

  document.onmouseup = e => {
    isMouseDown = false
    document.onmousemove = null
    document.onmouseup = null

    const endPageX = e.pageX
    const endPageY = e.pageY

    if (startPageX === endPageX && startPageY === endPageY) return

    // At the end of dragging, the range will automatically expand to the next grid if the range exceeds half of the grid (if you drag to a position of more than one and a half grids, it will automatically expand to two grids, the same is true for both horizontal and vertical)
    let width = tempRangeSize.value.width
    let height = tempRangeSize.value.height
    if (width % CELL_WIDTH > CELL_WIDTH * 0.5) width = width + (CELL_WIDTH - width % CELL_WIDTH)
    if (height % CELL_HEIGHT > CELL_HEIGHT * 0.5) height = height + (CELL_HEIGHT - height % CELL_HEIGHT)

    let row = Math.round(height / CELL_HEIGHT)
    let col = Math.round(width / CELL_WIDTH)

    if (row < 3) row = 3
    if (col < 2) col = 2

    selectedRange.value = [col, row]
    tempRangeSize.value = { width: 0, height: 0 }
  }
}
</script>

<style lang="scss" scoped>
.chart-data-editor {
  width: 600px;
  position: relative;
}

.editor-content {
  width: 100%;
  height: 360px;
  position: relative;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;

  @include overflow-overlay();
}

.range-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  user-select: none;
}

.temp-range {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba($color: #888, $alpha: .3);
}

.range-line {
  width: 0;
  height: 0;
  position: absolute;
  left: 0;
  top: 0;
  border: 0 solid $themeColor;

  &.t {
    border-top-width: 1px;
  }

  &.b {
    border-bottom-width: 1px;
  }

  &.l {
    border-left-width: 1px;
  }

  &.r {
    border-right-width: 1px;
  }
}

.resizable {
  position: absolute;
  width: 12px;
  height: 12px;
  left: 0;
  top: 0;
  margin: -9px 0 0 -9px;
  cursor: nwse-resize;

  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 12px;
    right: 0;
    top: 0;
    background-color: $themeColor;
  }

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 4px;
    right: 0;
    bottom: 0;
    background-color: $themeColor;
  }
}

table {
  width: 100%;
  height: 100%;
  user-select: none;
  table-layout: fixed;

  td {
    text-align: center;
    border: 1px solid #ccc;
    vertical-align: middle;
    width: 100px;
    height: 32px;

    &.head {
      background-color: rgba($color: $themeColor, $alpha: .1);
    }
  }

  .item {
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    font-size: 13px;
    text-align: center;
    background-color: transparent;

    &.selected {
      background-color: rgba($color: $themeColor, $alpha: .02);
    }
  }
}

.btns {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
<template>
  <div 
    class="editable-table"
    :style="{ width: totalWidth + 'px' }"
  >
    <div class="handler" v-if="editable">
      <div 
        class="drag-line" 
        v-for="(pos, index) in dragLinePosition" 
        :key="index"
        :style="{ left: pos + 'px' }"
        @mousedown="$event => handleMousedownColHandler($event, index)"
      ></div>
    </div>
    <table 
      :class="{
        'theme': theme,
        'row-header': theme?.rowHeader,
        'row-footer': theme?.rowFooter,
        'col-header': theme?.colHeader,
        'col-footer': theme?.colFooter,
      }"
      :style="`--themeColor: ${theme?.color}; --subThemeColor1: ${subThemeColor[0]}; --subThemeColor2: ${subThemeColor[1]}`"
    >
      <colgroup>
        <col span="1" v-for="(width, index) in colSizeList" :key="index" :width="width">
      </colgroup>
      <tbody>
        <tr v-for="(rowCells, rowIndex) in tableCells" :key="rowIndex" :style="{ height: cellMinHeight + 'px' }">
          <td 
            class="cell"
            :class="{
              'selected': selectedCells.includes(`${rowIndex}_${colIndex}`) && selectedCells.length > 1,
              'active': activedCell === `${rowIndex}_${colIndex}`,
            }"
            :style="{
              borderStyle: outline.style,
              borderColor: outline.color,
              borderWidth: outline.width + 'px',
              ...getTextStyle(cell.style),
            }"
            v-for="(cell, colIndex) in rowCells"
            :key="cell.id"
            :rowspan="cell.rowspan"
            :colspan="cell.colspan"
            :data-cell-index="`${rowIndex}_${colIndex}`"
            v-show="!hideCells.includes(`${rowIndex}_${colIndex}`)"
            @mousedown="$event => handleCellMousedown($event, rowIndex, colIndex)"
            @mouseenter="handleCellMouseenter(rowIndex, colIndex)"
            v-contextmenu="(el: HTMLElement) => contextmenus(el)"
          >
            <CustomTextarea 
              v-if="activedCell === `${rowIndex}_${colIndex}`"
              class="cell-text" 
              :class="{ 'active': activedCell === `${rowIndex}_${colIndex}` }"
              :style="{ minHeight: (cellMinHeight - 4) + 'px' }"
              :value="cell.text"
              @updateValue="value => handleInput(value, rowIndex, colIndex)"
              @insertExcelData="value => insertExcelData(value, rowIndex, colIndex)"
            />
            <div v-else class="cell-text" :style="{ minHeight: (cellMinHeight - 4) + 'px' }" v-html="formatText(cell.text)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce, isEqual } from 'lodash'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore } from '@/store'
import type { PPTElementOutline, TableCell, TableTheme } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import { KEYS } from '@/configs/hotkey'
import { getTextStyle, formatText } from './utils'
import useHideCells from './useHideCells'
import useSubThemeColor from './useSubThemeColor'

import CustomTextarea from './CustomTextarea.vue'

const props = withDefaults(defineProps<{
  data: TableCell[][]
  width: number
  cellMinHeight: number
  colWidths: number[]
  outline: PPTElementOutline
  theme?: TableTheme
  editable?: boolean
}>(), {
  editable: true,
})

const emit = defineEmits<{
  (event: 'change', payload: TableCell[][]): void
  (event: 'changeColWidths', payload: number[]): void
  (event: 'changeSelectedCells', payload: string[]): void
}>()

const { canvasScale } = storeToRefs(useMainStore())
    
const isStartSelect = ref(false)
const startCell = ref<number[]>([])
const endCell = ref<number[]>([])

const tableCells = computed<TableCell[][]>({
  get() {
    return props.data
  },
  set(newData) {
    emit('change', newData)
  },
})

// 主题辅助色
const theme = computed(() => props.theme)
const { subThemeColor } = useSubThemeColor(theme)

// 计算表格每一列的列宽和总宽度
const colSizeList = ref<number[]>([])
const totalWidth = computed(() => colSizeList.value.reduce((a, b) => a + b))
watch([
  () => props.colWidths,
  () => props.width,
], () => {
  colSizeList.value = props.colWidths.map(item => item * props.width)
}, { immediate: true })

// 清除全部单元格的选中状态
// 表格处于不可编辑状态时也需要清除
const removeSelectedCells = () => {
  startCell.value = []
  endCell.value = []
}

watch(() => props.editable, () => {
  if (!props.editable) removeSelectedCells()
})

// 用于拖拽列宽的操作节点位置
const dragLinePosition = computed(() => {
  const dragLinePosition: number[] = []
  for (let i = 1; i < colSizeList.value.length + 1; i++) {
    const pos = colSizeList.value.slice(0, i).reduce((a, b) => (a + b))
    dragLinePosition.push(pos)
  }
  return dragLinePosition
})

// 无效的单元格位置（被合并的单元格位置）集合
const cells = computed(() => props.data)
const { hideCells } = useHideCells(cells)

// 当前选中的单元格集合
const selectedCells = computed(() => {
  if (!startCell.value.length) return []
  const [startX, startY] = startCell.value

  if (!endCell.value.length) return [`${startX}_${startY}`]
  const [endX, endY] = endCell.value

  if (startX === endX && startY === endY) return [`${startX}_${startY}`]

  const selectedCells = []

  const minX = Math.min(startX, endX)
  const minY = Math.min(startY, endY)
  const maxX = Math.max(startX, endX)
  const maxY = Math.max(startY, endY)

  for (let i = 0; i < tableCells.value.length; i++) {
    const rowCells = tableCells.value[i]
    for (let j = 0; j < rowCells.length; j++) {
      if (i >= minX && i <= maxX && j >= minY && j <= maxY) selectedCells.push(`${i}_${j}`)
    }
  }
  return selectedCells
})

watch(selectedCells, (value, oldValue) => {
  if (isEqual(value, oldValue)) return
  emit('changeSelectedCells', selectedCells.value)
})

// 当前激活的单元格：当且仅当只有一个选中单元格时，该单元格为激活的单元格
const activedCell = computed(() => {
  if (selectedCells.value.length > 1) return null
  return selectedCells.value[0]
})

// 设置选中单元格状态（鼠标点击或拖选）
const handleMouseup = () => isStartSelect.value = false

const handleCellMousedown = (e: MouseEvent, rowIndex: number, colIndex: number) => {
  if (e.button === 0) {
    endCell.value = []
    isStartSelect.value = true
    startCell.value = [rowIndex, colIndex]
  }
}

const handleCellMouseenter = (rowIndex: number, colIndex: number) => {
  if (!isStartSelect.value) return
  endCell.value = [rowIndex, colIndex]
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseup)
})
onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseup)
})

// 判断某位置是否为无效单元格（被合并掉的位置）
const isHideCell = (rowIndex: number, colIndex: number) => hideCells.value.includes(`${rowIndex}_${colIndex}`)

// 选中指定的列
const selectCol = (index: number) => {
  const maxRow = tableCells.value.length - 1
  startCell.value = [0, index]
  endCell.value = [maxRow, index]
}

// 选中指定的行
const selectRow = (index: number) => {
  const maxCol = tableCells.value[index].length - 1
  startCell.value = [index, 0]
  endCell.value = [index, maxCol]
}

// 选中全部单元格
const selectAll = () => {
  const maxRow = tableCells.value.length - 1
  const maxCol = tableCells.value[maxRow].length - 1
  startCell.value = [0, 0]
  endCell.value = [maxRow, maxCol]
}

// 删除一行
const deleteRow = (rowIndex: number) => {
  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

  const targetCells = tableCells.value[rowIndex]
  const hideCellsPos = []
  for (let i = 0; i < targetCells.length; i++) {
    if (isHideCell(rowIndex, i)) hideCellsPos.push(i)
  }
  
  for (const pos of hideCellsPos) {
    for (let i = rowIndex; i >= 0; i--) {
      if (!isHideCell(i, pos)) {
        _tableCells[i][pos].rowspan = _tableCells[i][pos].rowspan - 1
        break
      }
    }
  }

  _tableCells.splice(rowIndex, 1)
  tableCells.value = _tableCells
}

// 删除一列
const deleteCol = (colIndex: number) => {
  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

  const hideCellsPos = []
  for (let i = 0; i < tableCells.value.length; i++) {
    if (isHideCell(i, colIndex)) hideCellsPos.push(i)
  }

  for (const pos of hideCellsPos) {
    for (let i = colIndex; i >= 0; i--) {
      if (!isHideCell(pos, i)) {
        _tableCells[pos][i].colspan = _tableCells[pos][i].colspan - 1
        break
      }
    }
  }

  tableCells.value = _tableCells.map(item => {
    item.splice(colIndex, 1)
    return item
  })
  colSizeList.value.splice(colIndex, 1)
  emit('changeColWidths', colSizeList.value)
}

// 插入一行
const insertRow = (rowIndex: number) => {
  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

  const rowCells: TableCell[] = []
  for (let i = 0; i < _tableCells[0].length; i++) {
    rowCells.push({
      colspan: 1,
      rowspan: 1,
      text: '',
      id: nanoid(10),
    })
  }

  _tableCells.splice(rowIndex, 0, rowCells)
  tableCells.value = _tableCells
}

// 插入一列
const insertCol = (colIndex: number) => {
  tableCells.value = tableCells.value.map(item => {
    const cell = {
      colspan: 1,
      rowspan: 1,
      text: '',
      id: nanoid(10),
    }
    item.splice(colIndex, 0, cell)
    return item
  })
  colSizeList.value.splice(colIndex, 0, 100)
  emit('changeColWidths', colSizeList.value)
}

// 填充指定的行/列数
const fillTable = (rowCount: number, colCount: number) => {
  let _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))
  const defaultCell = { colspan: 1, rowspan: 1, text: '' }
  
  if (rowCount) {
    const newRows = []
    for (let i = 0; i < rowCount; i++) {
      const rowCells: TableCell[] = []
      for (let j = 0; j < _tableCells[0].length; j++) {
        rowCells.push({
          ...defaultCell,
          id: nanoid(10),
        })
      }
      newRows.push(rowCells)
    }
    _tableCells = [..._tableCells, ...newRows]
  }
  if (colCount) {
    _tableCells = _tableCells.map(item => {
      const cells: TableCell[] = []
      for (let i = 0; i < colCount; i++) {
        const cell = {
          ...defaultCell,
          id: nanoid(10),
        }
        cells.push(cell)
      }
      return [...item, ...cells]
    })
    colSizeList.value = [...colSizeList.value, ...new Array(colCount).fill(100)]
    emit('changeColWidths', colSizeList.value)
  }

  tableCells.value = _tableCells
}

// 合并单元格
const mergeCells = () => {
  const [startX, startY] = startCell.value
  const [endX, endY] = endCell.value

  const minX = Math.min(startX, endX)
  const minY = Math.min(startY, endY)
  const maxX = Math.max(startX, endX)
  const maxY = Math.max(startY, endY)

  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))
  
  _tableCells[minX][minY].rowspan = maxX - minX + 1
  _tableCells[minX][minY].colspan = maxY - minY + 1

  tableCells.value = _tableCells
  removeSelectedCells()
}

// 拆分单元格
const splitCells = (rowIndex: number, colIndex: number) => {
  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))
  _tableCells[rowIndex][colIndex].rowspan = 1
  _tableCells[rowIndex][colIndex].colspan = 1

  tableCells.value = _tableCells
  removeSelectedCells()
}

// 鼠标拖拽调整列宽
const handleMousedownColHandler = (e: MouseEvent, colIndex: number) => {
  removeSelectedCells()
  let isMouseDown = true

  const originWidth = colSizeList.value[colIndex]
  const startPageX = e.pageX

  const minWidth = 50

  document.onmousemove = e => {
    if (!isMouseDown) return
    
    const moveX = (e.pageX - startPageX) / canvasScale.value
    const width = originWidth + moveX < minWidth ? minWidth : Math.round(originWidth + moveX)

    colSizeList.value[colIndex] = width
  }
  document.onmouseup = () => {
    isMouseDown = false
    document.onmousemove = null
    document.onmouseup = null

    emit('changeColWidths', colSizeList.value)
  }
}

// 清空选中单元格内的文字
const clearSelectedCellText = () => {
  const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

  for (let i = 0; i < _tableCells.length; i++) {
    for (let j = 0; j < _tableCells[i].length; j++) {
      if (selectedCells.value.includes(`${i}_${j}`)) {
        _tableCells[i][j].text = ''
      }
    }
  }
  tableCells.value = _tableCells
}

const focusActiveCell = () => {
  nextTick(() => {
    const textRef = document.querySelector('.cell-text.active') as HTMLInputElement
    if (textRef) textRef.focus()
  })
}

// 将焦点移动到下一个单元格
// 当前行右边有单元格时，焦点右移
// 当前行右边无单元格（已处在行末），且存在下一行时，焦点移动至下一行行首
// 当前行右边无单元格（已处在行末），且不存在下一行（已处在最后一行）时，新建一行并将焦点移动至下一行行首
const tabActiveCell = () => {
  const getNextCell = (i: number, j: number): [number, number] | null => {
    if (!tableCells.value[i]) return null
    if (!tableCells.value[i][j]) return getNextCell(i + 1, 0)
    if (isHideCell(i, j)) return getNextCell(i, j + 1)
    return [i, j]
  }

  endCell.value = []

  const nextRow = startCell.value[0]
  const nextCol = startCell.value[1] + 1

  const nextCell = getNextCell(nextRow, nextCol)
  if (!nextCell) {
    insertRow(nextRow + 1)
    startCell.value = [nextRow + 1, 0]
  }
  else startCell.value = nextCell

  // 移动焦点后自动聚焦文本
  focusActiveCell()
}

// 移动焦点（上下左右）
const moveActiveCell = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
  const rowIndex = +selectedCells.value[0].split('_')[0]
  const colIndex = +selectedCells.value[0].split('_')[1]

  const rowLen = tableCells.value.length
  const colLen = tableCells.value[0].length

  const getEffectivePos = (pos: [number, number]): [number, number] => {
    if (pos[0] < 0 || pos[1] < 0 || pos[0] > rowLen - 1 || pos[1] > colLen - 1) return [0, 0]

    const p = `${pos[0]}_${pos[1]}`
    if (!hideCells.value.includes(p)) return pos

    if (dir === 'UP') {
      return getEffectivePos([pos[0], pos[1] - 1])
    }
    if (dir === 'DOWN') {
      return getEffectivePos([pos[0], pos[1] - 1])
    }
    if (dir === 'LEFT') {
      return getEffectivePos([pos[0] - 1, pos[1]])
    }
    if (dir === 'RIGHT') {
      return getEffectivePos([pos[0] - 1, pos[1]])
    }

    return [0, 0]
  }

  if (dir === 'UP') {
    const _rowIndex = rowIndex - 1
    if (_rowIndex < 0) return
    endCell.value = []
    startCell.value = getEffectivePos([_rowIndex, colIndex])
  }
  else if (dir === 'DOWN') {
    const _rowIndex = rowIndex + 1
    if (_rowIndex > rowLen - 1) return
    endCell.value = []
    startCell.value = getEffectivePos([_rowIndex, colIndex])
  }
  else if (dir === 'LEFT') {
    const _colIndex = colIndex - 1
    if (_colIndex < 0) return
    endCell.value = []
    startCell.value = getEffectivePos([rowIndex, _colIndex])
  }
  else if (dir === 'RIGHT') {
    const _colIndex = colIndex + 1
    if (_colIndex > colLen - 1) return
    endCell.value = []
    startCell.value = getEffectivePos([rowIndex, _colIndex])
  }

  focusActiveCell()
}

// 获取光标位置
const getCaretPosition = (element: HTMLDivElement) => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)

    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)

    preCaretRange.setEnd(range.startContainer, range.startOffset)
    const start = preCaretRange.toString().length
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    const end = preCaretRange.toString().length

    const len = element.textContent?.length || 0

    return { start, end, len }
  }
  return null
}

// 表格快捷键监听
const keydownListener = (e: KeyboardEvent) => {
  if (!props.editable || !selectedCells.value.length) return

  const key = e.key.toUpperCase()
  if (selectedCells.value.length < 2) {
    if (key === KEYS.TAB) {
      e.preventDefault()
      tabActiveCell()
    }
    else if (e.ctrlKey && key === KEYS.UP) {
      e.preventDefault()
      const rowIndex = +selectedCells.value[0].split('_')[0]
      insertRow(rowIndex)
    }
    else if (e.ctrlKey && key === KEYS.DOWN) {
      e.preventDefault()
      const rowIndex = +selectedCells.value[0].split('_')[0]
      insertRow(rowIndex + 1)
    }
    else if (e.ctrlKey && key === KEYS.LEFT) {
      e.preventDefault()
      const colIndex = +selectedCells.value[0].split('_')[1]
      insertCol(colIndex)
    }
    else if (e.ctrlKey && key === KEYS.RIGHT) {
      e.preventDefault()
      const colIndex = +selectedCells.value[0].split('_')[1]
      insertCol(colIndex + 1)
    }
    else if (key === KEYS.UP) {
      const range = getCaretPosition(e.target as HTMLDivElement)
      if (range && range.start === range.end && range.start === 0) {
        moveActiveCell('UP')
      }
    }
    else if (key === KEYS.DOWN) {
      const range = getCaretPosition(e.target as HTMLDivElement)
      if (range && range.start === range.end && range.start === range.len) {
        moveActiveCell('DOWN')
      }
    }
    else if (key === KEYS.LEFT) {
      const range = getCaretPosition(e.target as HTMLDivElement)
      if (range && range.start === range.end && range.start === 0) {
        moveActiveCell('LEFT')
      }
    }
    else if (key === KEYS.RIGHT) {
      const range = getCaretPosition(e.target as HTMLDivElement)
      if (range && range.start === range.end && range.start === range.len) {
        moveActiveCell('RIGHT')
      }
    }
  }
  else if (key === KEYS.DELETE) {
    clearSelectedCellText()
  }
}

onMounted(() => {
  document.addEventListener('keydown', keydownListener)
})
onUnmounted(() => {
  document.removeEventListener('keydown', keydownListener)
})

// 单元格文字输入时更新表格数据
const handleInput = debounce(function(value, rowIndex, colIndex) {
  tableCells.value[rowIndex][colIndex].text = value
  emit('change', tableCells.value)
}, 300, { trailing: true })

// 插入来自Excel的数据，表格的行/列数不够时自动补足
const insertExcelData = (data: string[][], rowIndex: number, colIndex: number) => {
  const maxRow = data.length
  const maxCol = data[0].length

  let fillRowCount = 0
  let fillColCount = 0
  if (rowIndex + maxRow > tableCells.value.length) fillRowCount = rowIndex + maxRow - tableCells.value.length
  if (colIndex + maxCol > tableCells.value[0].length) fillColCount = colIndex + maxCol - tableCells.value[0].length
  if (fillRowCount || fillColCount) fillTable(fillRowCount, fillColCount)

  nextTick(() => {
    for (let i = 0; i < maxRow; i++) {
      for (let j = 0; j < maxCol; j++) {
        if (tableCells.value[rowIndex + i][colIndex + j]) {
          tableCells.value[rowIndex + i][colIndex + j].text = data[i][j]
        }
      }
    }
    emit('change', tableCells.value)
  })
}

// 获取有效的单元格（排除掉被合并的单元格）
const getEffectiveTableCells = () => {
  const effectiveTableCells = []

  for (let i = 0; i < tableCells.value.length; i++) {
    const rowCells = tableCells.value[i]
    const _rowCells = []
    for (let j = 0; j < rowCells.length; j++) {
      if (!isHideCell(i, j)) _rowCells.push(rowCells[j])
    }
    if (_rowCells.length) effectiveTableCells.push(_rowCells)
  }

  return effectiveTableCells
}

// 检查是否可以删除行和列：有效的行/列数大于1
const checkCanDeleteRowOrCol = () => {
  const effectiveTableCells = getEffectiveTableCells()
  const canDeleteRow = effectiveTableCells.length > 1
  const canDeleteCol = effectiveTableCells[0].length > 1

  return { canDeleteRow, canDeleteCol }
}

// 检查是否可以合并或拆分
// 必须多选才可以合并
// 必须单选且所选单元格为合并单元格才可以拆分
const checkCanMergeOrSplit = (rowIndex: number, colIndex: number) => {
  const isMultiSelected = selectedCells.value.length > 1
  const targetCell = tableCells.value[rowIndex][colIndex]

  const canMerge = isMultiSelected
  const canSplit = !isMultiSelected && (targetCell.rowspan > 1 || targetCell.colspan > 1)

  return { canMerge, canSplit }
}

const contextmenus = (el: HTMLElement): ContextmenuItem[] => {
  const cellIndex = el.dataset.cellIndex as string
  const rowIndex = +cellIndex.split('_')[0]
  const colIndex = +cellIndex.split('_')[1]

  if (!selectedCells.value.includes(`${rowIndex}_${colIndex}`)) {
    startCell.value = [rowIndex, colIndex]
    endCell.value = []
  }

  const { canMerge, canSplit } = checkCanMergeOrSplit(rowIndex, colIndex)
  const { canDeleteRow, canDeleteCol } = checkCanDeleteRowOrCol()

  return [
    {
      text: '插入列',
      children: [
        { text: '到左侧', handler: () => insertCol(colIndex) },
        { text: '到右侧', handler: () => insertCol(colIndex + 1) },
      ],
    },
    {
      text: '插入行',
      children: [
        { text: '到上方', handler: () => insertRow(rowIndex) },
        { text: '到下方', handler: () => insertRow(rowIndex + 1) },
      ],
    },
    {
      text: '删除列',
      disable: !canDeleteCol,
      handler: () => deleteCol(colIndex),
    },
    {
      text: '删除行',
      disable: !canDeleteRow,
      handler: () => deleteRow(rowIndex),
    },
    { divider: true },
    {
      text: '合并单元格',
      disable: !canMerge,
      handler: mergeCells,
    },
    {
      text: '取消合并单元格',
      disable: !canSplit,
      handler: () => splitCells(rowIndex, colIndex),
    },
    { divider: true },
    {
      text: '选中当前列',
      handler: () => selectCol(colIndex),
    },
    {
      text: '选中当前行',
      handler: () => selectRow(rowIndex),
    },
    {
      text: '选中全部单元格',
      handler: selectAll,
    },
  ]
}
</script>

<style lang="scss" scoped>
.editable-table {
  position: relative;
  user-select: none;
}
table {
  width: 100%;
  position: relative;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  border: 0;
  word-wrap: break-word;
  user-select: none;

  --themeColor: $themeColor;
  --subThemeColor1: $themeColor;
  --subThemeColor2: $themeColor;

  &.theme {
    background-color: #fff;

    tr:nth-child(2n) .cell {
      background-color: var(--subThemeColor1);
    }
    tr:nth-child(2n + 1) .cell {
      background-color: var(--subThemeColor2);
    }

    &.row-header {
      tr:first-child .cell {
        background-color: var(--themeColor);
      }
    }
    &.row-footer {
      tr:last-child .cell {
        background-color: var(--themeColor);
      }
    }
    &.col-header {
      tr .cell:first-child {
        background-color: var(--themeColor);
      }
    }
    &.col-footer {
      tr .cell:last-child {
        background-color: var(--themeColor);
      }
    }
  }

  .cell {
    position: relative;
    white-space: normal;
    word-wrap: break-word;
    vertical-align: middle;
    font-size: 14px;
    background-clip: padding-box;
    cursor: default;

    &.selected::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba($color: #666, $alpha: .4);
    }
  }

  .cell-text {
    padding: 5px;
    line-height: 1.5;
    user-select: none;
    cursor: text;

    &.active {
      user-select: text;
    }
  }
}

.drag-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: $themeColor;
  margin-left: -1px;
  opacity: 0;
  z-index: 2;
  cursor: col-resize;
}
</style>
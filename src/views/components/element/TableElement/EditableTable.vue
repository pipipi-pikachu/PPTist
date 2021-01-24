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
        :style="{
          left: pos + 'px',
        }"
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
        <tr
          v-for="(rowCells, rowIndex) in tableCells" 
          :key="rowIndex"
        >
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
            v-contextmenu="el => contextmenus(el)"
          >
            <CustomTextarea 
              class="cell-text" 
              :class="{ 'active': activedCell === `${rowIndex}_${colIndex}` }"
              :contenteditable="activedCell === `${rowIndex}_${colIndex}` ? 'plaintext-only' : false"
              v-model="cell.text"
              @update:modelValue="handleInput()"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import tinycolor from 'tinycolor2'
import { PPTElementOutline, TableCell, TableCellStyle, TableTheme } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { KEYS } from '@/configs/hotkey'
import { createRandomCode } from '@/utils/common'

import CustomTextarea from './CustomTextarea.vue'
import { useStore } from 'vuex'
import { State } from '@/store'

export default defineComponent({
  name: 'editable-table',
  components: {
    CustomTextarea,
  },
  props: {
    data: {
      type: Array as PropType<TableCell[][]>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    colWidths: {
      type: Array as PropType<number[]>,
      required: true,
    },
    outline: {
      type: Object as PropType<PPTElementOutline>,
      required: true,
    },
    theme: {
      type: Object as PropType<TableTheme>,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    const subThemeColor = ref(['', ''])
    watch(() => props.theme, () => {
      if(props.theme) {
        const rgba = tinycolor(props.theme.color).toRgb()
        const subRgba1 = { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a * 0.3 }
        const subRgba2 = { r: rgba.r, g: rgba.g, b: rgba.b, a: rgba.a * 0.1 }
        subThemeColor.value = [
          `rgba(${[subRgba1.r, subRgba1.g, subRgba1.b, subRgba1.a].join(',')})`,
          `rgba(${[subRgba2.r, subRgba2.g, subRgba2.b, subRgba2.a].join(',')})`,
        ]
      }
    }, { immediate: true })

    const tableCells = computed<TableCell[][]>({
      get() {
        return props.data
      },
      set(newData) {
        emit('change', newData)
      },
    })

    const colSizeList = ref<number[]>([])
    const totalWidth = computed(() => colSizeList.value.reduce((a, b) => a + b))
    watch([
      () => props.colWidths,
      () => props.width,
    ], () => {
      colSizeList.value = props.colWidths.map(item => item * props.width)
    }, { immediate: true })
    
    const isStartSelect = ref(false)
    const startCell = ref<number[]>([])
    const endCell = ref<number[]>([])
    
    const removeSelectedCells = () => {
      startCell.value = []
      endCell.value = []
    }

    watch(() => props.editable, () => {
      if(!props.editable) removeSelectedCells()
    })

    const dragLinePosition = computed(() => {
      const dragLinePosition: number[] = []
      for(let i = 1; i < colSizeList.value.length + 1; i++) {
        const pos = colSizeList.value.slice(0, i).reduce((a, b) => (a + b))
        dragLinePosition.push(pos)
      }
      return dragLinePosition
    })

    const hideCells = computed(() => {
      const hideCells = []
      
      for(let i = 0; i < tableCells.value.length; i++) {
        const rowCells = tableCells.value[i]

        for(let j = 0; j < rowCells.length; j++) {
          const cell = rowCells[j]
          
          if(cell.colspan > 1 || cell.rowspan > 1) {
            for(let row = i; row < i + cell.rowspan; row++) {
              for(let col = row === i ? j + 1 : j; col < j + cell.colspan; col++) {
                hideCells.push(`${row}_${col}`)
              }
            }
          }
        }
      }
      return hideCells
    })

    const selectedCells = computed(() => {
      if(!startCell.value.length) return []
      const [startX, startY] = startCell.value

      if(!endCell.value.length) return [`${startX}_${startY}`]
      const [endX, endY] = endCell.value

      if(startX === endX && startY === endY) return [`${startX}_${startY}`]

      const selectedCells = []

      const minX = Math.min(startX, endX)
      const minY = Math.min(startY, endY)
      const maxX = Math.max(startX, endX)
      const maxY = Math.max(startY, endY)

      for(let i = 0; i < tableCells.value.length; i++) {
        const rowCells = tableCells.value[i]
        for(let j = 0; j < rowCells.length; j++) {
          if(i >= minX && i <= maxX && j >= minY && j <= maxY) selectedCells.push(`${i}_${j}`)
        }
      }
      return selectedCells
    })

    watch(selectedCells, () => {
      emit('changeSelectedCells', selectedCells.value)
    })

    const activedCell = computed(() => {
      if(selectedCells.value.length > 1) return null
      return selectedCells.value[0]
    })

    const selectedRange = computed(() => {
      if(!startCell.value.length) return null
      const [startX, startY] = startCell.value

      if(!endCell.value.length) return { row: [startX, startX], col: [startY, startY] }
      const [endX, endY] = endCell.value

      if(startX === endX && startY === endY) return { row: [startX, startX], col: [startY, startY] }

      const minX = Math.min(startX, endX)
      const minY = Math.min(startY, endY)
      const maxX = Math.max(startX, endX)
      const maxY = Math.max(startY, endY)

      return {
        row: [minX, maxX],
        col: [minY, maxY],
      }
    })

    const handleMouseup = () => isStartSelect.value = false

    const handleCellMousedown = (e: MouseEvent, rowIndex: number, colIndex: number) => {
      if(e.button === 0) {
        endCell.value = []
        isStartSelect.value = true
        startCell.value = [rowIndex, colIndex]
      }
    }

    const handleCellMouseenter = (rowIndex: number, colIndex: number) => {
      if(!isStartSelect.value) return
      endCell.value = [rowIndex, colIndex]
    }

    onMounted(() => {
      document.addEventListener('mouseup', handleMouseup)
    })
    onUnmounted(() => {
      document.removeEventListener('mouseup', handleMouseup)
    })

    const isHideCell = (rowIndex: number, colIndex: number) => hideCells.value.includes(`${rowIndex}_${colIndex}`)

    const selectCol = (index: number) => {
      const maxRow = tableCells.value.length - 1
      startCell.value = [0, index]
      endCell.value = [maxRow, index]
    }

    const selectRow = (index: number) => {
      const maxCol = tableCells.value[index].length - 1
      startCell.value = [index, 0]
      endCell.value = [index, maxCol]
    }

    const selectAll = () => {
      const maxRow = tableCells.value.length - 1
      const maxCol = tableCells.value[maxRow].length - 1
      startCell.value = [0, 0]
      endCell.value = [maxRow, maxCol]
    }

    const deleteRow = (rowIndex: number) => {
      const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

      const targetCells = tableCells.value[rowIndex]
      const hideCellsPos = []
      for(let i = 0; i < targetCells.length; i++) {
        if(isHideCell(rowIndex, i)) hideCellsPos.push(i)
      }
      
      for(const pos of hideCellsPos) {
        for(let i = rowIndex; i >= 0; i--) {
          if(!isHideCell(i, pos)) {
            _tableCells[i][pos].rowspan = _tableCells[i][pos].rowspan - 1
            break
          }
        }
      }

      _tableCells.splice(rowIndex, 1)
      tableCells.value = _tableCells
    }

    const deleteCol = (colIndex: number) => {
      const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

      const hideCellsPos = []
      for(let i = 0; i < tableCells.value.length; i++) {
        if(isHideCell(i, colIndex)) hideCellsPos.push(i)
      }

      for(const pos of hideCellsPos) {
        for(let i = colIndex; i >= 0; i--) {
          if(!isHideCell(pos, i)) {
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
    
    const insertRow = (rowIndex: number) => {
      const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

      const rowCells: TableCell[] = []
      for(let i = 0; i < _tableCells[0].length; i++) {
        rowCells.push({
          colspan: 1,
          rowspan: 1,
          text: '',
          id: createRandomCode(),
        })
      }

      _tableCells.splice(rowIndex, 0, rowCells)
      tableCells.value = _tableCells
    }

    const insertCol = (colIndex: number) => {
      tableCells.value = tableCells.value.map(item => {
        const cell = {
          colspan: 1,
          rowspan: 1,
          text: '',
          id: createRandomCode(),
        }
        item.splice(colIndex, 0, cell)
        return item
      })
      colSizeList.value.splice(colIndex, 0, 100)
      emit('changeColWidths', colSizeList.value)
    }
    
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

    const splitCells = (rowIndex: number, colIndex: number) => {
      const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))
      _tableCells[rowIndex][colIndex].rowspan = 1
      _tableCells[rowIndex][colIndex].colspan = 1

      tableCells.value = _tableCells
      removeSelectedCells()
    }

    const handleMousedownColHandler = (e: MouseEvent, colIndex: number) => {
      removeSelectedCells()
      let isMouseDown = true

      const originWidth = colSizeList.value[colIndex]
      const startPageX = e.pageX

      const minWidth = 50

      document.onmousemove = e => {
        if(!isMouseDown) return
        
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

    const clearSelectedCellText = () => {
      const _tableCells: TableCell[][] = JSON.parse(JSON.stringify(tableCells.value))

      for(let i = 0; i < _tableCells.length; i++) {
        for(let j = 0; j < _tableCells[i].length; j++) {
          if(selectedCells.value.includes(`${i}_${j}`)) {
            _tableCells[i][j].text = ''
          }
        }
      }
      tableCells.value = _tableCells
    }

    const tabActiveCell = () => {
      const getNextCell = (i: number, j: number): [number, number] | null => {
        if(!tableCells.value[i]) return null
        if(!tableCells.value[i][j]) return getNextCell(i + 1, 0)
        if(isHideCell(i, j)) return getNextCell(i, j + 1)
        return [i, j]
      }

      endCell.value = []

      const nextRow = startCell.value[0]
      const nextCol = startCell.value[1] + 1

      const nextCell = getNextCell(nextRow, nextCol)
      if(!nextCell) {
        insertRow(nextRow + 1)
        startCell.value = [nextRow + 1, 0]
      }
      else startCell.value = nextCell

      nextTick(() => {
        const textRef = document.querySelector('.cell-text.active') as HTMLInputElement
        if(textRef) textRef.focus()
      })
    }

    const keydownListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if(selectedCells.value.length < 2) {
        if(key === KEYS.TAB) {
          e.preventDefault()
          tabActiveCell()
        }
      }
      else if(key === KEYS.DELETE) {
        clearSelectedCellText()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', keydownListener)
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', keydownListener)
    })

    const getTextStyle = (style?: TableCellStyle) => {
      if(!style) return {}
      const {
        bold,
        em,
        underline,
        strikethrough,
        color,
        backcolor,
        fontsize,
        fontname,
        align,
      } = style
      
      return {
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: em ? 'italic' : 'normal',
        textDecoration: `${underline ? 'underline' : ''} ${strikethrough ? 'line-through' : ''}`,
        color: color || '#000',
        backgroundColor: backcolor || '',
        fontSize: fontsize || '14px',
        fontFamily: fontname || '微软雅黑',
        textAlign: align || 'left',
      }
    }

    const handleInput = debounce(function() {
      emit('change', tableCells.value)
    }, 300, { trailing: true })

    const getEffectiveTableCells = () => {
      const effectiveTableCells = []

      for(let i = 0; i < tableCells.value.length; i++) {
        const rowCells = tableCells.value[i]
        const _rowCells = []
        for(let j = 0; j < rowCells.length; j++) {
          if(!isHideCell(i, j)) _rowCells.push(rowCells[j])
        }
        if(_rowCells.length) effectiveTableCells.push(_rowCells)
      }

      return effectiveTableCells
    }

    const contextmenus = (el: HTMLElement): ContextmenuItem[] => {
      const cellIndex = el.dataset.cellIndex as string
      const rowIndex = +cellIndex.split('_')[0]
      const colIndex = +cellIndex.split('_')[1]

      if(!selectedCells.value.includes(`${rowIndex}_${colIndex}`)) {
        startCell.value = [rowIndex, colIndex]
        endCell.value = []
      }

      const isMultiSelected = selectedCells.value.length > 1

      const targetCell = tableCells.value[rowIndex][colIndex]
      const canSplit = targetCell.rowspan > 1 || targetCell.colspan > 1

      const effectiveTableCells = getEffectiveTableCells()
      const canDeleteRow = effectiveTableCells.length > 1
      const canDeleteCol = effectiveTableCells[0].length > 1

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
          disable: !isMultiSelected,
          handler: mergeCells,
        },
        {
          text: '取消合并单元格',
          disable: isMultiSelected || !canSplit,
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

    return {
      getTextStyle,
      dragLinePosition,
      tableCells,
      colSizeList,
      totalWidth,
      hideCells,
      selectedCells,
      activedCell,
      selectedRange,
      handleCellMousedown,
      handleCellMouseenter,
      selectCol,
      selectRow,
      handleMousedownColHandler,
      contextmenus,
      handleInput,
      subThemeColor,
    }
  },
})
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

  tr {
    height: 36px;
  }

  .cell {
    position: relative;
    white-space: normal;
    word-wrap: break-word;
    vertical-align: middle;
    font-size: 14px;
    cursor: default;

    &.selected::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba($color: $themeColor, $alpha: .3);
    }
  }

  .cell-text {
    min-height: 32px;
    padding: 5px;
    border: 0;
    outline: 0;
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

  &:hover {
    opacity: 1;
  }
}
</style>
<template>
  <div class="chart-data-editor">
    <div class="editor-content">
      <div class="range-box">
        <div 
          class="temp-range" 
          :style="{
            width: tempRangeSize.width + 'px',
            height: tempRangeSize.height + 'px',
          }"
        ></div>
        <div 
          :class="['range-line', line.type]" 
          v-for="line in rangeLines" 
          :key="line.type" 
          :style="line.style"
        ></div>
        <div 
          class="resizable" 
          :style="resizablePointStyle"
          @mousedown.stop="changeSelectRange($event)"
        ></div>
      </div>
      <table>
        <tbody>
          <tr v-for="rowIndex in 30" :key="rowIndex">
            <td v-for="colIndex in 7" :key="colIndex" :class="{ 'head': colIndex === 1 && rowIndex <= selectedRange[1] }">
              <input 
                :class="['item', { 'selected': rowIndex <= selectedRange[1] && colIndex <= selectedRange[0] }]"
                :id="`cell-${rowIndex - 1}-${colIndex - 1}`"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="btns">
      <Button class="btn" @click="closeEditor()">取消</Button>
      <Button type="primary" class="btn" @click="getTableData()">确认</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { ChartData } from '@/types/slides'
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'

const CELL_WIDTH = 100
const CELL_HEIGHT = 32

export default defineComponent({
  name: 'chart-data-editor',
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    }
  },
  setup(props, { emit }) {
    const selectedRange = ref([0, 0])
    const tempRangeSize = ref({ width: 0, height: 0 })

    const rangeLines = computed(() => {
      const width = selectedRange.value[0] * CELL_WIDTH
      const height = selectedRange.value[1] * CELL_HEIGHT
      return [
        { type: 't', style: {width: width + 'px'} },
        { type: 'b', style: {top: height + 'px', width: width + 'px'} },
        { type: 'l', style: {height: height + 'px'} },
        { type: 'r', style: {left: width + 'px', height: height + 'px'} },
      ]
    })

    const resizablePointStyle = computed(() => {
      const width = selectedRange.value[0] * CELL_WIDTH
      const height = selectedRange.value[1] * CELL_HEIGHT
      return { left: width + 'px', top: height + 'px' }
    })

    const initData = () => {
      const _data: string[][] = []

      const { labels, series } = props.data
      const rowCount = labels.length
      const colCount = series.length

      for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = [labels[rowIndex]]
        for(let colIndex = 0; colIndex < colCount; colIndex++) {
          row.push(series[colIndex][rowIndex] + '')
        }
        _data.push(row)
      }

      for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for(let colIndex = 0; colIndex < colCount + 1; colIndex++) {
          const inputRef = document.querySelector(`#cell-${rowIndex}-${colIndex}`) as HTMLInputElement
          if(!inputRef) continue
          inputRef.value = _data[rowIndex][colIndex] + ''
        }
      }

      selectedRange.value = [colCount + 1, rowCount]
    }

    onMounted(initData)

    const getTableData = () => {
      const [col, row] = selectedRange.value

      const labels: string[] = []
      const series: number[][] = []

      for(let rowIndex = 0; rowIndex < row; rowIndex++) {
        let labelsItem = `类别${rowIndex + 1}`
        const labelInputRef = document.querySelector(`#cell-${rowIndex}-0`) as HTMLInputElement
        if(labelInputRef && labelInputRef.value) labelsItem = labelInputRef.value
        labels.push(labelsItem)
      }

      for(let colIndex = 1; colIndex < col; colIndex++) {
        const seriesItem = []
        for(let rowIndex = 0; rowIndex < row; rowIndex++) {
          const valueInputRef = document.querySelector(`#cell-${rowIndex}-${colIndex}`) as HTMLInputElement
          let value = 0
          if(valueInputRef && valueInputRef.value && !!(+valueInputRef.value)) {
            value = +valueInputRef.value
          }
          seriesItem.push(value)
        }
        series.push(seriesItem)
      }
      const data = { labels, series }
      emit('save', data)
    }

    const closeEditor = () => emit('close')

    const changeSelectRange = (e: MouseEvent) => {
      let isMouseDown = true

      const startPageX = e.pageX
      const startPageY = e.pageY

      const originWidth = selectedRange.value[0] * CELL_WIDTH
      const originHeight = selectedRange.value[1] * CELL_HEIGHT

      document.onmousemove = e => {
        if(!isMouseDown) return

        const currentPageX = e.pageX
        const currentPageY = e.pageY

        const x = currentPageX - startPageX
        const y = currentPageY - startPageY

        let width = originWidth + x
        let height = originHeight + y

        if(width % CELL_WIDTH > CELL_WIDTH * 0.5) width = width + (CELL_WIDTH - width % CELL_WIDTH)
        if(height % CELL_HEIGHT > CELL_HEIGHT * 0.5) height = height + (CELL_HEIGHT - height % CELL_HEIGHT)

        tempRangeSize.value = { width, height }
      }

      document.onmouseup = () => {
        isMouseDown = false
        document.onmousemove = null
        document.onmouseup = null

        const { width, height } = tempRangeSize.value

        let row = Math.round(height / CELL_HEIGHT)
        let col = Math.round(width / CELL_WIDTH)

        if(row < 3) row = 3
        if(col < 2) col = 2

        selectedRange.value = [col, row]
        tempRangeSize.value = { width: 0, height: 0 }
      }
    }

    return {
      tempRangeSize,
      rangeLines,
      resizablePointStyle,
      changeSelectRange,
      selectedRange,
      getTableData,
      closeEditor,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart-data-editor {
  width: 600px;
  position: relative;
}
.editor-content {
  width: 100%;
  height: 360px;
  overflow: overlay;
  position: relative;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.range-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  user-select: none;
}
.temp-range {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: rgba($color: #888, $alpha: .3);
}
.range-line {
  position: absolute;
  width: 0;
  height: 0;
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
  width: 8px;
  height: 8px;
  left: 0;
  top: 0;
  margin: -4px 0 0 -4px;
  background-color: $themeColor;
  cursor: nwse-resize;
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
  text-align: right;

  .btn {
    margin-left: 10px;
  }
}
</style>
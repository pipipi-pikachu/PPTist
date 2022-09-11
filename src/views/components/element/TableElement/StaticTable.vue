<template>
  <div 
    class="static-table"
    :style="{ width: totalWidth + 'px' }"
  >
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
        <tr v-for="(rowCells, rowIndex) in data" :key="rowIndex" :style="{ height: cellMinHeight + 'px' }">
          <td 
            class="cell"
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
            v-show="!hideCells.includes(`${rowIndex}_${colIndex}`)"
          >
            <div class="cell-text" :style="{ minHeight: (cellMinHeight - 4) + 'px' }" v-html="formatText(cell.text)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue'
import { PPTElementOutline, TableCell, TableTheme } from '@/types/slides'
import { getTextStyle, formatText } from './utils'
import useHideCells from './useHideCells'
import useSubThemeColor from './useSubThemeColor'

const props = defineProps({
  data: {
    type: Array as PropType<TableCell[][]>,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  cellMinHeight: {
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
})

const colSizeList = ref<number[]>([])
const totalWidth = computed(() => colSizeList.value.reduce((a, b) => a + b))

watch([
  () => props.colWidths,
  () => props.width,
], () => {
  colSizeList.value = props.colWidths.map(item => item * props.width)
}, { immediate: true })

const cells = computed(() => props.data)
const { hideCells } = useHideCells(cells)

const theme = computed(() => props.theme)
const { subThemeColor } = useSubThemeColor(theme)
</script>

<style lang="scss" scoped>
.static-table {
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
  }

  .cell-text {
    padding: 5px;
    line-height: 1.5;
  }
}
</style>
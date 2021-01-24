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
        <tr
          v-for="(rowCells, rowIndex) in data" 
          :key="rowIndex"
        >
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
            <div class="cell-text" v-html="cell.text" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import tinycolor from 'tinycolor2'
import { PPTElementOutline, TableCell, TableCellStyle, TableTheme } from '@/types/slides'

export default defineComponent({
  name: 'static-table',
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
  setup(props) {
    const colSizeList = ref<number[]>([])
    const totalWidth = computed(() => colSizeList.value.reduce((a, b) => a + b))

    watch([
      () => props.colWidths,
      () => props.width,
    ], () => {
      colSizeList.value = props.colWidths.map(item => item * props.width)
    }, { immediate: true })

    const hideCells = computed(() => {
      const hideCells = []
      
      for(let i = 0; i < props.data.length; i++) {
        const rowCells = props.data[i]

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

    return {
      colSizeList,
      totalWidth,
      hideCells,
      getTextStyle,
      subThemeColor,
    }
  },
})
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
  }

  .cell-text {
    min-height: 32px;
    padding: 5px;
    border: 0;
    outline: 0;
    line-height: 1.5;
    font-size: 14px;
    user-select: none;
  }
}
</style>
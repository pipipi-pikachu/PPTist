<template>
  <div class="table-style-panel">
    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
        :value="textAttrs.fontname"
        @change="value => updateTextAttrs({ fontname: value })"
      >
        <template #suffixIcon><IconFontSize /></template>
        <SelectOptGroup label="系统字体">
          <SelectOption v-for="font in availableFonts" :key="font.value" :value="font.value">
            <span :style="{ fontFamily: font.value }">{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup label="在线字体">
          <SelectOption v-for="font in webFonts" :key="font.value" :value="font.value">
            <span>{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
      </Select>
      <Select
        style="flex: 2;"
        :value="textAttrs.fontsize"
        @change="value => updateTextAttrs({ fontsize: value })"
      >
        <template #suffixIcon><IconAddText /></template>
        <SelectOption v-for="fontsize in fontSizeOptions" :key="fontsize" :value="fontsize">
          {{fontsize}}
        </SelectOption>
      </Select>
    </InputGroup>

    <ButtonGroup class="row">
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="textAttrs.color"
            @update:modelValue="value => updateTextAttrs({ color: value })"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文字颜色">
          <Button class="text-color-btn" style="flex: 1;">
            <IconText />
            <div class="text-color-block" :style="{ backgroundColor: textAttrs.color }"></div>
          </Button>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="textAttrs.backcolor"
            @update:modelValue="value => updateTextAttrs({ backcolor: value })"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="单元格填充">
          <Button class="text-color-btn" style="flex: 1;">
            <IconFill />
            <div class="text-color-block" :style="{ backgroundColor: textAttrs.backcolor }"></div>
          </Button>
        </Tooltip>
      </Popover>
    </ButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="加粗">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.bold"
          @click="updateTextAttrs({ bold: !textAttrs.bold })"
        ><IconTextBold /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="斜体">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.em"
          @click="updateTextAttrs({ em: !textAttrs.em })"
        ><IconTextItalic /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下划线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.underline"
          @click="updateTextAttrs({ underline: !textAttrs.underline })"
        ><IconTextUnderline /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.strikethrough"
          @click="updateTextAttrs({ strikethrough: !textAttrs.strikethrough })"
        ><IconStrikethrough /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="textAttrs.align"
      @change="e => updateTextAttrs({ align: e.target.value })"
    >
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <RadioButton value="left" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="居中">
        <RadioButton value="center" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <RadioButton value="right" style="flex: 1;"><IconAlignTextRight /></RadioButton>
      </Tooltip>
    </RadioGroup>

    <Divider />

    <ElementOutline :fixed="true" />

    <Divider />

    <div class="row">
      <div style="flex: 2;">行数：</div>
      <InputNumber 
        :min="minRowCount"
        :max="20"
        v-model:value="rowCount" 
        @pressEnter="e => setTableRow(e)"
        @blur="e => setTableRow(e)"
        style="flex: 3;" 
      />
    </div>
    <div class="row">
      <div style="flex: 2;">列数：</div>
      <InputNumber 
        :min="minColCount"
        :max="20"
        v-model:value="colCount" 
        @pressEnter="e => setTableCol(e)"
        @blur="e => setTableCol(e)"
        style="flex: 3;" 
      />
    </div>

    <Divider />

    <div class="row theme-switch">
      <div style="flex: 2;">启用主题表格：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="hasTheme" 
          @change="checked => toggleTheme(checked)" 
        />
      </div>
    </div>

    <template v-if="hasTheme">
      <div class="row">
        <Checkbox 
          @change="e => updateTheme({ rowHeader: e.target.checked })" 
          :checked="theme.rowHeader" 
          style="flex: 1;"
        >标题行</Checkbox>
        <Checkbox 
          @change="e => updateTheme({ rowFooter: e.target.checked })" 
          :checked="theme.rowFooter" 
          style="flex: 1;"
        >汇总行</Checkbox>
      </div>
      <div class="row">
        <Checkbox 
          @change="e => updateTheme({ colHeader: e.target.checked })" 
          :checked="theme.colHeader" 
          style="flex: 1;"
        >第一列</Checkbox>
        <Checkbox 
          @change="e => updateTheme({ colFooter: e.target.checked })" 
          :checked="theme.colFooter" 
          style="flex: 1;"
        >最后一列</Checkbox>
      </div>
      <div class="row">
        <div style="flex: 2;">主题颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="theme.color"
              @update:modelValue="value => updateTheme({ color: value })"
            />
          </template>
          <ColorButton :color="theme.color" style="flex: 3;" />
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTTableElement, TableCell, TableCellStyle, TableTheme } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { createRandomCode } from '@/utils/common'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import { message } from 'ant-design-vue'

import ElementOutline from '../common/ElementOutline.vue'
import ColorButton from '../common/ColorButton.vue'

const webFonts = WEB_FONTS

export default defineComponent({
  name: 'table-style-panel',
  components: {
    ElementOutline,
    ColorButton,
  },
  setup() {
    const store = useStore()
    const handleElement = computed<PPTTableElement>(() => store.getters.handleElement)
    
    const availableFonts = computed(() => store.state.availableFonts)
    const fontSizeOptions = [
      '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
    ]

    const textAttrs = ref({
      bold: false,
      em: false,
      underline: false,
      strikethrough: false,
      color: '#000',
      backcolor: '#000',
      fontsize: '12px',
      fontname: '微软雅黑',
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

    const selectedCells = ref<string[]>([])

    // 更新当前选中单元格的文本样式状态
    const updateTextAttrState = () => {
      if (!handleElement.value) return

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
          backcolor: '#000',
          fontsize: '12px',
          fontname: '微软雅黑',
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
          backcolor: style.backcolor || '#000',
          fontsize: style.fontsize || '12px',
          fontname: style.fontname || '微软雅黑',
          align: style.align || 'left',
        }
      }
    }

    // 监听并更新当前选中的单元格
    const updateSelectedCells = (cells: string[]) => {
      selectedCells.value = cells
      updateTextAttrState()
    }

    emitter.on(EmitterEvents.UPDATE_TABLE_SELECTED_CELL, cells => updateSelectedCells(cells))
    onUnmounted(() => {
      emitter.off(EmitterEvents.UPDATE_TABLE_SELECTED_CELL, cells => updateSelectedCells(cells))
    })

    // 设置单元格内容文本样式
    const updateTextAttrs = (textAttrProp: Partial<TableCellStyle>) => {
      const data: TableCell[][] = JSON.parse(JSON.stringify(handleElement.value.data))

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (!selectedCells.value.length || selectedCells.value.includes(`${i}_${j}`)) {
            const style = data[i][j].style || {}
            data[i][j].style = { ...style, ...textAttrProp }
          }
        }
      }
      const props = { data }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })

      addHistorySnapshot()
      updateTextAttrState()
    }

    // 更新表格主题：主题色、标题行、汇总行、第一列、最后一列
    const updateTheme = (themeProp: Partial<TableTheme>) => {
      const currentTheme = theme.value || {}
      const props = { theme: { ...currentTheme, ...themeProp } }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 开启/关闭表格主题
    const toggleTheme = (checked: boolean) => {
      if (checked) {
        const props = {
          theme: {
            color: '#d14424',
            rowHeader: true,
            rowFooter: false,
            colHeader: false,
            colFooter: false,
          }
        }
        store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      }
      else {
        store.commit(MutationTypes.REMOVE_ELEMENT_PROPS, { id: handleElement.value.id, propName: 'theme' })
      }
      addHistorySnapshot()
    }

    // 设置表格行数（只能增加）
    const setTableRow = (e: KeyboardEvent) => {
      const value = +(e.target as HTMLInputElement).value
      const rowCount = handleElement.value.data.length

      if (value === rowCount) return
      if (value < rowCount) return message.warning('设置行数不能少于当前值')

      const rowCells: TableCell[] = new Array(colCount.value).fill({ id: createRandomCode(), colspan: 1, rowspan: 1, text: '' })
      const newTableCells: TableCell[][] = new Array(value - rowCount).fill(rowCells)

      const tableCells: TableCell[][] = JSON.parse(JSON.stringify(handleElement.value.data))
      tableCells.push(...newTableCells)

      const props = { data: tableCells }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }


    // 设置表格列数（只能增加）
    const setTableCol = (e: KeyboardEvent) => {
      const value = +(e.target as HTMLInputElement).value
      const colCount = handleElement.value.data[0].length

      if (value === colCount) return
      if (value < colCount) return message.warning('设置列数不能少于当前值')

      const tableCells = handleElement.value.data.map(item => {
        const cells: TableCell[] = new Array(value - colCount).fill({ id: createRandomCode(), colspan: 1, rowspan: 1, text: '' })
        item.push(...cells)
        return item
      })

      const colSizeList = handleElement.value.colWidths.map(item => item * handleElement.value.width)
      const newColSizeList = new Array(value - colCount).fill(100)
      colSizeList.push(...newColSizeList)

      const width = handleElement.value.width + 100 * (value - colCount)
      const colWidths = colSizeList.map(item => item / width)

      const props = {
        width,
        data: tableCells,
        colWidths,
      }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })

      addHistorySnapshot()
    }

    return {
      handleElement,
      availableFonts,
      fontSizeOptions,
      textAttrs,
      updateTextAttrs,
      theme,
      rowCount,
      colCount,
      minRowCount,
      minColCount,
      hasTheme,
      toggleTheme,
      updateTheme,
      setTableRow,
      setTableCol,
      webFonts,
    }
  },
})
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
.text-color-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-color-block {
  width: 16px;
  height: 3px;
  margin-top: 1px;
}
</style>
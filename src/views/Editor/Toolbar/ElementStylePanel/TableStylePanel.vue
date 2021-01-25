<template>
  <div class="table-style-panel">
    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
        :value="textAttrs.fontname"
        @change="value => emitUpdateTextAttrCommand({ fontname: value })"
      >
        <template #suffixIcon><IconFontSize /></template>
        <SelectOption v-for="font in availableFonts" :key="font.en" :value="font.en">
          <span :style="{ fontFamily: font.en }">{{font.zh}}</span>
        </SelectOption>
      </Select>
      <Select
        style="flex: 2;"
        :value="textAttrs.fontsize"
        @change="value => emitUpdateTextAttrCommand({ fontsize: value })"
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
            @update:modelValue="value => emitUpdateTextAttrCommand({ color: value })"
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
            @update:modelValue="value => emitUpdateTextAttrCommand({ backcolor: value })"
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
          @click="emitUpdateTextAttrCommand({ bold: !textAttrs.bold })"
        ><IconTextBold /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="斜体">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.em"
          @click="emitUpdateTextAttrCommand({ em: !textAttrs.em })"
        ><IconTextItalic /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下划线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.underline"
          @click="emitUpdateTextAttrCommand({ underline: !textAttrs.underline })"
        ><IconTextUnderline /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="textAttrs.strikethrough"
          @click="emitUpdateTextAttrCommand({ strikethrough: !textAttrs.strikethrough })"
        ><IconStrikethrough /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="textAttrs.align"
      @change="e => emitUpdateTextAttrCommand({ align: e.target.value })"
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
      <Button style="flex: 5;">上方插入行</Button>
      <div style="flex: 1;"></div>
      <Button style="flex: 5;">下方插入行</Button>
    </div>
    <div class="row">
      <Button style="flex: 5;">左侧插入列</Button>
      <div style="flex: 1;"></div>
      <Button style="flex: 5;">右侧插入列</Button>
    </div>
    <div class="row">
      <Button style="flex: 5;">删除行</Button>
      <div style="flex: 1;"></div>
      <Button style="flex: 5;">删除列</Button>
    </div>
    <div class="row">
      <Button style="flex: 5;">合并单元格</Button>
      <div style="flex: 1;"></div>
      <Button style="flex: 5;">拆分单元格</Button>
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
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTTableElement, TableCellStyle, TableTheme } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'table-style-panel',
  components: {
    ElementOutline,
    ColorButton,
  },
  setup() {
    const store = useStore<State>()
    const handleElement = computed<PPTTableElement>(() => store.getters.handleElement)

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

    watch(handleElement, () => {
      if(!handleElement.value) return
      
      theme.value = handleElement.value.theme
      hasTheme.value = !!theme.value
    }, { deep: true, immediate: true })

    const selectedCells = ref<string[]>([])

    const updateTextAttrs = () => {
      if(!handleElement.value) return

      let rowIndex = 0
      let colIndex = 0
      if(selectedCells.value.length) {
        const selectedCell = selectedCells.value[0]
        rowIndex = +selectedCell.split('_')[0]
        colIndex = +selectedCell.split('_')[1]
      }
      const style = handleElement.value.data[rowIndex][colIndex].style

      if(!style) {
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

    const updateSelectedCells = (cells: string[]) => {
      selectedCells.value = cells
      updateTextAttrs()
    }

    emitter.on(EmitterEvents.UPDATE_TABLE_SELECTED_CELL, cells => updateSelectedCells(cells))
    onUnmounted(() => {
      emitter.off(EmitterEvents.UPDATE_TABLE_SELECTED_CELL, cells => updateSelectedCells(cells))
    })

    const availableFonts = computed(() => store.state.availableFonts)
    const fontSizeOptions = [
      '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
    ]

    const { addHistorySnapshot } = useHistorySnapshot()

    const emitUpdateTextAttrCommand = (textAttrProp: Partial<TableCellStyle>) => {
      emitter.emit(EmitterEvents.EXEC_TABLE_TEXT_COMMAND, textAttrProp)
      updateTextAttrs()
    }

    const updateTheme = (themeProp: Partial<TableTheme>) => {
      const currentTheme = theme.value || {}
      const props = { theme: { ...currentTheme, ...themeProp } }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const toggleTheme = (checked: boolean) => {
      if(checked) {
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

    return {
      availableFonts,
      fontSizeOptions,
      textAttrs,
      emitUpdateTextAttrCommand,
      theme,
      hasTheme,
      toggleTheme,
      updateTheme,
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
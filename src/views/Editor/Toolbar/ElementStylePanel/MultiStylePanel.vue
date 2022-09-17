<template>
  <div class="multi-style-panel">
    <div class="row">
      <div style="flex: 2;">填充颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 3;" />
      </Popover>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">边框样式：</div>
      <Select 
        style="flex: 3;" 
        :value="outline.style"
        @change="value => updateOutline({ style: value as 'solid' | 'dashed' })"
      >
        <SelectOption value="solid">实线边框</SelectOption>
        <SelectOption value="dashed">虚线边框</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">边框颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="outline.color"
            @update:modelValue="value => updateOutline({ color: value })"
          />
        </template>
        <ColorButton :color="outline.color || '#000'" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">边框粗细：</div>
      <InputNumber 
        :value="outline.width"
        @change="value => updateOutline({ width: value as number })" 
        style="flex: 3;" 
      />
    </div>

    <Divider />

    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
        :value="richTextAttrs.fontname"
        @change="value => updateFontStyle('fontname', value as string)"
      >
        <template #suffixIcon><IconFontSize /></template>
        <SelectOptGroup label="系统字体">
          <SelectOption v-for="font in availableFonts" :key="font.value" :value="font.value">
            <span :style="{ fontFamily: font.value }">{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup label="在线字体">
          <SelectOption v-for="font in WEB_FONTS" :key="font.value" :value="font.value">
            <span>{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
      </Select>
      <Select
        style="flex: 2;"
        :value="richTextAttrs.fontsize"
        @change="value => updateFontStyle('fontsize', value as string)"
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
            :modelValue="richTextAttrs.color"
            @update:modelValue="value => updateFontStyle('color', value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文字颜色">
          <TextColorButton :color="richTextAttrs.color" style="flex: 3;">
            <IconText />
          </TextColorButton>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => updateFontStyle('backcolor', value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文字高亮">
          <TextColorButton :color="richTextAttrs.backcolor" style="flex: 3;">
            <IconHighLight />
          </TextColorButton>
        </Tooltip>
      </Popover>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="增大字号">
        <Button 
          class="font-size-btn"
          style="flex: 2;"
          @click="updateFontStyle('fontsize-add', '2')"
        ><IconFontSize />+</Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="减小字号">
        <Button 
          class="font-size-btn"
          style="flex: 2;"
          @click="updateFontStyle('fontsize-reduce', '2')"
        ><IconFontSize />-</Button>
      </Tooltip>
    </ButtonGroup>
    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="richTextAttrs.align"
      @change="e => updateFontStyle('align', e.target.value)"
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement, PPTElementOutline, TableCell } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '../common/ColorButton.vue'
import TextColorButton from '../common/TextColorButton.vue'

const slidesStore = useSlidesStore()
const { richTextAttrs, availableFonts, activeElementList } = storeToRefs(useMainStore())

const { addHistorySnapshot } = useHistorySnapshot()

const updateElement = (id: string, props: Partial<PPTElement>) => {
  slidesStore.updateElement({ id, props })
  addHistorySnapshot()
}

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const fill = ref('#fff')
const outline = ref<PPTElementOutline>({
  width: 0,
  color: '#fff',
  style: 'solid',
})

// 批量修改填充色（表格元素为单元格填充、音频元素为图标颜色）
const updateFill = (value: string) => {
  for (const el of activeElementList.value) {
    if (
      el.type === 'text' ||
      el.type === 'shape' ||
      el.type === 'chart'
    ) updateElement(el.id, { fill: value })

    if (el.type === 'table') {
      const data: TableCell[][] = JSON.parse(JSON.stringify(el.data))
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const style = data[i][j].style || {}
          data[i][j].style = { ...style, backcolor: value }
        }
      }
      updateElement(el.id, { data })
    }

    if (el.type === 'audio') updateElement(el.id, { color: value })
  }
  fill.value = value
}

// 修改边框/线条样式
const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {

  for (const el of activeElementList.value) {
    if (
      el.type === 'text' ||
      el.type === 'image' ||
      el.type === 'shape' ||
      el.type === 'table' ||
      el.type === 'chart'
    ) {
      const outline = el.outline || { width: 2, color: '#000', style: 'solid' }
      const props = { outline: { ...outline, ...outlineProps } }
      updateElement(el.id, props)
    }

    if (el.type === 'line') updateElement(el.id, outlineProps)
  }
  outline.value = { ...outline.value, ...outlineProps }
}

// 修改文字样式
const updateFontStyle = (command: string, value: string) => {
  for (const el of activeElementList.value) {
    if (el.type === 'text' || (el.type === 'shape' && el.text?.content)) {
      emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { target: el.id, action: { command, value } })
    }
    if (el.type === 'table') {
      const data: TableCell[][] = JSON.parse(JSON.stringify(el.data))
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const style = data[i][j].style || {}
          data[i][j].style = { ...style, [command]: value }
        }
      }
      updateElement(el.id, { data })
    }
    if (el.type === 'latex' && command === 'color') {
      updateElement(el.id, { color: value })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
</style>
<template>
  <div class="multi-style-panel">
    <div class="row">
      <div style="width: 40%;">填充颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" />
      </Popover>
    </div>

    <Divider />

    <div class="row">
      <div style="width: 40%;">边框样式：</div>
      <Select 
        style="width: 60%;" 
        :value="outline.style || ''"
        @update:value="value => updateOutline({ style: value as 'solid' | 'dashed' | 'dotted' })"
        :options="[
          { label: '实线边框', value: 'solid' },
          { label: '虚线边框', value: 'dashed' },
          { label: '点线边框', value: 'dotted' },
        ]"
      />
    </div>
    <div class="row">
      <div style="width: 40%;">边框颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="outline.color"
            @update:modelValue="value => updateOutline({ color: value })"
          />
        </template>
        <ColorButton :color="outline.color || '#000'" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">边框粗细：</div>
      <NumberInput 
        :value="outline.width || 0"
        @update:value="value => updateOutline({ width: value })" 
        style="width: 60%;" 
      />
    </div>

    <Divider />

    <SelectGroup class="row">
      <Select
        style="width: 60%;;"
        :value="richTextAttrs.fontname"
        search
        searchLabel="搜索字体"
        @update:value="value => updateFontStyle('fontname', value as string)"
        :options="[
          ...availableFonts,
          ...WEB_FONTS
        ]"
      >
        <template #icon>
          <IconFontSize />
        </template>
      </Select>
      <Select
        style="width: 40%;"
        :value="richTextAttrs.fontsize"
        search
        searchLabel="搜索字号"
        @update:value="value => updateFontStyle('fontsize', value as string)"
        :options="fontSizeOptions.map(item => ({
          label: item, value: item
        }))"
      >
        <template #icon>
          <IconAddText />
        </template>
      </Select>
    </SelectGroup>
    <ButtonGroup class="row" passive>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.color"
            @update:modelValue="value => updateFontStyle('color', value)"
          />
        </template>
        <TextColorButton first :color="richTextAttrs.color" v-tooltip="'文字颜色'">
          <IconText />
        </TextColorButton>
      </Popover>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => updateFontStyle('backcolor', value)"
          />
        </template>
        <TextColorButton :color="richTextAttrs.backcolor" v-tooltip="'文字高亮'">
          <IconHighLight />
        </TextColorButton>
      </Popover>
      <Button 
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="'增大字号'"
        @click="updateFontStyle('fontsize-add', '2')"
      ><IconFontSize />+</Button>
      <Button
        last
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="'减小字号'"
        @click="updateFontStyle('fontsize-reduce', '2')"
      ><IconFontSize />-</Button>
    </ButtonGroup>
    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="richTextAttrs.align"
      @update:value="value => updateFontStyle('align', value)"
    >
      <RadioButton value="left" style="flex: 1;" v-tooltip="'左对齐'"><IconAlignTextLeft /></RadioButton>
      <RadioButton value="center" style="flex: 1;" v-tooltip="'居中'"><IconAlignTextCenter /></RadioButton>
      <RadioButton value="right" style="flex: 1;" v-tooltip="'右对齐'"><IconAlignTextRight /></RadioButton>
      <RadioButton value="justify" style="flex: 1;" v-tooltip="'两端对齐'"><IconAlignTextBoth /></RadioButton>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement, PPTElementOutline, TableCell } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import TextColorButton from '@/components/TextColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import NumberInput from '@/components/NumberInput.vue'
import Select from '@/components/Select.vue'
import SelectGroup from '@/components/SelectGroup.vue'
import Popover from '@/components/Popover.vue'

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
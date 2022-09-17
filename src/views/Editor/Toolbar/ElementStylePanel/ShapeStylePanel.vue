<template>
  <div class="shape-style-panel">
    <div class="row">
      <Select 
        style="flex: 10;" 
        :value="fillType" 
        @change="value => updateFillType(value as 'fill' | 'gradient')"
      >
        <SelectOption value="fill">纯色填充</SelectOption>
        <SelectOption value="gradient">渐变填充</SelectOption>
      </Select>
      <div style="flex: 1;"></div>
      <Popover trigger="click" v-if="fillType === 'fill'">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 10;" />
      </Popover>
      <Select 
        style="flex: 10;" 
        :value="gradient.type" 
        @change="value => updateGradient({ type: value as 'linear' | 'radial' })"
        v-else
      >
        <SelectOption value="linear">线性渐变</SelectOption>
        <SelectOption value="radial">径向渐变</SelectOption>
      </Select>
    </div>
    
    <template v-if="fillType === 'gradient'">
      <div class="row">
        <div style="flex: 2;">起点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[0]"
              @update:modelValue="value => updateGradient({ color: [value, gradient.color[1]] })"
            />
          </template>
          <ColorButton :color="gradient.color[0]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">终点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[1]"
              @update:modelValue="value => updateGradient({ color: [gradient.color[0], value] })"
            />
          </template>
          <ColorButton :color="gradient.color[1]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row" v-if="gradient.type === 'linear'">
        <div style="flex: 2;">渐变角度：</div>
        <Slider
          class="slider"
          :min="0"
          :max="360"
          :step="15"
          :value="gradient.rotate"
          @change="value => updateGradient({ rotate: value as number })" 
        />
      </div>
    </template>

    <ElementFlip />
    <Divider />

    <template v-if="handleShapeElement.text?.content">
      <InputGroup compact class="row">
        <Select
          style="flex: 3;"
          :value="richTextAttrs.fontname"
          @change="value => emitRichTextCommand('fontname', value as string)"
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
          @change="value => emitRichTextCommand('fontsize', value as string)"
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
              @update:modelValue="value => emitRichTextCommand('color', value)"
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
              @update:modelValue="value => emitRichTextCommand('backcolor', value)"
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
            @click="emitRichTextCommand('fontsize-add')"
          ><IconFontSize />+</Button>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="减小字号">
          <Button 
            class="font-size-btn"
            style="flex: 2;"
            @click="emitRichTextCommand('fontsize-reduce')"
          ><IconFontSize />-</Button>
        </Tooltip>
      </ButtonGroup>

      <CheckboxButtonGroup class="row">
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="加粗">
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.bold"
            @click="emitRichTextCommand('bold')"
          ><IconTextBold /></CheckboxButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="斜体">
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.em"
            @click="emitRichTextCommand('em')"
          ><IconTextItalic /></CheckboxButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下划线">
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.underline"
            @click="emitRichTextCommand('underline')"
          ><IconTextUnderline /></CheckboxButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除线">
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.strikethrough"
            @click="emitRichTextCommand('strikethrough')"
          ><IconStrikethrough /></CheckboxButton>
        </Tooltip>
      </CheckboxButtonGroup>

      <CheckboxButtonGroup class="row">
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="清除格式">
          <CheckboxButton
            style="flex: 1;"
            @click="emitRichTextCommand('clear')"
          ><IconFormat /></CheckboxButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="格式刷">
          <CheckboxButton
            style="flex: 1;"
            :checked="!!textFormatPainter"
            @click="toggleFormatPainter()"
          ><IconFormatBrush /></CheckboxButton>
        </Tooltip>
      </CheckboxButtonGroup>

      <Divider  />

      <RadioGroup 
        class="row" 
        button-style="solid" 
        :value="richTextAttrs.align"
        @change="e => emitRichTextCommand('align', e.target.value)"
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

      <RadioGroup 
        class="row" 
        button-style="solid" 
        :value="textAlign"
        @change="e => updateTextAlign(e.target.value)"
      >
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="顶对齐">
          <RadioButton value="top" style="flex: 1;"><IconAlignTextTopOne /></RadioButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="居中">
          <RadioButton value="middle" style="flex: 1;"><IconAlignTextMiddleOne /></RadioButton>
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="底对齐">
          <RadioButton value="bottom" style="flex: 1;"><IconAlignTextBottomOne /></RadioButton>
        </Tooltip>
      </RadioGroup>

      <Divider  />
    </template>

    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTShapeElement, ShapeGradient, ShapeText } from '@/types/slides'
import { WEB_FONTS } from '@/configs/font'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ElementFlip from '../common/ElementFlip.vue'
import ColorButton from '../common/ColorButton.vue'
import TextColorButton from '../common/TextColorButton.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId, richTextAttrs, availableFonts, textFormatPainter } = storeToRefs(mainStore)

const handleShapeElement = handleElement as Ref<PPTShapeElement>

const fill = ref<string>('#000')
const gradient = ref<ShapeGradient>({
  type: 'linear', 
  rotate: 0,
  color: ['#fff', '#fff'],
})
const fillType = ref('fill')
const textAlign = ref('middle')

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'shape') return

  fill.value = handleElement.value.fill || '#fff'
  gradient.value = handleElement.value.gradient || { type: 'linear', rotate: 0, color: [fill.value, '#fff'] }
  fillType.value = handleElement.value.gradient ? 'gradient' : 'fill'
  textAlign.value = handleElement.value?.text?.align || 'middle'
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()
const { toggleFormatPainter } = useTextFormatPainter()

const updateElement = (props: Partial<PPTShapeElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 设置填充类型：渐变、纯色
const updateFillType = (type: 'gradient' | 'fill') => {
  if (type === 'fill') {
    slidesStore.removeElementProps({ id: handleElementId.value, propName: 'gradient' })
    addHistorySnapshot()
  }
  else updateElement({ gradient: gradient.value })
}

// 设置渐变填充
const updateGradient = (gradientProps: Partial<ShapeGradient>) => {
  if (!gradient.value) return
  const _gradient: ShapeGradient = { ...gradient.value, ...gradientProps }
  updateElement({ gradient: _gradient })
}

// 设置填充色
const updateFill = (value: string) => {
  updateElement({ fill: value })
}

const updateTextAlign = (align: 'top' | 'middle' | 'bottom') => {
  const _handleElement = handleElement.value as PPTShapeElement
  
  const defaultText: ShapeText = {
    content: '',
    defaultFontName: '微软雅黑',
    defaultColor: '#000',
    align: 'middle',
  }
  const _text = _handleElement.text || defaultText
  updateElement({ text: { ..._text, align } })
}

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}
</script>

<style lang="scss" scoped>
.shape-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.slider {
  flex: 3;
}
</style>
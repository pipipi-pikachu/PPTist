<template>
  <div class="shape-style-panel">
    <div class="title">
      <span>点击替换形状</span>
      <IconDown />
    </div>
    <div class="shape-pool">
      <div class="category" v-for="item in SHAPE_LIST" :key="item.type">
        <div class="shape-list">
          <template v-for="(shape, index) in item.children">
            <ShapeItemThumbnail 
              class="shape-item"
              :key="index"
              :shape="shape"
              @click="changeShape(shape)"
              v-if="shape.title !== '任意多边形'"
            />
          </template>
        </div>
      </div>
    </div>

    <div class="row">
      <Select 
        style="flex: 1;" 
        :value="fillType" 
        @update:value="value => updateFillType(value as 'fill' | 'gradient')"
        :options="[
          { label: '纯色填充', value: 'fill' },
          { label: '渐变填充', value: 'gradient' },
        ]"
      />
      <div style="width: 10px;"></div>
      <Popover trigger="click" v-if="fillType === 'fill'" style="flex: 1;">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" />
      </Popover>
      <Select 
        style="flex: 1;" 
        :value="gradient.type" 
        @update:value="value => updateGradient({ type: value as 'linear' | 'radial' })"
        v-else
        :options="[
          { label: '线性渐变', value: 'linear' },
          { label: '径向渐变', value: 'radial' },
        ]"
      />
    </div>
    
    <template v-if="fillType === 'gradient'">
      <div class="row">
        <div style="width: 40%;">起点颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[0]"
              @update:modelValue="value => updateGradient({ color: [value, gradient.color[1]] })"
            />
          </template>
          <ColorButton :color="gradient.color[0]" />
        </Popover>
      </div>
      <div class="row">
        <div style="width: 40%;">终点颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[1]"
              @update:modelValue="value => updateGradient({ color: [gradient.color[0], value] })"
            />
          </template>
          <ColorButton :color="gradient.color[1]" />
        </Popover>
      </div>
      <div class="row" v-if="gradient.type === 'linear'">
        <div style="width: 40%;">渐变角度：</div>
        <Slider
          style="width: 60%;"
          :min="0"
          :max="360"
          :step="15"
          :value="gradient.rotate"
          @update:value="value => updateGradient({ rotate: value as number })" 
        />
      </div>
    </template>

    <ElementFlip />

    <Divider />

    <template v-if="handleShapeElement.text?.content">
      <SelectGroup class="row">
        <Select
          class="font-select"
          style="width: 60%;"
          :value="richTextAttrs.fontname"
          @update:value="value => emitRichTextCommand('fontname', value as string)"
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
          @update:value="value => emitRichTextCommand('fontsize', value as string)"
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
              @update:modelValue="value => emitRichTextCommand('color', value)"
            />
          </template>
          <TextColorButton first v-tooltip="'文字颜色'" :color="richTextAttrs.color">
            <IconText />
          </TextColorButton>
        </Popover>
        <Popover trigger="click" style="width: 30%;">
          <template #content>
            <ColorPicker
              :modelValue="richTextAttrs.backcolor"
              @update:modelValue="value => emitRichTextCommand('backcolor', value)"
            />
          </template>
          <TextColorButton v-tooltip="'文字高亮'" :color="richTextAttrs.backcolor">
            <IconHighLight />
          </TextColorButton>
        </Popover>
        <Button 
          class="font-size-btn"
          style="width: 20%;"
          v-tooltip="'增大字号'"
          @click="emitRichTextCommand('fontsize-add')"
        ><IconFontSize />+</Button>
        <Button
          last
          class="font-size-btn"
          style="width: 20%;"
          v-tooltip="'减小字号'"
          @click="emitRichTextCommand('fontsize-reduce')"
        ><IconFontSize />-</Button>
      </ButtonGroup>

      <ButtonGroup class="row">
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.bold"
          v-tooltip="'加粗'"
          @click="emitRichTextCommand('bold')"
        ><IconTextBold /></CheckboxButton>
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.em"
          v-tooltip="'斜体'"
          @click="emitRichTextCommand('em')"
        ><IconTextItalic /></CheckboxButton>
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.underline"
          v-tooltip="'下划线'"
          @click="emitRichTextCommand('underline')"
        ><IconTextUnderline /></CheckboxButton>
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.strikethrough"
          v-tooltip="'删除线'"
          @click="emitRichTextCommand('strikethrough')"
        ><IconStrikethrough /></CheckboxButton>
      </ButtonGroup>

      <ButtonGroup class="row">
        <CheckboxButton
          style="flex: 1;"
          v-tooltip="'清除格式'"
          @click="emitRichTextCommand('clear')"
        ><IconFormat /></CheckboxButton>
        <CheckboxButton
          style="flex: 1;"
          :checked="!!textFormatPainter"
          v-tooltip="'格式刷（双击连续使用）'"
          @click="toggleTextFormatPainter()"
          @dblclick="toggleTextFormatPainter(true)"
        ><IconFormatBrush /></CheckboxButton>
      </ButtonGroup>

      <Divider  />

      <RadioGroup 
        class="row" 
        button-style="solid" 
        :value="richTextAttrs.align"
        @update:value="value => emitRichTextCommand('align', value)"
      >
        <RadioButton value="left" v-tooltip="'左对齐'" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
        <RadioButton value="center" v-tooltip="'居中'" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
        <RadioButton value="right" v-tooltip="'右对齐'" style="flex: 1;"><IconAlignTextRight /></RadioButton>
      </RadioGroup>

      <RadioGroup 
        class="row" 
        button-style="solid" 
        :value="textAlign"
        @update:value="value => updateTextAlign(value as 'top' | 'middle' | 'bottom')"
      >
        <RadioButton value="top" v-tooltip="'顶对齐'" style="flex: 1;"><IconAlignTextTopOne /></RadioButton>
        <RadioButton value="middle" v-tooltip="'居中'" style="flex: 1;"><IconAlignTextMiddleOne /></RadioButton>
        <RadioButton value="bottom" v-tooltip="'底对齐'" style="flex: 1;"><IconAlignTextBottomOne /></RadioButton>
      </RadioGroup>

      <Divider  />
    </template>

    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
    <Divider />

    <div class="row">
      <CheckboxButton
        v-tooltip="'双击连续使用'"
        style="flex: 1;"
        :checked="!!shapeFormatPainter"
        @click="toggleShapeFormatPainter()"
        @dblclick="toggleShapeFormatPainter(true)"
      ><IconFormatBrush /> 形状格式刷</CheckboxButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTShapeElement, ShapeGradient, ShapeText } from '@/types/slides'
import { WEB_FONTS } from '@/configs/font'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'
import useShapeFormatPainter from '@/hooks/useShapeFormatPainter'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ElementFlip from '../common/ElementFlip.vue'
import ColorButton from '../common/ColorButton.vue'
import TextColorButton from '../common/TextColorButton.vue'
import ShapeItemThumbnail from '@/views/Editor/CanvasTool/ShapeItemThumbnail.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import Slider from '@/components/Slider.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import Select from '@/components/Select.vue'
import SelectGroup from '@/components/SelectGroup.vue'
import Popover from '@/components/Popover.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId, richTextAttrs, availableFonts, textFormatPainter, shapeFormatPainter } = storeToRefs(mainStore)

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
const { toggleTextFormatPainter } = useTextFormatPainter()
const { toggleShapeFormatPainter } = useShapeFormatPainter()

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

// 修改形状
const changeShape = (shape: ShapePoolItem) => {
  const { width, height } = handleElement.value as PPTShapeElement
  const props: Partial<PPTShapeElement> = {
    viewBox: shape.viewBox,
    path: shape.path,
    special: shape.special,
  }
  if (shape.pathFormula) {
    props.pathFormula = shape.pathFormula
    props.viewBox = [width, height]

    const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
    if ('editable' in pathFormula) {
      props.path = pathFormula.formula(width, height, pathFormula.defaultValue)
      props.keypoint = pathFormula.defaultValue
    }
    else props.path = pathFormula.formula(width, height)
  }
  else {
    props.pathFormula = undefined
    props.keypoint = undefined
  }
  updateElement(props)
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
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.shape-pool {
  width: 235px;
  height: 150px;
  overflow: auto;
  padding: 5px;
  padding-right: 10px;
  border: 1px solid $borderColor;
  margin-bottom: 20px;
}
.shape-list {
  @include flex-grid-layout();
}
.shape-item {
  @include flex-grid-layout-children(6, 14%);

  height: 0;
  padding-bottom: 14%;
  flex-shrink: 0;
}
</style>
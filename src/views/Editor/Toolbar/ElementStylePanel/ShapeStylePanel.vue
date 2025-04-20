<template>
  <div class="shape-style-panel">
    <div class="title">
      <span>点击替换形状</span>
      <IconDown />
    </div>
    <div class="shape-pool">
      <div class="category" v-for="item in SHAPE_LIST" :key="item.type">
        <div class="shape-list">
          <ShapeItemThumbnail 
            class="shape-item"
            v-for="(shape, index) in item.children"
            :key="index"
            :shape="shape"
            @click="changeShape(shape)"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <Select 
        style="flex: 1;" 
        :value="fillType" 
        @update:value="value => updateFillType(value as 'fill' | 'gradient' | 'pattern')"
        :options="[
          { label: '纯色填充', value: 'fill' },
          { label: '渐变填充', value: 'gradient' },
          { label: '图片填充', value: 'pattern' },
        ]"
      />
      <div style="width: 10px;" v-if="fillType !== 'pattern'"></div>
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
        @update:value="value => updateGradient({ type: value as GradientType })"
        v-else-if="fillType === 'gradient'"
        :options="[
          { label: '线性渐变', value: 'linear' },
          { label: '径向渐变', value: 'radial' },
        ]"
      />
    </div>
    
    <template v-if="fillType === 'gradient'">
      <div class="row">
        <GradientBar
          :value="gradient.colors"
          :index="currentGradientIndex"
          @update:value="value => updateGradient({ colors: value })"
          @update:index="index => currentGradientIndex = index"
        />
      </div>
      <div class="row">
        <div style="width: 40%;">当前色块：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="gradient.colors[currentGradientIndex].color"
              @update:modelValue="value => updateGradientColors(value)"
            />
          </template>
          <ColorButton :color="gradient.colors[currentGradientIndex].color" />
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
    
    <template v-if="fillType === 'pattern'">
      <div class="pattern-image-wrapper">
        <FileInput @change="files => uploadPattern(files)">
          <div class="pattern-image">
            <div class="content" :style="{ backgroundImage: `url(${pattern})` }">
              <IconPlus />
            </div>
          </div>
        </FileInput>
      </div>
    </template>

    <ElementFlip />

    <Divider />

    <template v-if="handleShapeElement.text?.content">
      <RichTextBase />
      <Divider />

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

      <Divider />
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
import type { GradientType, PPTShapeElement, Gradient, ShapeText } from '@/types/slides'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import { getImageDataURL } from '@/utils/image'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useShapeFormatPainter from '@/hooks/useShapeFormatPainter'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ElementFlip from '../common/ElementFlip.vue'
import RichTextBase from '../common/RichTextBase.vue'
import ShapeItemThumbnail from '@/views/Editor/CanvasTool/ShapeItemThumbnail.vue'
import ColorButton from '@/components/ColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import Slider from '@/components/Slider.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import Select from '@/components/Select.vue'
import Popover from '@/components/Popover.vue'
import GradientBar from '@/components/GradientBar.vue'
import FileInput from '@/components/FileInput.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId, shapeFormatPainter } = storeToRefs(mainStore)

const handleShapeElement = handleElement as Ref<PPTShapeElement>

const fill = ref<string>('#000')
const pattern = ref<string>('')
const gradient = ref<Gradient>({
  type: 'linear', 
  rotate: 0,
  colors: [
    { pos: 0, color: '#fff' },
    { pos: 100, color: '#fff' },
  ],
})
const fillType = ref('fill')
const textAlign = ref('middle')
const currentGradientIndex = ref(0)

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'shape') return

  fill.value = handleElement.value.fill || '#fff'
  const defaultGradientColor = [
    { pos: 0, color: fill.value },
    { pos: 100, color: '#fff' },
  ]
  gradient.value = handleElement.value.gradient || { type: 'linear', rotate: 0, colors: defaultGradientColor }
  pattern.value = handleElement.value.pattern || ''
  fillType.value = (handleElement.value.pattern !== undefined) ? 'pattern' : (handleElement.value.gradient ? 'gradient' : 'fill')
  textAlign.value = handleElement.value?.text?.align || 'middle'

  if (handleElement.value.text?.content) {
    emitter.emit(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE)
  }
}, { deep: true, immediate: true })

watch(handleElementId, () => {
  currentGradientIndex.value = 0
})

const { addHistorySnapshot } = useHistorySnapshot()
const { toggleShapeFormatPainter } = useShapeFormatPainter()

const updateElement = (props: Partial<PPTShapeElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

// 设置填充类型：渐变、纯色
const updateFillType = (type: 'gradient' | 'fill' | 'pattern') => {
  if (type === 'fill') {
    slidesStore.removeElementProps({ id: handleElementId.value, propName: ['gradient', 'pattern'] })
    addHistorySnapshot()
  }
  else if (type === 'gradient') {
    currentGradientIndex.value = 0
    slidesStore.removeElementProps({ id: handleElementId.value, propName: 'pattern' })
    updateElement({ gradient: gradient.value })
  }
  else if (type === 'pattern') {
    slidesStore.removeElementProps({ id: handleElementId.value, propName: 'gradient' })
    updateElement({ pattern: '' })
  }
}

// 设置渐变填充
const updateGradient = (gradientProps: Partial<Gradient>) => {
  if (!gradient.value) return
  const _gradient = { ...gradient.value, ...gradientProps }
  updateElement({ gradient: _gradient })
}
const updateGradientColors = (color: string) => {
  const colors = gradient.value.colors.map((item, index) => {
    if (index === currentGradientIndex.value) return { ...item, color }
    return item
  })
  updateGradient({ colors })
}

// 上传填充图片
const uploadPattern = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => {
    pattern.value = dataURL
    updateElement({ pattern: dataURL })
  })
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
      props.keypoints = pathFormula.defaultValue
    }
    else props.path = pathFormula.formula(width, height)
  }
  else {
    props.pathFormula = undefined
    props.keypoints = undefined
  }
  updateElement(props)
}

const updateTextAlign = (align: 'top' | 'middle' | 'bottom') => {
  const _handleElement = handleElement.value as PPTShapeElement
  
  const defaultText: ShapeText = {
    content: '',
    defaultFontName: '',
    defaultColor: '#000',
    align: 'middle',
  }
  const _text = _handleElement.text || defaultText
  updateElement({ text: { ..._text, align } })
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
  align-items: center;
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

.pattern-image-wrapper {
  margin-bottom: 10px;
}
.pattern-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed $borderColor;
  border-radius: $borderRadius;
  position: relative;
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    @include absolute-0();

    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
</style>
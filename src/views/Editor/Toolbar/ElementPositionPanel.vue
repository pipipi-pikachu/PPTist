<template>
  <div class="element-position-panel">
    <div class="title">{{t('elementPosition.title')}}：</div>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.TOP)">
        <IconSendToBack class="btn-icon"/>
        {{t('elementPosition.top')}}
      </Button>
      <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.BOTTOM)">
        <IconBringToFrontOne class="btn-icon"/>
        {{t('elementPosition.bottom')}}
      </Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.UP)">
        <IconBringToFront class="btn-icon"/>
        {{t('elementPosition.moveUp')}}
      </Button>
      <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.DOWN)">
        <IconSentToBack class="btn-icon"/>
        {{t('elementPosition.moveDown')}}
      </Button>
    </ButtonGroup>

    <Divider/>

    <div class="title">{{t('elementPosition.alignment')}}：</div>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignLeft')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.LEFT)">
          <IconAlignLeft/>
        </Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignVertically')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.HORIZONTAL)">
          <IconAlignVertically/>
        </Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignRight')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.RIGHT)">
          <IconAlignRight/>
        </Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignTop')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.TOP)">
          <IconAlignTop/>
        </Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignHorizontally')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.VERTICAL)">
          <IconAlignHorizontally/>
        </Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.alignBottom')">
        <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.BOTTOM)">
          <IconAlignBottom/>
        </Button>
      </Tooltip>
    </ButtonGroup>

    <Divider/>

    <div class="row">
      <InputNumber
          :prefix="t('elementPosition.posX')+':'"
          :step="5"
          :value="left"
          @change="value => updateLeft(value as number)"
          style="flex: 4;"
      />
      <div style="flex: 1;"></div>
      <InputNumber
          :prefix="t('elementPosition.posY')+':'"
          :step="5"
          :value="top"
          @change="value => updateTop(value as number)"
          style="flex: 4;"
      />
    </div>

    <template v-if="handleElement!.type !== 'line'">
      <div class="row">
        <InputNumber
            :prefix="t('elementPosition.width')+':'"
            :min="minSize"
            :max="1500"
            :step="5"
            :disabled="isVerticalText"
            :value="width"
            @change="value => updateWidth(value as number)"
            style="flex: 4;"
        />
        <template v-if="['image', 'shape', 'audio'].includes(handleElement!.type)">
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.unlockAO')" v-if="fixedRatio">
            <IconLock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(false)"/>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('elementPosition.lockAO')" v-else>
            <IconUnlock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(true)"/>
          </Tooltip>
        </template>
        <div style="flex: 1;" v-else></div>
        <InputNumber
            :prefix="t('elementPosition.height')+':'"
            :min="minSize"
            :max="800"
            :step="5"
            :disabled="isHorizontalText || handleElement!.type === 'table'"
            :value="height"
            @change="value => updateHeight(value as number)"
            style="flex: 4;"
        />
      </div>
    </template>

    <template v-if="!['line', 'video', 'audio'].includes(handleElement!.type)">
      <Divider/>

      <div class="row">
        <InputNumber
            :prefix="t('elementPosition.rotation')+':'"
            :min="-180"
            :max="180"
            :step="5"
            :value="rotate"
            @change="value => updateRotate(value as number)"
            style="flex: 8;"
        />
        <div style="flex: 1;"></div>
        <div class="text-btn" @click="updateRotate45('-')" style="flex: 5;">
          <IconRotate/>
          -45°
        </div>
        <div class="text-btn" @click="updateRotate45('+')" style="flex: 5;">
          <IconRotate :style="{ transform: 'rotateY(180deg)' }"/>
          +45°
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {round} from 'lodash'
import {storeToRefs} from 'pinia'
import {useMainStore, useSlidesStore} from '@/store'
import {ElementAlignCommands, ElementOrderCommands} from '@/types/edit'
import {MIN_SIZE} from '@/configs/element'
import {SHAPE_PATH_FORMULAS} from '@/configs/shapes'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import {
  InputNumber,
  Divider,
  Button,
  Tooltip,
} from 'ant-design-vue'
import usei18n from '@/hooks/usei18n'

const {t} = usei18n()
const ButtonGroup = Button.Group

const slidesStore = useSlidesStore()
const {handleElement, handleElementId} = storeToRefs(useMainStore())

const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)
const rotate = ref(0)
const fixedRatio = ref(false)

const minSize = computed(() => {
  if (!handleElement.value) return 20
  return MIN_SIZE[handleElement.value.type] || 20
})

const isHorizontalText = computed(() => {
  return handleElement.value?.type === 'text' && !handleElement.value.vertical
})
const isVerticalText = computed(() => {
  return handleElement.value?.type === 'text' && handleElement.value.vertical
})

watch(handleElement, () => {
  if (!handleElement.value) return

  left.value = round(handleElement.value.left, 1)
  top.value = round(handleElement.value.top, 1)

  fixedRatio.value = 'fixedRatio' in handleElement.value && !!handleElement.value.fixedRatio

  if (handleElement.value.type !== 'line') {
    width.value = round(handleElement.value.width, 1)
    height.value = round(handleElement.value.height, 1)
    rotate.value = 'rotate' in handleElement.value && handleElement.value.rotate !== undefined ? round(handleElement.value.rotate, 1) : 0
  }
}, {deep: true, immediate: true})

const {orderElement} = useOrderElement()
const {alignElementToCanvas} = useAlignElementToCanvas()

const {addHistorySnapshot} = useHistorySnapshot()

// 设置元素位置
const updateLeft = (value: number) => {
  const props = {left: value}
  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}
const updateTop = (value: number) => {
  const props = {top: value}
  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}

// 设置元素宽度、高度、旋转角度
// 对形状设置宽高时，需要检查是否需要更新形状路径
const updateShapePathData = (width: number, height: number) => {
  if (handleElement.value && handleElement.value.type === 'shape' && 'pathFormula' in handleElement.value && handleElement.value.pathFormula) {
    const pathFormula = SHAPE_PATH_FORMULAS[handleElement.value.pathFormula]

    let path = ''
    if ('editable' in pathFormula) {
      path = pathFormula.formula(width, height, handleElement.value.keypoint!)
    }
    else {
      path = pathFormula.formula(width, height)
    }

    return {
      viewBox: [width, height],
      path,
    }
  }
  return null
}
const updateWidth = (value: number) => {
  let props = {width: value}
  const shapePathData = updateShapePathData(value, height.value)
  if (shapePathData) props = {...props, ...shapePathData}

  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}
const updateHeight = (value: number) => {
  let props = {height: value}
  const shapePathData = updateShapePathData(width.value, value)
  if (shapePathData) props = {...props, ...shapePathData}

  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}
const updateRotate = (value: number) => {
  const props = {rotate: value}
  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}

// 固定元素的宽高比
const updateFixedRatio = (value: boolean) => {
  const props = {fixedRatio: value}
  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}

// 将元素旋转45度（顺时针或逆时针）
const updateRotate45 = (command: '+' | '-') => {
  let _rotate = Math.floor(rotate.value / 45) * 45
  if (command === '+') {
    _rotate = _rotate + 45
  }
  else if (command === '-') _rotate = _rotate - 45

  if (_rotate < -180) _rotate = -180
  if (_rotate > 180) _rotate = 180

  const props = {rotate: _rotate}
  slidesStore.updateElement({id: handleElementId.value, props})
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  margin-bottom: 10px;
}

.label {
  text-align: center;
}

.btn-icon {
  margin-right: 3px;
}

.icon-btn {
  cursor: pointer;
}

.text-btn {
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
    border-radius: $borderRadius;
  }
}
</style>

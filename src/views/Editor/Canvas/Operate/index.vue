<template>
  <div
    class="operate"
    :class="{ 'multi-select': isMultiSelect && !isActive }"
    :style="{
      top: elementInfo.top * canvasScale + 'px',
      left: elementInfo.left * canvasScale + 'px',
      transform: `rotate(${rotate}deg)`,
      transformOrigin: `${elementInfo.width * canvasScale / 2}px ${height * canvasScale / 2}px`,
    }"
  >
    <component
      v-if="isSelected"
      :is="currentOperateComponent"
      :elementInfo="elementInfo"
      :handlerVisible="!elementInfo.lock && (isActiveGroupElement || !isMultiSelect)"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
      :dragLineElement="dragLineElement"
      :moveShapeKeypoint="moveShapeKeypoint"
    ></component>

    <div 
      class="animation-index"
      v-if="toolbarState === 'elAnimation' && elementIndexListInAnimation.length"
    >
      <div class="index-item" v-for="index in elementIndexListInAnimation" :key="index">{{index + 1}}</div>
    </div>

    <LinkHandler 
      :elementInfo="elementInfo" 
      :link="elementInfo.link"
      :openLinkDialog="openLinkDialog" 
      v-if="isActive && elementInfo.link" 
      @mousedown.stop=""
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { ElementTypes, PPTElement, PPTLineElement, PPTVideoElement, PPTAudioElement, PPTShapeElement } from '@/types/slides'
import { OperateLineHandlers, OperateResizeHandlers } from '@/types/edit'

import ImageElementOperate from './ImageElementOperate.vue'
import TextElementOperate from './TextElementOperate.vue'
import ShapeElementOperate from './ShapeElementOperate.vue'
import LineElementOperate from './LineElementOperate.vue'
import TableElementOperate from './TableElementOperate.vue'
import CommonElementOperate from './CommonElementOperate.vue'
import LinkHandler from './LinkHandler.vue'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTElement>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isActiveGroupElement: {
    type: Boolean,
    required: true,
  },
  isMultiSelect: {
    type: Boolean,
    required: true,
  },
  rotateElement: {
    type: Function as PropType<(element: Exclude<PPTElement, PPTLineElement | PPTVideoElement | PPTAudioElement>) => void>,
    required: true,
  },
  scaleElement: {
    type: Function as PropType<(e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: OperateResizeHandlers) => void>,
    required: true,
  },
  dragLineElement: {
    type: Function as PropType<(e: MouseEvent, element: PPTLineElement, command: OperateLineHandlers) => void>,
    required: true,
  },
  moveShapeKeypoint: {
    type: Function as PropType<(e: MouseEvent, element: PPTShapeElement) => void>,
    required: true,
  },
  openLinkDialog: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const { canvasScale, toolbarState } = storeToRefs(useMainStore())
const { formatedAnimations } = storeToRefs(useSlidesStore())

const currentOperateComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElementOperate,
    [ElementTypes.TEXT]: TextElementOperate,
    [ElementTypes.SHAPE]: ShapeElementOperate,
    [ElementTypes.LINE]: LineElementOperate,
    [ElementTypes.TABLE]: TableElementOperate,
    [ElementTypes.CHART]: CommonElementOperate,
    [ElementTypes.LATEX]: CommonElementOperate,
    [ElementTypes.VIDEO]: CommonElementOperate,
    [ElementTypes.AUDIO]: CommonElementOperate,
  }
  return elementTypeMap[props.elementInfo.type] || null
})

const elementIndexListInAnimation = computed(() => {
  const indexList = []
  for (let i = 0; i < formatedAnimations.value.length; i++) {
    const elIds = formatedAnimations.value[i].animations.map(item => item.elId)
    if (elIds.includes(props.elementInfo.id)) indexList.push(i)
  }
  return indexList
})

const rotate = computed(() => 'rotate' in props.elementInfo ? props.elementInfo.rotate : 0)
const height = computed(() => 'height' in props.elementInfo ? props.elementInfo.height : 0)
</script>

<style lang="scss" scoped>
.operate {
  position: absolute;
  z-index: 100;
  user-select: none;

  &.multi-select {
    opacity: 0.2;
  }
}
.animation-index {
  position: absolute;
  top: 0;
  left: -24px;
  font-size: 12px;

  .index-item {
    width: 18px;
    height: 18px;
    background-color: #fff;
    color: $themeColor;
    border: 1px solid $themeColor;
    display: flex;
    justify-content: center;
    align-items: center;

    & + .index-item {
      margin-top: 5px;
    }
  }
}
</style>
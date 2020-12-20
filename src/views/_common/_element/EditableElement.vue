<template>
  <div 
    class="editable-element"
    ref="elementRef"
    :id="'editable-element-' + elementInfo.elId"
    :style="{ zIndex: elementIndex }"
  >
    <component
      :is="currentElementComponent"
      :canvasScale="canvasScale"
      :elementInfo="elementInfo"
      :isActive="isActive"
      :isHandleEl="isHandleEl"
      :isActiveGroupElement="isActiveGroupElement"
      :isMultiSelect="isMultiSelect"
      :animationIndex="animationIndex"
      :selectElement="selectElement"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
      :contextmenus="contextmenus"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTElement, PPTTextElement, PPTImageElement, PPTShapeElement, PPTLineElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import {
  ElementOrderCommand,
  ElementOrderCommands,
  ElementAlignCommand,
  ElementAlignCommands,
  ElementScaleHandler,
} from '@/types/edit'

import ImageElement from './ImageElement/index.vue'
import TextElement from './TextElement/index.vue'

export default defineComponent({
  name: 'editable-element',
  props: {
    canvasScale: {
      type: Number,
      required: true,
    },
    elementInfo: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
    elementIndex: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isHandleEl: {
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
    animationIndex: {
      type: Number,
      default: -1,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, canMove?: boolean) => void>,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTTextElement | PPTImageElement | PPTShapeElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: ElementScaleHandler) => void>,
      required: true,
    },
    orderElement: {
      type: Function as PropType<(element: PPTElement, command: ElementOrderCommand) => void>,
      required: true,
    },
    combineElements: {
      type: Function as PropType<() => void>,
      required: true,
    },
    uncombineElements: {
      type: Function as PropType<() => void>,
      required: true,
    },
    alignElementToCanvas: {
      type: Function as PropType<(command: ElementAlignCommand) => void>,
      required: true,
    },
    deleteElement: {
      type: Function as PropType<() => void>,
      required: true,
    },
    lockElement: {
      type: Function as PropType<(element: PPTElement) => void>,
      required: true,
    },
    unlockElement: {
      type: Function as PropType<(element: PPTElement) => void>,
      required: true,
    },
    copyElement: {
      type: Function as PropType<() => void>,
      required: true,
    },
    cutElement: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const currentElementComponent = computed(() => {
      const elementTypeMap = {
        'image': ImageElement,
        'text': TextElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const contextmenus = (): ContextmenuItem[] => {
      if(props.elementInfo.isLock) {
        return [{
          text: '解锁', 
          icon: 'icon-unlock',
          handler: () => props.unlockElement(props.elementInfo),
        }]
      }

      return [
        {
          text: '剪切',
          subText: 'Ctrl + X',
          icon: 'icon-scissor',
          handler: props.cutElement,
        },
        {
          text: '复制',
          subText: 'Ctrl + C',
          icon: 'icon-copy',
          handler: props.copyElement,
        },
        { divider: true },
        {
          text: '层级排序',
          icon: 'icon-top-layer',
          disable: props.isMultiSelect && !props.elementInfo.groupId,
          children: [
            { text: '置顶层', handler: () => props.orderElement(props.elementInfo, ElementOrderCommands.TOP) },
            { text: '置底层', handler: () => props.orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
            { divider: true },
            { text: '上移一层', handler: () => props.orderElement(props.elementInfo, ElementOrderCommands.UP) },
            { text: '下移一层', handler: () => props.orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
          ],
        },
        {
          text: '水平对齐',
          icon: 'icon-align-left',
          children: [
            { text: '水平居中', handler: () => props.alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
            { text: '左对齐', handler: () => props.alignElementToCanvas(ElementAlignCommands.LEFT) },
            { text: '右对齐', handler: () => props.alignElementToCanvas(ElementAlignCommands.RIGHT) },
          ],
        },
        {
          text: '垂直对齐',
          icon: 'icon-align-bottom',
          children: [
            { text: '垂直居中', handler: () => props.alignElementToCanvas(ElementAlignCommands.VERTICAL) },
            { text: '上对齐', handler: () => props.alignElementToCanvas(ElementAlignCommands.TOP) },
            { text: '下对齐', handler: () => props.alignElementToCanvas(ElementAlignCommands.BOTTOM) },
          ],
        },
        { divider: true },
        {
          text: props.elementInfo.groupId ? '取消组合' : '组合',
          subText: 'Ctrl + G',
          icon: 'icon-block',
          handler: props.elementInfo.groupId ? props.uncombineElements : props.combineElements,
          hide: !props.isMultiSelect,
        },
        {
          text: '锁定',
          subText: 'Ctrl + L',
          icon: 'icon-lock',
          handler: () => props.lockElement(props.elementInfo),
        },
        {
          text: '删除',
          subText: 'Delete',
          icon: 'icon-delete',
          handler: props.deleteElement,
        },
      ]
    }

    return {
      currentElementComponent,
      contextmenus,
    }
  },
})
</script>
<template>
  <div 
    class="editable-element"
    :id="'editable-element-' + elementInfo.elId"
    :style="{ zIndex: elementIndex }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      :canvasScale="canvasScale"
      :isActive="isActive"
      :isHandleEl="isHandleEl"
      :isMultiSelect="isMultiSelect"
      :selectElement="selectElement"
      :rotateElement="rotateElement"
      :scaleElement="scaleElement"
      :contextmenus="contextmenus"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTElement } from '@/types/slides'

import ImageElement from './ImageElement.index.vue'
import TextElement from './TextElement.index.vue'

export default defineComponent({
  name: 'editable-element',
  props: {
    elementInfo: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
    elementIndex: {
      type: Number,
      required: true,
    },
    canvasScale: {
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
    isMultiSelect: {
      type: Boolean,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, canMove: boolean) => void>,
      required: true,
    },
    rotateElement: {
      type: Function as PropType<(element: PPTElement) => void>,
      required: true,
    },
    scaleElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, direction: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => void>,
      required: true,
    },
    updateZIndex: {
      type: Function as PropType<(element: PPTElement, operation: 'up' | 'down' | 'top' | 'bottom') => void>,
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
    alignElement: {
      type: Function as PropType<(direction: 'top' | 'verticalCenter' | 'bottom' | 'left' | 'horizontalCenter' | 'right') => void>,
      required: true,
    },
    deleteElement: {
      type: Function as PropType<() => void>,
      required: true,
    },
    lockElement: {
      type: Function as PropType<(element: PPTElement, handle: 'lock' | 'unlock') => void>,
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

    const contextmenus = () => {
      if(props.elementInfo.isLock) {
        return [{
          text: '解锁', 
          icon: 'icon-unlock',
          action: () => props.lockElement(props.elementInfo, 'unlock'),
        }]
      }

      return [
        {
          text: '剪切',
          subText: 'Ctrl + X',
          icon: 'icon-scissor',
          action: props.cutElement,
        },
        {
          text: '复制',
          subText: 'Ctrl + C',
          icon: 'icon-copy',
          action: props.copyElement,
        },
        { divider: true },
        {
          text: '层级',
          icon: 'icon-top-layer',
          disable: props.isMultiSelect && !props.elementInfo.groupId,
          children: [
            { text: '置顶层', action: () => props.updateZIndex(props.elementInfo, 'top') },
            { text: '置底层', action: () => props.updateZIndex(props.elementInfo, 'bottom') },
            { divider: true },
            { text: '上移一层', action: () => props.updateZIndex(props.elementInfo, 'up') },
            { text: '下移一层', action: () => props.updateZIndex(props.elementInfo, 'down') },
          ],
        },
        {
          text: '水平对齐',
          icon: 'icon-align-left',
          children: [
            { text: '水平居中', action: () => props.alignElement('horizontalCenter') },
            { text: '左对齐', action: () => props.alignElement('left') },
            { text: '右对齐', action: () => props.alignElement('right') },
          ],
        },
        {
          text: '垂直对齐',
          icon: 'icon-align-bottom',
          children: [
            { text: '垂直居中', action: () => props.alignElement('verticalCenter') },
            { text: '上对齐', action: () => props.alignElement('top') },
            { text: '下对齐', action: () => props.alignElement('bottom') },
          ],
        },
        { divider: true },
        {
          text: props.elementInfo.groupId ? '取消组合' : '组合',
          subText: 'Ctrl + G',
          icon: 'icon-block',
          action: props.elementInfo.groupId ? props.uncombineElements : props.combineElements,
          hide: !props.isMultiSelect,
        },
        {
          text: '锁定',
          subText: 'Ctrl + L',
          icon: 'icon-lock',
          action: () => props.lockElement(props.elementInfo, 'lock'),
        },
        {
          text: '删除',
          subText: 'Delete',
          icon: 'icon-delete',
          action: () => props.deleteElement(),
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
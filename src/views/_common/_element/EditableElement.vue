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
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTElement, PPTTextElement, PPTImageElement, PPTShapeElement, PPTLineElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'

import { ElementOrderCommands, ElementAlignCommands, ElementScaleHandler } from '@/types/edit'

import ImageElement from './ImageElement/index.vue'
import TextElement from './TextElement/index.vue'

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
  },
  setup(props) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    const currentElementComponent = computed(() => {
      const elementTypeMap = {
        'image': ImageElement,
        'text': TextElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const { orderElement } = useOrderElement()
    const { alignElementToCanvas } = useAlignElementToCanvas()
    const { combineElements, uncombineElements } = useCombineElement()
    const { deleteElement } = useDeleteElement()
    const { lockElement, unlockElement } = useLockElement()
    const { copyElement, cutElement } = useCopyAndPasteElement()

    const contextmenus = (): ContextmenuItem[] => {
      if(props.elementInfo.isLock) {
        return [{
          text: '解锁', 
          icon: 'icon-unlock',
          handler: () => unlockElement(props.elementInfo),
        }]
      }

      return [
        {
          text: '剪切',
          subText: 'Ctrl + X',
          icon: 'icon-scissor',
          handler: cutElement,
        },
        {
          text: '复制',
          subText: 'Ctrl + C',
          icon: 'icon-copy',
          handler: copyElement,
        },
        { divider: true },
        {
          text: '层级排序',
          icon: 'icon-top-layer',
          disable: props.isMultiSelect && !props.elementInfo.groupId,
          children: [
            { text: '置顶层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
            { text: '置底层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
            { divider: true },
            { text: '上移一层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
            { text: '下移一层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
          ],
        },
        {
          text: '水平对齐',
          icon: 'icon-align-left',
          children: [
            { text: '水平居中', handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
            { text: '左对齐', handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
            { text: '右对齐', handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
          ],
        },
        {
          text: '垂直对齐',
          icon: 'icon-align-bottom',
          children: [
            { text: '垂直居中', handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
            { text: '上对齐', handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
            { text: '下对齐', handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
          ],
        },
        { divider: true },
        {
          text: props.elementInfo.groupId ? '取消组合' : '组合',
          subText: 'Ctrl + G',
          icon: 'icon-block',
          handler: props.elementInfo.groupId ? uncombineElements : combineElements,
          hide: !props.isMultiSelect,
        },
        {
          text: '锁定',
          subText: 'Ctrl + L',
          icon: 'icon-lock',
          handler: lockElement,
        },
        {
          text: '删除',
          subText: 'Delete',
          icon: 'icon-delete',
          handler: deleteElement,
        },
      ]
    }

    return {
      canvasScale,
      currentElementComponent,
      contextmenus,
    }
  },
})
</script>
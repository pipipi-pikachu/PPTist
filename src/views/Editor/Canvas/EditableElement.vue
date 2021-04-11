<template>
  <div 
    class="editable-element"
    ref="elementRef"
    :id="`editable-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
      color: theme.fontColor,
      fontFamily: theme.fontName,
    }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
      :selectElement="selectElement"
      :contextmenus="contextmenus"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from '@/store'
import { ElementTypes, PPTElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectAllElement from '@/hooks/useSelectAllElement'

import { ElementOrderCommands, ElementAlignCommands } from '@/types/edit'

import ImageElement from '@/views/components/element/ImageElement/index.vue'
import TextElement from '@/views/components/element/TextElement/index.vue'
import ShapeElement from '@/views/components/element/ShapeElement/index.vue'
import LineElement from '@/views/components/element/LineElement/index.vue'
import ChartElement from '@/views/components/element/ChartElement/index.vue'
import TableElement from '@/views/components/element/TableElement/index.vue'

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
    isMultiSelect: {
      type: Boolean,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTElement, canMove?: boolean) => void>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()
    const theme = computed(() => store.state.theme)

    const currentElementComponent = computed(() => {
      const elementTypeMap = {
        [ElementTypes.IMAGE]: ImageElement,
        [ElementTypes.TEXT]: TextElement,
        [ElementTypes.SHAPE]: ShapeElement,
        [ElementTypes.LINE]: LineElement,
        [ElementTypes.CHART]: ChartElement,
        [ElementTypes.TABLE]: TableElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    const { orderElement } = useOrderElement()
    const { alignElementToCanvas } = useAlignElementToCanvas()
    const { combineElements, uncombineElements } = useCombineElement()
    const { deleteElement } = useDeleteElement()
    const { lockElement, unlockElement } = useLockElement()
    const { copyElement, pasteElement, cutElement } = useCopyAndPasteElement()
    const { selectAllElement } = useSelectAllElement()

    const contextmenus = (): ContextmenuItem[] => {
      if (props.elementInfo.lock) {
        return [{
          text: '解锁', 
          handler: () => unlockElement(props.elementInfo),
        }]
      }

      return [
        {
          text: '剪切',
          subText: 'Ctrl + X',
          handler: cutElement,
        },
        {
          text: '复制',
          subText: 'Ctrl + C',
          handler: copyElement,
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteElement,
        },
        { divider: true },
        {
          text: '水平居中',
          handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
          children: [
            { text: '水平垂直居中', handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
            { text: '水平居中', handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
            { text: '左对齐', handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
            { text: '右对齐', handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
          ],
        },
        {
          text: '垂直居中',
          handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
          children: [
            { text: '水平垂直居中', handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
            { text: '垂直居中', handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
            { text: '顶部对齐', handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
            { text: '底部对齐', handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
          ],
        },
        { divider: true },
        {
          text: '置于顶层',
          disable: props.isMultiSelect && !props.elementInfo.groupId,
          handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
          children: [
            { text: '置于顶层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
            { text: '上移一层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
          ],
        },
        {
          text: '置于底层',
          disable: props.isMultiSelect && !props.elementInfo.groupId,
          handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
          children: [
            { text: '置于底层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
            { text: '下移一层', handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
          ],
        },
        { divider: true },
        {
          text: props.elementInfo.groupId ? '取消组合' : '组合',
          subText: 'Ctrl + G',
          handler: props.elementInfo.groupId ? uncombineElements : combineElements,
          hide: !props.isMultiSelect,
        },
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllElement,
        },
        {
          text: '锁定',
          subText: 'Ctrl + L',
          handler: lockElement,
        },
        {
          text: '删除',
          subText: 'Delete',
          handler: deleteElement,
        },
      ]
    }

    return {
      currentElementComponent,
      contextmenus,
      theme,
    }
  },
})
</script>
<template>
  <div class="editable-element" ref="elementRef" :id="`editable-element-${elementInfo.id}`" :style="{
    zIndex: elementIndex,
  }">
    <component :is="currentElementComponent" :elementInfo="elementInfo" :selectElement="selectElement"
      :contextmenus="contextmenus"></component>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
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
import LatexElement from '@/views/components/element/LatexElement/index.vue'
import VideoElement from '@/views/components/element/VideoElement/index.vue'
import AudioElement from '@/views/components/element/AudioElement/index.vue'
const props = defineProps({
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
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTElement, canMove?: boolean) => void>,
    required: true,
  },
  openLinkDialog: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const currentElementComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
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
      text: 'Unlock',
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: 'Cut',
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: 'Copy',
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: 'Paste',
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: 'Horizontal Alignment',
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: 'Align Middle', handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: 'Align Left', handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: 'Align Right', handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: 'Vertical Alignment',
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: 'Align Center', handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: 'Align Top', handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: 'Align Middle', handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: 'Put on top',
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: 'Place on top', handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: 'Move up one level', handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: 'Put to the bottom',
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: 'Background', handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: 'Move one layer down', handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: 'Set Link',
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? 'Ungroup' : 'Group',
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: 'Select all',
      subText: 'Ctrl + A',
      handler: selectAllElement,
    },
    {
      text: 'Lock',
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: 'Delete',
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>
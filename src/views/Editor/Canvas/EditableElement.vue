<template>
  <div
    class="editable-element"
    ref="elementRef"
    :id="`editable-element-${elementInfo.id}`"
    :style="{
      zIndex: elementIndex,
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
import usei18n from '@/hooks/usei18n'


const {t} = usei18n()
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
      text: t('context.unlock'),
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: t('context.cut'),
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: t('context.copy'),
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: t('context.paste'),
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: t('context.alignHorizontally'),
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: t('context.alignCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
        { text: t('textStyle.alignCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: t('textStyle.alignLeft'), handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: t('textStyle.alignRight'), handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: t('context.alignVertically'),
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: t('context.alignCenter'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
        { text: t('textStyle.alignMiddle'), handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: t('textStyle.alignTop'), handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: t('textStyle.alignBottom'), handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: t('context.putOnTop'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: t('context.putOnTop'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: t('context.bringForward'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: t('context.putOnBottom'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: t('context.putOnBottom'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: t('context.bringDown'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: t('context.addLink'),
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? t('context.unGroup') : t('context.group'),
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: t('context.selectAll'),
      subText: 'Ctrl + A',
      handler: selectAllElement,
    },
    {
      text: t('context.unlock'),
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: t('context.delete'),
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>

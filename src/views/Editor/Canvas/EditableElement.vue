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
import { t } from '@/i18n'

import { computed } from 'vue'
import { ElementTypes, type PPTElement } from '@/types/slides'
import type { ContextmenuItem } from '@/components/Contextmenu/types'

import useLockElement from '@/hooks/useLockElement'
import useDeleteElement from '@/hooks/useDeleteElement'
import useCombineElement from '@/hooks/useCombineElement'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectElement from '@/hooks/useSelectElement'

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

const props = defineProps<{
  elementInfo: PPTElement
  elementIndex: number
  isMultiSelect: boolean
  selectElement: (e: MouseEvent | TouchEvent, element: PPTElement, canMove?: boolean) => void
  openLinkDialog: () => void
}>()

const currentElementComponent = computed<unknown>(() => {
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
const { selectAllElements } = useSelectElement()

const contextmenus = (): ContextmenuItem[] => {
  if (props.elementInfo.lock) {
    return [{
      text: t('解锁'),
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: t('剪切'),
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: t('复制'),
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: t('粘贴'),
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: t('水平居中'),
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: t('水平垂直居中'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
        { text: t('水平居中'), handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: t('左对齐'), handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: t('右对齐'), handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: t('垂直居中'),
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: t('水平垂直居中'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
        { text: t('垂直居中'), handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: t('顶部对齐'), handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: t('底部对齐'), handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: t('置于顶层'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: t('置于顶层'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: t('上移一层'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: t('置于底层'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: t('置于底层'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: t('下移一层'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: t('设置链接'),
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? t('取消组合') : t('组合'),
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: t('全选'),
      subText: 'Ctrl + A',
      handler: selectAllElements,
    },
    {
      text: t('锁定'),
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: t('删除'),
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>

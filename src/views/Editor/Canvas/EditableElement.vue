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
import { t } from '@/i18n';

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
      text: t('Commons.text.text_o9ry'), 
      handler: () => unlockElement(props.elementInfo),
    }]
  }

  return [
    {
      text: t('Commons.label.text_egv1'),
      subText: 'Ctrl + X',
      handler: cutElement,
    },
    {
      text: t('Commons.button.text_fljd'),
      subText: 'Ctrl + C',
      handler: copyElement,
    },
    {
      text: t('Commons.label.text_lyu4'),
      subText: 'Ctrl + V',
      handler: pasteElement,
    },
    { divider: true },
    {
      text: t('Commons.button.text_e1la4n'),
      handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL),
      children: [
        { text: t('Commons.text.text_6hqm1'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER), },
        { text: t('Commons.button.text_e1la4n'), handler: () => alignElementToCanvas(ElementAlignCommands.HORIZONTAL) },
        { text: t('Commons.button.text_e7n4t'), handler: () => alignElementToCanvas(ElementAlignCommands.LEFT) },
        { text: t('Commons.button.text_cr6i2'), handler: () => alignElementToCanvas(ElementAlignCommands.RIGHT) },
      ],
    },
    {
      text: t('Commons.button.text_bj7l4q'),
      handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL),
      children: [
        { text: t('Commons.text.text_6hqm1'), handler: () => alignElementToCanvas(ElementAlignCommands.CENTER) },
        { text: t('Commons.button.text_bj7l4q'), handler: () => alignElementToCanvas(ElementAlignCommands.VERTICAL) },
        { text: t('Commons.text.text_jty7u1'), handler: () => alignElementToCanvas(ElementAlignCommands.TOP) },
        { text: t('Commons.text.text_cj576y'), handler: () => alignElementToCanvas(ElementAlignCommands.BOTTOM) },
      ],
    },
    { divider: true },
    {
      text: t('Commons.text.text_geulpo'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP),
      children: [
        { text: t('Commons.text.text_geulpo'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.TOP) },
        { text: t('Commons.text.text_aclf03'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.UP) },
      ],
    },
    {
      text: t('Commons.text.text_gekral'),
      disable: props.isMultiSelect && !props.elementInfo.groupId,
      handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM),
      children: [
        { text: t('Commons.text.text_gekral'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.BOTTOM) },
        { text: t('Commons.text.text_acm1zm'), handler: () => orderElement(props.elementInfo, ElementOrderCommands.DOWN) },
      ],
    },
    { divider: true },
    {
      text: t('Commons.text.text_i5wedz'),
      handler: props.openLinkDialog,
    },
    {
      text: props.elementInfo.groupId ? t('Commons.button.text_b1blbq') : t('Commons.button.text_m0uc'),
      subText: 'Ctrl + G',
      handler: props.elementInfo.groupId ? uncombineElements : combineElements,
      hide: !props.isMultiSelect,
    },
    {
      text: t('Commons.label.text_emxt'),
      subText: 'Ctrl + A',
      handler: selectAllElements,
    },
    {
      text: t('Commons.label.text_puih'),
      subText: 'Ctrl + L',
      handler: lockElement,
    },
    {
      text: t('Commons.button.text_eslg'),
      subText: 'Delete',
      handler: deleteElement,
    },
  ]
}
</script>
<template>
  <div class="element-float-layer">
    <AnimationIndex
      v-for="item in animationIndexItems"
      :key="item.element.id"
      :elementInfo="item.element"
      :range="item.range"
      :indexList="item.animationIndexList"
    />

    <FloatingToolbar
      v-if="floatingToolbar"
      :key="floatingToolbar.element.id"
      :elementInfo="floatingToolbar.element"
      :toolbarStyle="floatingToolbar.toolbarStyle"
      @measure="value => floatingToolbarWidth = value"
    />

    <LinkHandler
      v-if="linkHandler"
      :elementInfo="linkHandler.element"
      :handlerStyle="linkHandler.handlerStyle"
      :openLinkDialog="openLinkDialog"
      @mousedown.stop
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { ElementTypes, type PPTElement } from '@/types/slides'
import type useViewportSize from '../hooks/useViewportSize'
import { getElementListRange, getElementRange } from '@/utils/element'
import { getAnimationElementIds, isGroupAnimation } from '@/utils/animation'

import AnimationIndex from './AnimationIndex.vue'
import LinkHandler from './LinkHandler.vue'
import FloatingToolbar from './FloatingToolbar/index.vue'

const props = defineProps<{
  elementList: PPTElement[]
  canvasRef: HTMLElement | null
  viewportStyles: ReturnType<typeof useViewportSize>['viewportStyles']['value']
  openLinkDialog: () => void
}>()

const FLOAT_LAYER_GAP = 10
const FLOATING_TOOLBAR_HEIGHT = 40
const LINK_HANDLER_HEIGHT = 30
const ROTATE_HANDLER_RESERVED_GAP = 40
const TOOLBAR_ELEMENT_TYPES: string[] = [
  ElementTypes.TEXT,
  ElementTypes.IMAGE,
  ElementTypes.SHAPE,
  ElementTypes.TABLE,
  ElementTypes.LINE,
  ElementTypes.CHART,
  ElementTypes.LATEX,
]
const ROTATE_HANDLER_ELEMENT_TYPES: string[] = [
  ElementTypes.TEXT,
  ElementTypes.IMAGE,
  ElementTypes.SHAPE,
  ElementTypes.TABLE,
  ElementTypes.LATEX,
]

const { activeElementIdList, activeGroupElementId, canvasScale, handleElementId, hiddenElementIdList, showBubbleMenu, toolbarState } = storeToRefs(useMainStore())
const { formatedAnimations } = storeToRefs(useSlidesStore())
const floatingToolbarWidth = ref(100)

const getAnimationIndexList = (elIds: string[]) => {
  const indexList = []
  for (let i = 0; i < formatedAnimations.value.length; i++) {
    const animationElIds = formatedAnimations.value[i].animations.flatMap(item => getAnimationElementIds(item, props.elementList))
    if (elIds.some(elId => animationElIds.includes(elId))) indexList.push(i)
  }
  return indexList
}

// 获取作用于指定组合整体的动画序号集合
const getGroupAnimationIndexList = (groupId: string) => {
  const indexList = []
  for (let i = 0; i < formatedAnimations.value.length; i++) {
    const hasGroupAnimation = formatedAnimations.value[i].animations.some(item => isGroupAnimation(item) && item.elId === groupId)
    if (hasGroupAnimation) indexList.push(i)
  }
  return indexList
}

interface AnimationIndexItem {
  element: PPTElement
  range: ReturnType<typeof getElementRange>
  animationIndexList: number[]
}

const animationIndexItems = computed(() => {
  const items: AnimationIndexItem[] = []
  if (toolbarState.value !== 'elAnimation') return items

  const visibleElements = props.elementList.filter(element => !hiddenElementIdList.value.includes(element.id))

  // 组合动画只需在整个组合的范围上标注一次序号，无须在每个成员上重复标注
  const handledGroupIds: string[] = []

  for (const element of visibleElements) {
    const groupId = element.groupId
    if (groupId) {
      if (handledGroupIds.includes(groupId)) continue

      const groupElements = visibleElements.filter(el => el.groupId === groupId)
      const groupAnimationIndexList = getGroupAnimationIndexList(groupId)

      // 该组合存在整体动画时，以组合范围标注序号
      if (groupAnimationIndexList.length) {
        handledGroupIds.push(groupId)
        items.push({
          element,
          range: getElementListRange(groupElements),
          animationIndexList: groupAnimationIndexList,
        })
        continue
      }
    }

    const animationIndexList = getAnimationIndexList([element.id])
    if (!animationIndexList.length) continue

    items.push({
      element,
      range: getElementRange(element),
      animationIndexList,
    })
  }

  return items
})

const floatingToolbarTarget = computed(() => {
  if (!showBubbleMenu.value) return null

  const targetId = activeGroupElementId.value || (activeElementIdList.value.length === 1 ? activeElementIdList.value[0] : '')
  if (!targetId || hiddenElementIdList.value.includes(targetId)) return null

  const element = props.elementList.find(element => element.id === targetId) || null
  if (!element || !TOOLBAR_ELEMENT_TYPES.includes(element.type)) return null

  return element
})

const floatingToolbar = computed(() => {
  const element = floatingToolbarTarget.value
  if (!element) return null

  const range = getElementRange(element)
  const showLinkHandler = handleElementId.value === element.id && !!element.link
  const canvasWidth = props.canvasRef?.clientWidth || 0
  const canvasHeight = props.canvasRef?.clientHeight || 0
  const availableTop = -props.viewportStyles.top
  const availableBottom = canvasHeight - props.viewportStyles.top
  const availableLeft = -props.viewportStyles.left
  const availableRight = canvasWidth - props.viewportStyles.left
  const minLeft = availableLeft + FLOAT_LAYER_GAP
  const maxLeft = availableRight - floatingToolbarWidth.value - FLOAT_LAYER_GAP
  const bottomTop = range.maxY * canvasScale.value + FLOAT_LAYER_GAP
  const bottomHeight = FLOATING_TOOLBAR_HEIGHT + (showLinkHandler ? FLOAT_LAYER_GAP + LINK_HANDLER_HEIGHT : 0)
  const placement: 'top' | 'bottom' = canvasHeight && bottomTop + bottomHeight > availableBottom ? 'top' : 'bottom'
  const rotateHandlerGap = ROTATE_HANDLER_ELEMENT_TYPES.includes(element.type) ? ROTATE_HANDLER_RESERVED_GAP : FLOAT_LAYER_GAP
  const left = range.minX * canvasScale.value
  const toolbarLeft = canvasWidth ? (maxLeft < minLeft ? minLeft : Math.min(Math.max(left, minLeft), maxLeft)) : left
  const top = placement === 'bottom' ? bottomTop : range.minY * canvasScale.value - rotateHandlerGap - FLOATING_TOOLBAR_HEIGHT
  const toolbarTop = Math.max(availableTop + FLOAT_LAYER_GAP, top)

  return {
    element,
    range,
    placement,
    toolbarStyle: {
      left: toolbarLeft + 'px',
      top: toolbarTop + 'px',
    },
  }
})

const linkHandler = computed(() => {
  const element = handleElementId.value ? props.elementList.find(item => item.id === handleElementId.value) || null : null
  if (!element || !element.link || hiddenElementIdList.value.includes(element.id)) return null

  const range = getElementRange(element)
  const canvasWidth = props.canvasRef?.clientWidth || 0
  const availableLeft = -props.viewportStyles.left
  const availableRight = canvasWidth - props.viewportStyles.left
  const minLeft = availableLeft + FLOAT_LAYER_GAP
  const maxLeft = availableRight - floatingToolbarWidth.value - FLOAT_LAYER_GAP
  const left = range.minX * canvasScale.value
  const toolbarLeft = canvasWidth ? (maxLeft < minLeft ? minLeft : Math.min(Math.max(left, minLeft), maxLeft)) : left
  const toolbarBottom = floatingToolbar.value && floatingToolbar.value.element.id === element.id && floatingToolbar.value.placement === 'bottom'
  const top = range.maxY * canvasScale.value + FLOAT_LAYER_GAP + (toolbarBottom ? FLOATING_TOOLBAR_HEIGHT + FLOAT_LAYER_GAP : 0)

  return {
    element,
    handlerStyle: {
      left: toolbarLeft + 'px',
      top: top + 'px',
    },
  }
})
</script>

<style lang="scss" scoped>
.element-float-layer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 102;
}
</style>

<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @mousedown="$event => handleClickBlankArea($event)"
    v-contextmenu="contextmenus"
    v-click-outside="removeEditorAreaFocus"
  >
    <div 
      class="viewport" 
      ref="viewportRef"
      :style="{
        width: viewportStyles.width + 'px',
        height: viewportStyles.height + 'px',
        left: viewportStyles.left + 'px',
        top: viewportStyles.top + 'px',
        transform: `scale(${canvasScale})`,
      }"
    >
      <MouseSelection 
        v-if="mouseSelectionState.isShow"
        :top="mouseSelectionState.top" 
        :left="mouseSelectionState.left" 
        :width="mouseSelectionState.width" 
        :height="mouseSelectionState.height" 
        :quadrant="mouseSelectionState.quadrant"
      />

      <SlideBackground 
        :background="currentSlide?.background"
        :isShowGridLines="isShowGridLines"
      />

      <AlignmentLine 
        v-for="(line, index) in alignmentLines" :key="index" 
        :type="line.type" :axis="line.axis" :length="line.length"
      />

      <MultiSelectOperate 
        v-if="activeElementIdList.length > 1"
        :elementList="elementList"
        :scaleMultiElement="scaleMultiElement"
      />

      <EditableElement 
        v-for="(element, index) in elementList" 
        :key="element.elId"
        :elementInfo="element"
        :elementIndex="index + 1"
        :isActive="activeElementIdList.includes(element.elId)"
        :isHandleEl="element.elId === handleElementId"
        :isActiveGroupElement="activeGroupElementId === element.elId"
        :isMultiSelect="activeElementIdList.length > 1"
        :selectElement="selectElement"
        :rotateElement="rotateElement"
        :scaleElement="scaleElement"
        :orderElement="orderElement"
        :combineElements="combineElements"
        :uncombineElements="uncombineElements"
        :alignElementToCanvas="alignElementToCanvas"
        :deleteElement="deleteElement"
        :lockElement="lockElement"
        :unlockElement="unlockElement"
        :copyElement="copyElement"
        :cutElement="cutElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import uniq from 'lodash/uniq'
import { message } from 'ant-design-vue'
import { State, MutationTypes } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { ElementTypes, PPTElement, PPTLineElement, PPTTextElement, PPTImageElement, PPTShapeElement } from '@/types/slides'
import { OPERATE_KEYS, ElementOrderCommand, ElementAlignCommand, ElementScaleHandler } from '@/types/edit'

import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { getImageDataURL } from '@/utils/image'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt, decrypt } from '@/utils/crypto'

import { getElementRange } from './utils/elementRange'
import { getAngleFromCoordinate, getRotateElementPoints, getOppositePoint } from './utils/elementRotate'
import { lockElement as _lockElement, unlockElement as _unlockElement } from './utils/elementLock'
import { combineElements as _combineElements, uncombineElements as _uncombineElements } from './utils/elementCombine'
import { orderElement as _orderElement } from './utils/elementOrder'
import { alignElementToCanvas as _alignElementToCanvas } from './utils/elementAlignToCanvas'
import { AlignLine, uniqAlignLines } from './utils/alignLines'

import useDropImage from '@/hooks/useDropImage'
import useSetViewportSize from './hooks/useSetViewportSize'

import EditableElement from '@/views/_common/_element/EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import SlideBackground from './SlideBackground.vue'
import MultiSelectOperate, { MultiSelectRange } from './MultiSelectOperate.vue'
import AlignmentLine, { AlignmentLineProps } from './AlignmentLine.vue'

export default defineComponent({
  name: 'editor-canvas',
  components: {
    EditableElement,
    MouseSelection,
    SlideBackground,
    MultiSelectOperate,
    AlignmentLine,
  },
  setup() {
    const store = useStore<State>()

    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const activeElementList = computed(() => store.getters.activeElementList)
    const handleElementId = computed(() => store.state.handleElementId)
    const ctrlOrShiftKeyActive = computed(() => store.getters.ctrlOrShiftKeyActive)

    const activeGroupElementId = ref('')
    const viewportRef = ref<HTMLElement | null>(null)
    const isShowGridLines = ref(false)
    const alignmentLines = ref<AlignmentLineProps[]>([])

    const currentSlide = computed(() => store.getters.currentSlide)
    const elementList = ref<PPTElement[]>([])
    const setLocalElementList = () => {
      elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
    }
    watchEffect(setLocalElementList)

    const dropImageFile = useDropImage(viewportRef)
    watch(dropImageFile, () => {
      if(dropImageFile.value) {
        getImageDataURL(dropImageFile.value).then(dataURL => {
          console.log(dataURL)
        })
      }
    })

    const canvasRef = ref<HTMLElement | null>(null)
    const { canvasScale, viewportLeft, viewportTop } = useSetViewportSize(canvasRef)
    const viewportStyles = computed(() => ({
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
      left: viewportLeft.value,
      top: viewportTop.value,
    }))

    const mouseSelectionState = reactive({
      isShow: false,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      quadrant: 1,
    })
    const updateMouseSelection = (e: MouseEvent) => {
      if(!viewportRef.value) return

      let isMouseDown = true
      const viewportRect = viewportRef.value.getBoundingClientRect()

      const minSelectionRange = 5
      
      const startPageX = e.pageX
      const startPageY = e.pageY

      const left = (startPageX - viewportRect.x) / canvasScale.value
      const top = (startPageY - viewportRect.y) / canvasScale.value

      mouseSelectionState.isShow = false
      mouseSelectionState.quadrant = 4
      mouseSelectionState.top = top
      mouseSelectionState.left = left
      mouseSelectionState.width = 0
      mouseSelectionState.height = 0

      document.onmousemove = e => {
        if(!isMouseDown) return

        const currentPageX = e.pageX
        const currentPageY = e.pageY

        const offsetWidth = (currentPageX - startPageX) / canvasScale.value
        const offsetHeight = (currentPageY - startPageY) / canvasScale.value

        const width = Math.abs(offsetWidth)
        const height = Math.abs(offsetHeight)

        if( width < minSelectionRange || height < minSelectionRange ) return
        
        let quadrant = 0
        if( offsetWidth > 0 && offsetHeight > 0 ) quadrant = 4
        else if( offsetWidth < 0 && offsetHeight < 0 ) quadrant = 1
        else if( offsetWidth > 0 && offsetHeight < 0 ) quadrant = 2
        else if( offsetWidth < 0 && offsetHeight > 0 ) quadrant = 3

        mouseSelectionState.isShow = true
        mouseSelectionState.quadrant = quadrant
        mouseSelectionState.width = width
        mouseSelectionState.height = height
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        isMouseDown = false

        // 计算当前页面中的每一个元素是否处在鼠标选择范围中（必须完全包裹）
        // 将选择范围中的元素添加为激活元素
        let inRangeElementList: PPTElement[] = []
        for(let i = 0; i < elementList.value.length; i++) {
          const element = elementList.value[i]
          const mouseSelectionLeft = mouseSelectionState.left
          const mouseSelectionTop = mouseSelectionState.top
          const mouseSelectionWidth = mouseSelectionState.width
          const mouseSelectionHeight = mouseSelectionState.height

          const quadrant = mouseSelectionState.quadrant

          const { minX, maxX, minY, maxY } = getElementRange(element)

          let isInclude = false
          if(quadrant === 4) {
            isInclude = minX > mouseSelectionLeft && 
                        maxX < mouseSelectionLeft + mouseSelectionWidth && 
                        minY > mouseSelectionTop && 
                        maxY < mouseSelectionTop + mouseSelectionHeight
          }
          else if(quadrant === 1) {
            isInclude = minX > (mouseSelectionLeft - mouseSelectionWidth) && 
                        maxX < (mouseSelectionLeft - mouseSelectionWidth) + mouseSelectionWidth && 
                        minY > (mouseSelectionTop - mouseSelectionHeight) && 
                        maxY < (mouseSelectionTop - mouseSelectionHeight) + mouseSelectionHeight
          }
          else if(quadrant === 2) {
            isInclude = minX > mouseSelectionLeft && 
                        maxX < mouseSelectionLeft + mouseSelectionWidth && 
                        minY > (mouseSelectionTop - mouseSelectionHeight) && 
                        maxY < (mouseSelectionTop - mouseSelectionHeight) + mouseSelectionHeight
          }
          else if(quadrant === 3) {
            isInclude = minX > (mouseSelectionLeft - mouseSelectionWidth) && 
                        maxX < (mouseSelectionLeft - mouseSelectionWidth) + mouseSelectionWidth && 
                        minY > mouseSelectionTop && 
                        maxY < mouseSelectionTop + mouseSelectionHeight
          }

          // 被锁定的元素除外
          if(isInclude && !element.isLock) inRangeElementList.push(element)
        }

        // 对于组合元素成员，必须所有成员都在选择范围中才算被选中
        inRangeElementList = inRangeElementList.filter(inRangeElement => {
          if(inRangeElement.groupId) {
            const inRangeElementIdList = inRangeElementList.map(inRangeElement => inRangeElement.elId)
            const groupElementList = elementList.value.filter(element => element.groupId === inRangeElement.groupId)
            return groupElementList.every(groupElement => inRangeElementIdList.includes(groupElement.elId))
          }
          return true
        })
        const inRangeElementIdList = inRangeElementList.map(inRangeElement => inRangeElement.elId)
        if(inRangeElementIdList.length) store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, inRangeElementIdList)

        mouseSelectionState.isShow = false
      }
    }

    const editorAreaFocus = computed(() => store.state.editorAreaFocus)

    const handleClickBlankArea = (e: MouseEvent) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      if(!ctrlOrShiftKeyActive.value) updateMouseSelection(e)
      if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
    }

    const removeEditorAreaFocus = () => {
      if(editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, false)
    }

    const moveElement = (e: MouseEvent, element: PPTElement) => {
      console.log(e, element)
    }

    const selectElement = (e: MouseEvent, element: PPTElement, canMove = true) => {
      if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)

      // 如果被点击的元素处于未激活状态，则将他设置为激活元素（单选），或者加入到激活元素中（多选）
      if(!activeElementIdList.value.includes(element.elId)) {
        let newActiveIdList: string[] = []

        if(ctrlOrShiftKeyActive.value) {
          newActiveIdList = [...activeElementIdList.value, element.elId]
        }
        else newActiveIdList = [element.elId]
        
        // 同时如果该元素是分组成员，需要将和他同组的元素一起激活
        if(element.groupId) {
          const groupMembersId: string[] = []
          elementList.value.forEach((el: PPTElement) => {
            if(el.groupId === element.groupId) groupMembersId.push(el.elId)
          })
          newActiveIdList = [...newActiveIdList, ...groupMembersId]
        }

        store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, uniq(newActiveIdList))
        store.commit(MutationTypes.SET_HANDLE_ELEMENT_ID, element.elId)
      }

      // 如果被点击的元素已激活，且按下了多选按钮，则取消其激活状态（除非该元素或分组是最后的一个激活元素）
      else if(ctrlOrShiftKeyActive.value) {
        let newActiveIdList: string[] = []

        // 同时如果该元素是分组成员，需要将和他同组的元素一起取消
        if(element.groupId) {
          const groupMembersId: string[] = []
          elementList.value.forEach((el: PPTElement) => {
            if(el.groupId === element.groupId) groupMembersId.push(el.elId)
          })
          newActiveIdList = activeElementIdList.value.filter(elId => !groupMembersId.includes(elId))
        }
        else {
          newActiveIdList = activeElementIdList.value.filter(elId => elId !== element.elId)
        }

        if(newActiveIdList.length > 0) {
          store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveIdList)
        }
      }

      // 如果被点击的元素已激活，且没有按下多选按钮，且该元素不是当前操作元素，则将其设置为当前操作元素
      else if(handleElementId.value !== element.elId) {
        store.commit(MutationTypes.SET_HANDLE_ELEMENT_ID, element.elId)
      }

      else if(activeGroupElementId.value !== element.elId && element.groupId) {
        const startPageX = e.pageX
        const startPageY = e.pageY

        ;(e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
          const currentPageX = e.pageX
          const currentPageY = e.pageY

          if(startPageX === currentPageX && startPageY === currentPageY) {
            activeGroupElementId.value = element.elId
            ;(e.target as HTMLElement).onmouseup = null
          }
        }
      }

      if(canMove) moveElement(e, element)
    }

    const rotateElement = (element: PPTTextElement | PPTImageElement | PPTShapeElement) => {
      let isMouseDown = true
      let angle = 0
      const elOriginRotate = element.rotate || 0

      // 计算元素中心（旋转的中心，坐标原点）
      const elLeft = element.left
      const elTop = element.top
      const elWidth = element.width
      const elHeight = element.height
      const centerX = elLeft + elWidth / 2
      const centerY = elTop + elHeight / 2

      if(!viewportRef.value) return
      const viewportRect = viewportRef.value.getBoundingClientRect()

      document.onmousemove = e => {
        if(!isMouseDown) return
        
        // 计算鼠标基于旋转中心的坐标
        const mouseX = (e.pageX - viewportRect.left) / canvasScale.value
        const mouseY = (e.pageY - viewportRect.top) / canvasScale.value
        const x = mouseX - centerX
        const y = centerY - mouseY

        angle = getAngleFromCoordinate(x, y)

        // 45°的倍数位置有吸附效果
        const sorptionRange = 5
        if( Math.abs(angle) <= sorptionRange ) angle = 0
        else if( angle > 0 && Math.abs(angle - 45) <= sorptionRange ) angle -= (angle - 45)
        else if( angle < 0 && Math.abs(angle + 45) <= sorptionRange ) angle -= (angle + 45)
        else if( angle > 0 && Math.abs(angle - 90) <= sorptionRange ) angle -= (angle - 90)
        else if( angle < 0 && Math.abs(angle + 90) <= sorptionRange ) angle -= (angle + 90)
        else if( angle > 0 && Math.abs(angle - 135) <= sorptionRange ) angle -= (angle - 135)
        else if( angle < 0 && Math.abs(angle + 135) <= sorptionRange ) angle -= (angle + 135)
        else if( angle > 0 && Math.abs(angle - 180) <= sorptionRange ) angle -= (angle - 180)
        else if( angle < 0 && Math.abs(angle + 180) <= sorptionRange ) angle -= (angle + 180)

        // 修改元素角度
        elementList.value = elementList.value.map(el => element.elId === el.elId ? { ...el, rotate: angle } : el)
      }

      document.onmouseup = () => {
        isMouseDown = false
        document.onmousemove = null
        document.onmouseup = null

        if(elOriginRotate === angle) return

        store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
      }
    }

    const scaleElement = (e: MouseEvent, element: Exclude<PPTElement, PPTLineElement>, command: ElementScaleHandler) => {
      let isMouseDown = true

      const elOriginLeft = element.left
      const elOriginTop = element.top
      const elOriginWidth = element.width
      const elOriginHeight = element.height

      const isLockRatio = ctrlOrShiftKeyActive.value || ('lockRatio' in element && element.lockRatio)
      const lockRatio = elOriginWidth / elOriginHeight
      
      const elRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
      const rotateRadian = Math.PI * elRotate / 180

      const startPageX = e.pageX
      const startPageY = e.pageY

      const minSize = 15
      const getSizeWithinRange = (size: number) => size < minSize ? minSize : size

      let points: ReturnType<typeof getRotateElementPoints>
      let baseLeft = 0
      let baseTop = 0
      let horizontalLines: AlignLine[] = []
      let verticalLines: AlignLine[] = []

      if('rotate' in element && element.rotate) {
        // 元素旋转后的各点坐标以及对角坐标
        const { left, top, width, height } = element
        points = getRotateElementPoints({ left, top, width, height }, elRotate)
        const oppositePoint = getOppositePoint(command, points)
  
        // 基点坐标（以操作点相对的点为基点，例如拖动右下角，实际上是保持左上角不变的前提下修改其他信息）
        baseLeft = oppositePoint.left
        baseTop = oppositePoint.top
      }
      else {
        const edgeWidth = VIEWPORT_SIZE
        const edgeHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
        const isActiveGroupElement = element.elId === activeGroupElementId.value
        
        for(const el of elementList.value) {
          if('rotate' in el && el.rotate) continue
          if(el.type === ElementTypes.LINE) continue
          if(isActiveGroupElement && el.elId === element.elId) continue
          if(!isActiveGroupElement && activeElementIdList.value.includes(el.elId)) continue

          const left = el.left
          const top = el.top
          const width = el.width
          const height = el.height
          const right = left + width
          const bottom = top + height

          const topLine: AlignLine = { value: top, range: [left, right] }
          const bottomLine: AlignLine = { value: bottom, range: [left, right] }
          const leftLine: AlignLine = { value: left, range: [top, bottom] }
          const rightLine: AlignLine = { value: right, range: [top, bottom] }

          horizontalLines.push(topLine, bottomLine)
          verticalLines.push(leftLine, rightLine)
        }

        // 页面边界、水平和垂直的中心位置
        const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] }
        const edgeBottomLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] }
        const edgeHorizontalCenterLine: AlignLine = { value: edgeHeight / 2, range: [0, edgeWidth] }
        const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] }
        const edgeRightLine: AlignLine = { value: edgeWidth, range: [0, edgeHeight] }
        const edgeVerticalCenterLine: AlignLine = { value: edgeWidth / 2, range: [0, edgeHeight] }

        horizontalLines.push(edgeTopLine, edgeBottomLine, edgeHorizontalCenterLine)
        verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine)
        
        horizontalLines = uniqAlignLines(horizontalLines)
        verticalLines = uniqAlignLines(verticalLines)
      }
      
      // 对齐吸附方法
      const alignedAdsorption = (currentX: number | null, currentY: number | null) => {
        const sorptionRange = 3

        const _alignmentLines: AlignmentLineProps[] = []
        let isVerticalAdsorbed = false
        let isHorizontalAdsorbed = false
        const correctionVal = { offsetX: 0, offsetY: 0 }
        
        if(currentY || currentY === 0) {
          for(let i = 0; i < horizontalLines.length; i++) {
            const { value, range } = horizontalLines[i]
            const min = Math.min(...range, currentX || 0)
            const max = Math.max(...range, currentX || 0)
            
            if(Math.abs(currentY - value) < sorptionRange) {
              if(!isHorizontalAdsorbed) {
                correctionVal.offsetY = currentY - value
                isHorizontalAdsorbed = true
              }
              _alignmentLines.push({type: 'horizontal', axis: {x: min - 20, y: value}, length: max - min + 40})
            }
          }
        }
        if(currentX || currentX === 0) {
          for(let i = 0; i < verticalLines.length; i++) {
            const { value, range } = verticalLines[i]
            const min = Math.min(...range, (currentY || 0))
            const max = Math.max(...range, (currentY || 0))
  
            if(Math.abs(currentX - value) < sorptionRange) {
              if(!isVerticalAdsorbed) {
                correctionVal.offsetX = currentX - value
                isVerticalAdsorbed = true
              }
              _alignmentLines.push({ type: 'vertical', axis: {x: value, y: min - 20}, length: max - min + 40 })
            }
          }
        }
        alignmentLines.value = _alignmentLines
        return correctionVal
      }

      document.onmousemove = e => {
        if(!isMouseDown) return

        const currentPageX = e.pageX
        const currentPageY = e.pageY

        const x = currentPageX - startPageX
        const y = currentPageY - startPageY

        let width = elOriginWidth
        let height = elOriginHeight
        let left = elOriginLeft
        let top = elOriginTop
        
        // 元素被旋转的情况下
        if(elRotate) {
          // 根据元素旋转的角度，修正鼠标按下后移动的距离（因为拖动的方向发生了改变）
          const revisedX = (Math.cos(rotateRadian) * x + Math.sin(rotateRadian) * y) / canvasScale.value
          let revisedY = (Math.cos(rotateRadian) * y - Math.sin(rotateRadian) * x) / canvasScale.value
  
          // 锁定宽高比例
          if(isLockRatio) {
            if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) revisedY = revisedX / lockRatio
            if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) revisedY = -revisedX / lockRatio
          }
  
          // 根据不同的操作点分别计算元素缩放后的大小和位置
          // 这里计算的位置是错误的，因为旋转后缩放实际上也改变了元素的位置，需要在后面进行矫正
          // 这里计算的大小是正确的，因为上面修正鼠标按下后移动的距离时其实已经进行过了矫正
          if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
            width = getSizeWithinRange(elOriginWidth + revisedX)
            height = getSizeWithinRange(elOriginHeight + revisedY)
          }
          else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
            width = getSizeWithinRange(elOriginWidth - revisedX)
            height = getSizeWithinRange(elOriginHeight + revisedY)
            left = elOriginLeft - (width - elOriginWidth)
          }
          else if(command === OPERATE_KEYS.LEFT_TOP) {
            width = getSizeWithinRange(elOriginWidth - revisedX)
            height = getSizeWithinRange(elOriginHeight - revisedY)
            left = elOriginLeft - (width - elOriginWidth)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.RIGHT_TOP) {
            width = getSizeWithinRange(elOriginWidth + revisedX)
            height = getSizeWithinRange(elOriginHeight - revisedY)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.TOP) {
            height = getSizeWithinRange(elOriginHeight - revisedY)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.BOTTOM) {
            height = getSizeWithinRange(elOriginHeight + revisedY)
          }
          else if(command === OPERATE_KEYS.LEFT) {
            width = getSizeWithinRange(elOriginWidth - revisedX)
            left = elOriginLeft - (width - elOriginWidth)
          }
          else if(command === OPERATE_KEYS.RIGHT) {
            width = getSizeWithinRange(elOriginWidth + revisedX)
          }
  
          // 获取当前元素基点坐标，与初始状态的基点坐标进行对比并矫正差值
          const currentPoints = getRotateElementPoints({ width, height, left, top }, elRotate)
          const currentOppositePoint = getOppositePoint(command, currentPoints)
          const currentBaseLeft = currentOppositePoint.left
          const currentBaseTop = currentOppositePoint.top
  
          const offsetX = currentBaseLeft - baseLeft
          const offsetY = currentBaseTop - baseTop
  
          left = left - offsetX
          top = top - offsetY
        }

        // 元素未被旋转的情况下，根据所操纵点的位置添加对齐吸附
        else {
          let moveX = x / canvasScale.value
          let moveY = y / canvasScale.value

          if(isLockRatio) {
            if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) moveY = moveX / lockRatio
            if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) moveY = -moveX / lockRatio
          }

          if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
            const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + elOriginHeight + moveY)
            moveX = moveX - offsetX
            moveY = moveY - offsetY
            if(isLockRatio) {
              if(offsetY) moveX = moveY * lockRatio
              else moveY = moveX / lockRatio
            }
            width = getSizeWithinRange(elOriginWidth + moveX)
            height = getSizeWithinRange(elOriginHeight + moveY)
          }
          else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
            const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + elOriginHeight + moveY)
            moveX = moveX - offsetX
            moveY = moveY - offsetY
            if(isLockRatio) {
              if(offsetY) moveX = -moveY * lockRatio
              else moveY = -moveX / lockRatio
            }
            width = getSizeWithinRange(elOriginWidth - moveX)
            height = getSizeWithinRange(elOriginHeight + moveY)
            left = elOriginLeft - (width - elOriginWidth)
          }
          else if(command === OPERATE_KEYS.LEFT_TOP) {
            const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + moveX, elOriginTop + moveY)
            moveX = moveX - offsetX
            moveY = moveY - offsetY
            if(isLockRatio) {
              if(offsetY) moveX = moveY * lockRatio
              else moveY = moveX / lockRatio
            }
            width = getSizeWithinRange(elOriginWidth - moveX)
            height = getSizeWithinRange(elOriginHeight - moveY)
            left = elOriginLeft - (width - elOriginWidth)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.RIGHT_TOP) {
            const { offsetX, offsetY } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, elOriginTop + moveY)
            moveX = moveX - offsetX
            moveY = moveY - offsetY
            if(isLockRatio) {
              if(offsetY) moveX = -moveY * lockRatio
              else moveY = -moveX / lockRatio
            }
            width = getSizeWithinRange(elOriginWidth + moveX)
            height = getSizeWithinRange(elOriginHeight - moveY)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.LEFT) {
            const { offsetX } = alignedAdsorption(elOriginLeft + moveX, null)
            moveX = moveX - offsetX
            width = getSizeWithinRange(elOriginWidth - moveX)
            left = elOriginLeft - (width - elOriginWidth)
          }
          else if(command === OPERATE_KEYS.RIGHT) {
            const { offsetX } = alignedAdsorption(elOriginLeft + elOriginWidth + moveX, null)
            moveX = moveX - offsetX
            width = getSizeWithinRange(elOriginWidth + moveX)
          }
          else if(command === OPERATE_KEYS.TOP) {
            const { offsetY } = alignedAdsorption(null, elOriginTop + moveY)
            moveY = moveY - offsetY
            height = getSizeWithinRange(elOriginHeight - moveY)
            top = elOriginTop - (height - elOriginHeight)
          }
          else if(command === OPERATE_KEYS.BOTTOM) {
            const { offsetY } = alignedAdsorption(null, elOriginTop + elOriginHeight + moveY)
            moveY = moveY - offsetY
            height = getSizeWithinRange(elOriginHeight + moveY)
          }
        }
        
        elementList.value = elementList.value.map(el => element.elId === el.elId ? { ...el, left, top, width, height } : el)
      }

      document.onmouseup = e => {
        isMouseDown = false
        document.onmousemove = null
        document.onmouseup = null
        alignmentLines.value = []

        if(startPageX === e.pageX && startPageY === e.pageY) return

        store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
      }
    }

    const scaleMultiElement = (e: MouseEvent, range: MultiSelectRange, command: ElementScaleHandler) => {
      let isMouseDown = true
      
      const { minX, maxX, minY, maxY } = range
      const operateWidth = maxX - minX
      const operateHeight = maxY - minY
      const lockRatio = operateWidth / operateHeight

      const startPageX = e.pageX
      const startPageY = e.pageY
  
      const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
  
      document.onmousemove = e => {
        if(!isMouseDown) return
        
        const currentPageX = e.pageX
        const currentPageY = e.pageY
  
        // 鼠标按下后移动的距离
        const x = (currentPageX - startPageX) / canvasScale.value
        let y = (currentPageY - startPageY) / canvasScale.value

        // 锁定宽高比例
        if(ctrlOrShiftKeyActive.value) {
          if(command === OPERATE_KEYS.RIGHT_BOTTOM || command === OPERATE_KEYS.LEFT_TOP) y = x / lockRatio
          if(command === OPERATE_KEYS.LEFT_BOTTOM || command === OPERATE_KEYS.RIGHT_TOP) y = -x / lockRatio
        }

        // 获取鼠标缩放时当前所有激活元素的范围
        let currentMinX = minX
        let currentMaxX = maxX
        let currentMinY = minY
        let currentMaxY = maxY

        if(command === OPERATE_KEYS.RIGHT_BOTTOM) {
          currentMaxX = maxX + x
          currentMaxY = maxY + y
        }
        else if(command === OPERATE_KEYS.LEFT_BOTTOM) {
          currentMinX = minX + x
          currentMaxY = maxY + y
        }
        else if(command === OPERATE_KEYS.LEFT_TOP) {
          currentMinX = minX + x
          currentMinY = minY + y
        }
        else if(command === OPERATE_KEYS.RIGHT_TOP) {
          currentMaxX = maxX + x
          currentMinY = minY + y
        }
        else if(command === OPERATE_KEYS.TOP) {
          currentMinY = minY + y
        }
        else if(command === OPERATE_KEYS.BOTTOM) {
          currentMaxY = maxY + y
        }
        else if(command === OPERATE_KEYS.LEFT) {
          currentMinX = minX + x
        }
        else if(command === OPERATE_KEYS.RIGHT) {
          currentMaxX = maxX + x
        }

        // 多选下所有元素整体宽高
        const currentOppositeWidth = currentMaxX - currentMinX
        const currentOppositeHeight = currentMaxY - currentMinY

        // 所有元素的整体宽高与被操作元素宽高的比例
        let widthScale = currentOppositeWidth / operateWidth
        let heightScale = currentOppositeHeight / operateHeight

        if(widthScale <= 0) widthScale = 0
        if(heightScale <= 0) heightScale = 0
        
        // 根据上面计算的比例，修改所有被激活元素的位置大小
        // 宽高通过乘以对应的比例得到，位置通过将被操作元素在所有元素整体中的相对位置乘以对应比例获得
        elementList.value = elementList.value.map(el => {
          const newEl = el
          if((newEl.type === ElementTypes.IMAGE || newEl.type === ElementTypes.SHAPE) && activeElementIdList.value.includes(newEl.elId)) {
            const originElement = originElementList.find(originEl => originEl.elId === el.elId)
            if(originElement && (originElement.type === ElementTypes.IMAGE || originElement.type === ElementTypes.SHAPE)) {
              newEl.width = originElement.width * widthScale
              newEl.height = originElement.height * heightScale
              newEl.left = currentMinX + (originElement.left - minX) * widthScale
              newEl.top = currentMinY + (originElement.top - minY) * heightScale
            }
          }
          return newEl
        })
      }

      document.onmouseup = e => {
        isMouseDown = false
        document.onmousemove = null
        document.onmouseup = null

        if(startPageX === e.pageX && startPageY === e.pageY) return

        store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
      }
    }

    const orderElement = (element: PPTElement, command: ElementOrderCommand) => {
      const newElementList = _orderElement(elementList.value, element, command)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }
    
    const combineElements = () => {
      const newElementList = _combineElements(elementList.value, activeElementList.value, activeElementIdList.value)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const uncombineElements = () => {
      const newElementList = _uncombineElements(elementList.value, activeElementList.value, activeElementIdList.value)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const alignElementToCanvas = (command: ElementAlignCommand) => {
      const newElementList = _alignElementToCanvas(elementList.value, activeElementList.value, activeElementIdList.value, command)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const selectAllElement = () => {
      const unlockedElements = elementList.value.filter(el => !el.isLock)
      const newActiveElementIdList = unlockedElements.map(el => el.elId)
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, newActiveElementIdList)
    }

    const deleteElement = () => {
      if(!activeElementIdList.value.length) return
      const newElementList = elementList.value.filter(el => !activeElementIdList.value.includes(el.elId))
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const deleteAllElements = () => {
      if(!elementList.value.length) return
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: [] })
    }

    const lockElement = (element: PPTElement) => {
      const newElementList = _lockElement(elementList.value, element, activeElementIdList.value)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const unlockElement = (element: PPTElement) => {
      const newElementList = _unlockElement(elementList.value, element)
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    }

    const copyElement = () => {
      if(!activeElementIdList.value.length) return

      const text = encrypt(JSON.stringify({
        type: 'elements',
        data: activeElementList.value,
      }))

      copyText(text).then(() => {
        store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
        message.success('元素已复制到剪贴板', 0.8)
      })
    }

    const cutElement = () => {
      copyElement()
      deleteElement()
    }

    const pasteElement = () => {
      readClipboard().then(text => {
        let clipboardData
        try {
          clipboardData = JSON.parse(decrypt(text))
        }
        catch {
          clipboardData = text
        }
        console.log(clipboardData)
      }).catch(err => message.warning(err))
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllElement,
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteElement,
        },
        {
          text: '清空本页',
          handler: deleteAllElements,
        },
      ]
    }

    return {
      elementList,
      activeElementIdList,
      activeElementList,
      handleElementId,
      activeGroupElementId,
      canvasRef,
      viewportRef,
      viewportStyles,
      canvasScale,
      mouseSelectionState,
      handleClickBlankArea,
      removeEditorAreaFocus,
      currentSlide,
      isShowGridLines,
      alignmentLines,
      selectElement,
      rotateElement,
      scaleElement,
      scaleMultiElement,
      orderElement,
      combineElements,
      uncombineElements,
      alignElementToCanvas,
      deleteElement,
      lockElement,
      unlockElement,
      copyElement,
      cutElement,
      contextmenus,
    }
  },
})
</script>

<style lang="scss" scoped>
.canvas {
  height: 100%;
  user-select: none;
  overflow: hidden;
  background-color: #f9f9f9;
  position: relative;
}
.viewport {
  position: absolute;
  transform-origin: 0 0;
  background-color: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .1);
}
</style>
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
        :activeElementList="activeElementList"
        :canvasScale="canvasScale"
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
        :canvasScale="canvasScale"
        :selectElement="selectElement"
        :rotateElement="rotateElement"
        :scaleElement="scaleElement"
        :orderElement="orderElement"
        :combineElements="combineElements"
        :uncombineElements="uncombineElements"
        :alignElement="alignElement"
        :deleteElement="deleteElement"
        :lockElement="lockElement"
        :copyElement="copyElement"
        :cutElement="cutElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import uniq from 'lodash/uniq'
import { State } from '@/store/state'
import { MutationTypes } from '@/store/constants'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { getImageDataURL } from '@/utils/image'
import { getElementRange } from './utils/elementRange'

import { PPTElement } from '@/types/slides'

import useDropImage from '@/hooks/useDropImage'
import useSetViewportSize from './hooks/useSetViewportSize'

import EditableElement from '@/views/_common/_element/EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import SlideBackground from './SlideBackground.vue'
import MultiSelectOperate from './MultiSelectOperate.vue'
import AlignmentLine, { AlignmentLineProps } from './AlignmentLine.vue'

export default defineComponent({
  name: 'v-canvas',
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
    onMounted(setLocalElementList)
    watch(currentSlide, setLocalElementList)

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

        // 原本就存在激活元素（可能需要清空），或者本次选择了至少一个元素（可能需要选择），才会具体更新激活元素状态
        // 否则不做多余的激活元素状态更新（原本就没有激活元素，本次也没有选择任何元素，只是点击了一下空白区域，状态为：空 -> 空）
        if(activeElementIdList.value.length > 0 || inRangeElementIdList.length) {
          store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, inRangeElementIdList)
        }

        mouseSelectionState.isShow = false
      }
    }

    const editorAreaFocus = computed(() => store.state.editorAreaFocus)

    const handleClickBlankArea = (e: MouseEvent) => {
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
    const rotateElement = () => {
      console.log('rotateElement')
    }
    const scaleElement = () => {
      console.log('scaleElement')
    }
    const scaleMultiElement = () => {
      console.log('scaleMultiElement')
    }
    const orderElement = () => {
      console.log('orderElement')
    }
    const combineElements = () => {
      console.log('combineElements')
    }
    const uncombineElements = () => {
      console.log('uncombineElements')
    }
    const alignElement = () => {
      console.log('alignElement')
    }
    const deleteElement = () => {
      console.log('deleteElement')
    }
    const lockElement = () => {
      console.log('lockElement')
    }
    const copyElement = () => {
      console.log('copyElement')
    }
    const cutElement = () => {
      console.log('cutElement')
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '全选',
          subText: 'Ctrl + A',
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
        },
        {
          text: '清空页面',
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
      alignElement,
      deleteElement,
      lockElement,
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
import { Ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'
import { getElementRange } from '@/utils/element'

export default (elementList: Ref<PPTElement[]>, viewportRef: Ref<HTMLElement | null>) => {
  const store = useStore<State>()
  const canvasScale = computed(() => store.state.canvasScale)

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
        if(isInclude && !element.lock) inRangeElementList.push(element)
      }

      // 对于组合元素成员，必须所有成员都在选择范围中才算被选中
      inRangeElementList = inRangeElementList.filter(inRangeElement => {
        if(inRangeElement.groupId) {
          const inRangeElementIdList = inRangeElementList.map(inRangeElement => inRangeElement.id)
          const groupElementList = elementList.value.filter(element => element.groupId === inRangeElement.groupId)
          return groupElementList.every(groupElement => inRangeElementIdList.includes(groupElement.id))
        }
        return true
      })
      const inRangeElementIdList = inRangeElementList.map(inRangeElement => inRangeElement.id)
      if(inRangeElementIdList.length) store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, inRangeElementIdList)

      mouseSelectionState.isShow = false
    }
  }

  return {
    mouseSelectionState,
    updateMouseSelection,
  }
}
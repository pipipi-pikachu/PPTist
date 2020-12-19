import { Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement, PPTTextElement, PPTImageElement, PPTShapeElement } from '@/types/slides'
import { getAngleFromCoordinate } from '../utils/elementRotate'

export default (elementList: Ref<PPTElement[]>, viewportRef: Ref<HTMLElement | null>, canvasScale: Ref<number>) => {
  const store = useStore<State>()

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

  return {
    rotateElement,
  }
}
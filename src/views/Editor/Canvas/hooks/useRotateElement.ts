import { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement, PPTLineElement, PPTVideoElement, PPTAudioElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 计算给定坐标到原点连线的弧度
 * @param x 坐标x
 * @param y 坐标y
 */
const getAngleFromCoordinate = (x: number, y: number) => {
  const radian = Math.atan2(x, y)
  const angle = 180 / Math.PI * radian
  return angle
}

export default (elementList: Ref<PPTElement[]>, viewportRef: Ref<HTMLElement | undefined>) => {
  const slidesStore = useSlidesStore()
  const { canvasScale } = storeToRefs(useMainStore())

  const { addHistorySnapshot } = useHistorySnapshot()

  // 旋转元素
  const rotateElement = (element: Exclude<PPTElement, PPTLineElement | PPTVideoElement | PPTAudioElement>) => {
    let isMouseDown = true
    let angle = 0
    const elOriginRotate = element.rotate || 0

    const elLeft = element.left
    const elTop = element.top
    const elWidth = element.width
    const elHeight = element.height

    // 元素中心点（旋转中心点）
    const centerX = elLeft + elWidth / 2
    const centerY = elTop + elHeight / 2

    if (!viewportRef.value) return
    const viewportRect = viewportRef.value.getBoundingClientRect()

    document.onmousemove = e => {
      if (!isMouseDown) return
      
      // 计算当前鼠标位置相对元素中心点连线的角度（弧度）
      const mouseX = (e.pageX - viewportRect.left) / canvasScale.value
      const mouseY = (e.pageY - viewportRect.top) / canvasScale.value
      const x = mouseX - centerX
      const y = centerY - mouseY

      angle = getAngleFromCoordinate(x, y)

      // 靠近45倍数的角度时有吸附效果
      const sorptionRange = 5
      if ( Math.abs(angle) <= sorptionRange ) angle = 0
      else if ( angle > 0 && Math.abs(angle - 45) <= sorptionRange ) angle -= (angle - 45)
      else if ( angle < 0 && Math.abs(angle + 45) <= sorptionRange ) angle -= (angle + 45)
      else if ( angle > 0 && Math.abs(angle - 90) <= sorptionRange ) angle -= (angle - 90)
      else if ( angle < 0 && Math.abs(angle + 90) <= sorptionRange ) angle -= (angle + 90)
      else if ( angle > 0 && Math.abs(angle - 135) <= sorptionRange ) angle -= (angle - 135)
      else if ( angle < 0 && Math.abs(angle + 135) <= sorptionRange ) angle -= (angle + 135)
      else if ( angle > 0 && Math.abs(angle - 180) <= sorptionRange ) angle -= (angle - 180)
      else if ( angle < 0 && Math.abs(angle + 180) <= sorptionRange ) angle -= (angle + 180)

      elementList.value = elementList.value.map(el => element.id === el.id ? { ...el, rotate: angle } : el)
    }

    document.onmouseup = () => {
      isMouseDown = false
      document.onmousemove = null
      document.onmouseup = null

      if (elOriginRotate === angle) return

      slidesStore.updateSlide({ elements: elementList.value })
      addHistorySnapshot()
    }
  }

  return {
    rotateElement,
  }
}
import { Ref, computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement, PPTTextElement, PPTImageElement, PPTShapeElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

// 给定一个坐标，计算该坐标到(0, 0)点连线的弧度值
// 注意，Math.atan2的一般用法是Math.atan2(y, x)返回的是原点(0,0)到(x,y)点的线段与X轴正方向之间的弧度值
// 这里将使用时将x与y的传入顺序交换了，为的是获取原点(0,0)到(x,y)点的线段与Y轴正方向之间的弧度值
const getAngleFromCoordinate = (x: number, y: number) => {
  const radian = Math.atan2(x, y)
  const angle = 180 / Math.PI * radian
  return angle
}

export default (elementList: Ref<PPTElement[]>, viewportRef: Ref<HTMLElement | undefined>) => {
  const store = useStore()
  const canvasScale = computed(() => store.state.canvasScale)

  const { addHistorySnapshot } = useHistorySnapshot()

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

    if (!viewportRef.value) return
    const viewportRect = viewportRef.value.getBoundingClientRect()

    document.onmousemove = e => {
      if (!isMouseDown) return
      
      // 计算鼠标基于旋转中心的坐标
      const mouseX = (e.pageX - viewportRect.left) / canvasScale.value
      const mouseY = (e.pageY - viewportRect.top) / canvasScale.value
      const x = mouseX - centerX
      const y = centerY - mouseY

      angle = getAngleFromCoordinate(x, y)

      // 45°的倍数位置有吸附效果
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

      // 修改元素角度
      elementList.value = elementList.value.map(el => element.id === el.id ? { ...el, rotate: angle } : el)
    }

    document.onmouseup = () => {
      isMouseDown = false
      document.onmousemove = null
      document.onmouseup = null

      if (elOriginRotate === angle) return

      store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList.value })
      addHistorySnapshot()
    }
  }

  return {
    rotateElement,
  }
}
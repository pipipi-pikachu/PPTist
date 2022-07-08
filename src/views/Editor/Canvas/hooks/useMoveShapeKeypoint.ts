import { Ref } from 'vue'
import { useSlidesStore } from '@/store'
import { PPTElement, PPTShapeElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { SHAPE_PATH_FORMULAS } from '@/configs/shapes'

interface ShapePathData {
  baseSize: number,
  originPos: number,
  min: number,
  max: number,
  relative: string,
}

export default (
  elementList: Ref<PPTElement[]>,
  canvasScale: Ref<number>,
) => {
  const slidesStore = useSlidesStore()

  const { addHistorySnapshot } = useHistorySnapshot()

  const moveShapeKeypoint = (e: MouseEvent | TouchEvent, element: PPTShapeElement) => {
    const isTouchEvent = !(e instanceof MouseEvent)
    if (isTouchEvent && (!e.changedTouches || !e.changedTouches[0])) return

    let isMouseDown = true
  
    const startPageX = isTouchEvent ? e.changedTouches[0].pageX : e.pageX
    const startPageY = isTouchEvent ? e.changedTouches[0].pageY : e.pageY

    const pathFormula = SHAPE_PATH_FORMULAS[element.pathFormula!]
    let shapePathData: ShapePathData | null = null
    if ('editable' in pathFormula) {
      const baseSize = pathFormula.getBaseSize(element.width, element.height)
      const originPos = baseSize * element.keypoint!
      const [min, max] = pathFormula.range
      const relative = pathFormula.relative

      shapePathData = { baseSize, originPos, min, max, relative }
    }

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return

      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY
      const moveX = (currentPageX - startPageX) / canvasScale.value
      const moveY = (currentPageY - startPageY) / canvasScale.value

      elementList.value = elementList.value.map(el => {
        if (el.id === element.id && shapePathData) {
          const { baseSize, originPos, min, max, relative } = shapePathData
          const shapeElement = el as PPTShapeElement

          let keypoint = 0

          if (relative === 'left') keypoint = (originPos + moveX) / baseSize
          if (relative === 'right') keypoint = (originPos - moveX) / baseSize
          if (relative === 'center') keypoint = (originPos - moveX * 2) / baseSize
          if (relative === 'top') keypoint = (originPos + moveY) / baseSize
          if (relative === 'bottom') keypoint = (originPos - moveY) / baseSize

          if (keypoint < min) keypoint = min
          if (keypoint > max) keypoint = max

          return {
            ...el,
            keypoint,
            path: pathFormula.formula(shapeElement.width, shapeElement.height, keypoint),
          }
        }
        return el
      })
    }

    const handleMouseup = (e: MouseEvent | TouchEvent) => {
      isMouseDown = false
      
      document.ontouchmove = null
      document.ontouchend = null
      document.onmousemove = null
      document.onmouseup = null

      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      if (startPageX === currentPageX && startPageY === currentPageY) return

      slidesStore.updateSlide({ elements: elementList.value })
      addHistorySnapshot()
    }

    if (isTouchEvent) {
      document.ontouchmove = handleMousemove
      document.ontouchend = handleMouseup
    }
    else {
      document.onmousemove = handleMousemove
      document.onmouseup = handleMouseup
    }
  }

  return {
    moveShapeKeypoint,
  }
}
import { ref, reactive, Ref, toRefs } from 'vue'

export default (e: MouseEvent, viewportRef: Ref<HTMLElement | null>, canvasScale: number) => {
  const isMouseDown = ref(false)
  const mouseSelectionState = reactive({
    isShow: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    quadrant: 4,
  })
  const startMousePosition = reactive({
    x: 0,
    y: 0,
  })

  const minSelectionRange = 5

  if(!viewportRef.value) return

  isMouseDown.value = true
  const viewportRect = viewportRef.value.getBoundingClientRect()

  startMousePosition.x = e.pageX
  startMousePosition.y = e.pageY

  mouseSelectionState.top = (startMousePosition.x - viewportRect.y) / canvasScale
  mouseSelectionState.left = (startMousePosition.y - viewportRect.x) / canvasScale

  const mousemoveListener = (e: MouseEvent) => {
    if(!isMouseDown.value) return

    const currentPageX = e.pageX
    const currentPageY = e.pageY

    const offsetWidth = (currentPageX - startMousePosition.x) / canvasScale
    const offsetHeight = (currentPageY - startMousePosition.y) / canvasScale

    const width = Math.abs(offsetWidth)
    const height = Math.abs(offsetHeight)

    if(width < minSelectionRange || height < minSelectionRange) return
    
    let quadrant = 0
    if(offsetWidth > 0 && offsetHeight > 0) quadrant = 4
    else if(offsetWidth < 0 && offsetHeight < 0) quadrant = 1
    else if(offsetWidth > 0 && offsetHeight < 0) quadrant = 2
    else if(offsetWidth < 0 && offsetHeight > 0) quadrant = 3

    mouseSelectionState.isShow = true
    mouseSelectionState.quadrant = quadrant
    mouseSelectionState.width = width
    mouseSelectionState.height = height
  }
  const mouseupListener = () => {
    isMouseDown.value = false
    mouseSelectionState.isShow = false

    document.removeEventListener('mousemove', mousemoveListener)
    document.removeEventListener('mouseup', mouseupListener)
  }

  document.addEventListener('mousemove', mousemoveListener)
  document.addEventListener('mouseup', mouseupListener)

  return { ...toRefs(mouseSelectionState) }
}
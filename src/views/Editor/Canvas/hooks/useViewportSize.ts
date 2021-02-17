import { ref, computed, onMounted, onUnmounted, Ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

export default (canvasRef: Ref<HTMLElement | undefined>) => {
  const viewportLeft = ref(0)
  const viewportTop = ref(0)

  const store = useStore()
  const canvasPercentage = computed(() => store.state.canvasPercentage)

  // 计算画布可视区域的位置
  const setViewportPosition = () => {
    if (!canvasRef.value) return
    const canvasWidth = canvasRef.value.clientWidth
    const canvasHeight = canvasRef.value.clientHeight

    if (canvasHeight / canvasWidth > VIEWPORT_ASPECT_RATIO) {
      const viewportActualWidth = canvasWidth * (canvasPercentage.value / 100)
      store.commit(MutationTypes.SET_CANVAS_SCALE, viewportActualWidth / VIEWPORT_SIZE)
      viewportLeft.value = (canvasWidth - viewportActualWidth) / 2
      viewportTop.value = (canvasHeight - viewportActualWidth * VIEWPORT_ASPECT_RATIO) / 2
    }
    else {
      const viewportActualHeight = canvasHeight * (canvasPercentage.value / 100)
      store.commit(MutationTypes.SET_CANVAS_SCALE, viewportActualHeight / (VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO))
      viewportLeft.value = (canvasWidth - viewportActualHeight / VIEWPORT_ASPECT_RATIO) / 2
      viewportTop.value = (canvasHeight - viewportActualHeight) / 2
    }
  }

  // 可视区域缩放时，更新可视区域的位置
  watch(canvasPercentage, setViewportPosition)

  // 画布可视区域位置和大小的样式
  const viewportStyles = computed(() => ({
    width: VIEWPORT_SIZE,
    height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
    left: viewportLeft.value,
    top: viewportTop.value,
  }))

  // 监听画布尺寸发生变化时，更新可视区域的位置
  const resizeObserver = new ResizeObserver(setViewportPosition)

  onMounted(() => {
    if (canvasRef.value) resizeObserver.observe(canvasRef.value)
  })
  onUnmounted(() => {
    if (canvasRef.value) resizeObserver.unobserve(canvasRef.value)
  })

  return {
    viewportStyles,
  }
}
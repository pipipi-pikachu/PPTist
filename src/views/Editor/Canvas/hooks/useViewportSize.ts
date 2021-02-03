import { ref, computed, onMounted, onUnmounted, Ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

export default (canvasRef: Ref<HTMLElement | undefined>) => {
  const viewportLeft = ref(0)
  const viewportTop = ref(0)

  const store = useStore()
  const canvasPercentage = computed(() => store.state.canvasPercentage)

  const setViewportSize = () => {
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

  watch(canvasPercentage, setViewportSize)

  const viewportStyles = computed(() => ({
    width: VIEWPORT_SIZE,
    height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
    left: viewportLeft.value,
    top: viewportTop.value,
  }))

  const resizeObserver = new ResizeObserver(setViewportSize)

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
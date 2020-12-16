import { ref, computed, onMounted, onUnmounted, Ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store/state'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

export default (canvasRef: Ref<HTMLElement | null>) => {
  const canvasScale = ref(1)
  const viewportLeft = ref(0)
  const viewportTop = ref(0)

  const store = useStore<State>()
  const editorAreaShowScale = computed(() => store.state.editorAreaShowScale)

  const setViewportSize = () => {
    if(!canvasRef.value) return
    const canvasWidth = canvasRef.value.clientWidth
    const canvasHeight = canvasRef.value.clientHeight

    if(canvasHeight / canvasWidth > VIEWPORT_ASPECT_RATIO) {
      const viewportActualWidth = canvasWidth * (editorAreaShowScale.value / 100)
      canvasScale.value = viewportActualWidth / VIEWPORT_SIZE
      viewportLeft.value = (canvasWidth - viewportActualWidth) / 2
      viewportTop.value = (canvasHeight - viewportActualWidth * VIEWPORT_ASPECT_RATIO) / 2
    }
    else {
      const viewportActualHeight = canvasHeight * (editorAreaShowScale.value / 100)
      canvasScale.value = viewportActualHeight / (VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO)
      viewportLeft.value = (canvasWidth - viewportActualHeight / VIEWPORT_ASPECT_RATIO) / 2
      viewportTop.value = (canvasHeight - viewportActualHeight) / 2
    }
  }

  const resizeObserver = new ResizeObserver(setViewportSize)

  onMounted(() => {
    if(canvasRef.value) resizeObserver.observe(canvasRef.value)
  })
  onUnmounted(() => {
    if(canvasRef.value) resizeObserver.unobserve(canvasRef.value)
  })

  return {
    canvasScale,
    viewportLeft,
    viewportTop,
  }
}
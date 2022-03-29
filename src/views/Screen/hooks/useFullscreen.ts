import { onMounted, onUnmounted, ref } from 'vue'
import { isFullscreen, exitFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'

export default () => {
  const fullscreenState = ref(true)
  const escExit = ref(true)

  const { exitScreening } = useScreening()

  const windowResizeListener = () => {
    fullscreenState.value = isFullscreen()
    if (!fullscreenState.value && escExit.value) exitScreening()

    escExit.value = true
  }

  onMounted(() => {
    fullscreenState.value = isFullscreen()
    window.addEventListener('resize', windowResizeListener)
  })
  onUnmounted(() => window.removeEventListener('resize', windowResizeListener))

  const manualExitFullscreen = () => {
    if (!fullscreenState.value) return
    escExit.value = false
    exitFullscreen()
  }

  return {
    fullscreenState,
    manualExitFullscreen,
  }
}
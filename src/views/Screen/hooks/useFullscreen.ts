import { onMounted, onUnmounted, ref } from 'vue'
import { isFullscreen, exitFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'

export default () => {
  const fullscreenState = ref(true)
  const escExit = ref(true)

  const { exitScreening } = useScreening()

  const handleFullscreenChange = () => {
    fullscreenState.value = isFullscreen()
    if (!fullscreenState.value && escExit.value) exitScreening()

    escExit.value = true
  }

  onMounted(() => {
    fullscreenState.value = isFullscreen()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari 兼容
  })
  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  })

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
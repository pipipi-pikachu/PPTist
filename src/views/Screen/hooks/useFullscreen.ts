import { ref } from 'vue'
import { exitFullscreen } from '@/utils/fullscreen'

export default () => {
  const fullscreenState = ref(true)
  const escExit = ref(true)

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
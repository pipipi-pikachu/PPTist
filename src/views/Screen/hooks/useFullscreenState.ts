import { onMounted, onUnmounted, ref } from 'vue'
import { isFullscreen } from '@/utils/fullscreen'

export default () => {
  const fullscreenState = ref(true)

  const windowResizeListener = () => fullscreenState.value = isFullscreen()

  onMounted(() => window.addEventListener('resize', windowResizeListener))
  onUnmounted(() => window.removeEventListener('resize', windowResizeListener))

  return {
    fullscreenState,
  }
}
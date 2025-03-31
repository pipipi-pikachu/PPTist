import { useScreenStore, useSlidesStore } from '@/store'
import { enterFullscreen, exitFullscreen, isFullscreen } from '@/utils/fullscreen'

export default () => {
  const screenStore = useScreenStore()
  const slidesStore = useSlidesStore()

  // 进入放映状态（从当前页开始）
  const enterScreening = () => {
    enterFullscreen()
    screenStore.changeScreeningMode('base')
    screenStore.setScreening(true)
  }

  // 进入放映状态（从第一页开始）
  const enterScreeningFromStart = () => {
    screenStore.changeScreeningMode('base')
    slidesStore.updateSlideIndex(0)
    enterScreening()
  }

  // 退出放映状态
  const exitScreening = () => {
    if (screenStore.screeningMode !== 'presenter') {
      if (screenStore.presenterBCChannel) {
        screenStore.presenterBCChannel.bc.postMessage({
          origin: screenStore.presenterBCChannel.bcID,
          message: {
            action: 'exitScreeningByBC'
          },
        })
      }
      
      screenStore.changeScreeningMode(undefined)
      screenStore.setScreening(false)
      if (isFullscreen()) exitFullscreen()
    }
  }

  return {
    enterScreening,
    enterScreeningFromStart,
    exitScreening,
  }
}
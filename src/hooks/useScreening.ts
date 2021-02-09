import { MutationTypes, useStore } from '@/store'
import { enterFullscreen, exitFullscreen, isFullscreen } from '@/utils/fullscreen'

export default () => {
  const store = useStore()

  // 进入放映状态（从当前页开始）
  const enterScreening = () => {
    enterFullscreen()
    store.commit(MutationTypes.SET_SCREENING, true)
  }

  // 进入放映状态（从第一页开始）
  const enterScreeningFromStart = () => {
    store.commit(MutationTypes.UPDATE_SLIDE_INDEX, 0)
    enterScreening()
  }

  // 退出放映状态
  const exitScreening = () => {
    store.commit(MutationTypes.SET_SCREENING, false)
    if (isFullscreen()) exitFullscreen()
  }

  return {
    enterScreening,
    enterScreeningFromStart,
    exitScreening,
  }
}
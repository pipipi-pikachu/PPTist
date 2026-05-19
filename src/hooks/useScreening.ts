import { useScreenStore, useSlidesStore } from '@/store'
import { enterFullscreen, exitFullscreen, isFullscreen } from '@/utils/fullscreen'

/**
 * 提供进入和退出放映状态的操作。
 *
 * @returns 包含从当前页放映、从第一页放映和退出放映的方法对象。
 * @throws 浏览器全屏 API、store 更新异常会按运行时行为表现。
 * @remarks
 * - 放映状态由 screenStore.screening 维护。
 * - 浏览器全屏状态和项目放映状态是两个概念，进入放映会尝试进入全屏，退出放映会在当前全屏时退出全屏。
 * - 浏览器可能要求全屏请求由用户手势触发。
 */
export default () => {
  // 获取放映 store，用于设置项目放映状态。
  const screenStore = useScreenStore()
  // 获取幻灯片 store，用于从第一页放映时重置当前页索引。
  const slidesStore = useSlidesStore()

  /**
   * 从当前页进入放映状态。
   *
   * @returns 无显式返回值。
   * @throws 浏览器全屏 API 或 store 更新异常会按运行时行为表现。
   */
  const enterScreening = () => {
    // 尝试让页面进入浏览器全屏。
    enterFullscreen()
    // 设置项目内部放映状态为 true。
    screenStore.setScreening(true)
  }

  /**
   * 从第一页进入放映状态。
   *
   * @returns 无显式返回值。
   * @throws 浏览器全屏 API 或 store 更新异常会按运行时行为表现。
   * @remarks 会先把当前页索引重置为 0，再进入放映。
   */
  const enterScreeningFromStart = () => {
    // 将当前页切换到第一页。
    slidesStore.updateSlideIndex(0)
    // 进入放映状态。
    enterScreening()
  }

  /**
   * 退出放映状态。
   *
   * @returns 无显式返回值。
   * @throws 浏览器退出全屏 API 或 store 更新异常会按运行时行为表现。
   */
  const exitScreening = () => {
    // 设置项目内部放映状态为 false。
    screenStore.setScreening(false)
    // 如果浏览器当前处于全屏状态，则同步退出全屏。
    if (isFullscreen()) exitFullscreen()
  }

  // 返回放映控制方法。
  return {
    enterScreening,
    enterScreeningFromStart,
    exitScreening,
  }
}

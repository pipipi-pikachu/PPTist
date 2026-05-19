import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

/**
 * 提供编辑器画布缩放和重置能力。
 *
 * @returns 包含画布缩放百分比文本、设置缩放比例、增减缩放、重置画布的方法对象。
 * @throws 当前 composable 不主动抛错；store 更新异常会按运行时错误表现。
 * @remarks
 * - `canvasPercentage` 是用于控制可视区域百分比的状态。
 * - `canvasScale` 是实际画布缩放比例，通常由布局计算得出。
 * - 设置目标 scale 时，会反算需要写入的 canvasPercentage。
 */
export default () => {
  // 获取主状态 store，用于读写画布缩放和拖拽状态。
  const mainStore = useMainStore()
  // 当前画布百分比、实际缩放比例和是否被拖拽移动。
  const { canvasPercentage, canvasScale, canvasDragged } = storeToRefs(mainStore)

  // 将实际缩放比例转换为 UI 显示用百分比文本。
  const canvasScalePercentage = computed(() => Math.round(canvasScale.value * 100) + '%')

  /**
   * 按固定步长缩放画布百分比。
   *
   * @param command - 缩放命令：`+` 表示放大，`-` 表示缩小。
   * @returns 无显式返回值。
   * @throws store 更新异常会按运行时错误表现。
   * @remarks 当前边界判断保持既有行为：等于 max 时仍会加一步，等于 min 时仍会减一步。
   */
  const scaleCanvas = (command: '+' | '-') => {
    // 读取当前画布百分比。
    let percentage = canvasPercentage.value
    // 每次缩放步长为 5。
    const step = 5
    // 缩放上限参考值。
    const max = 200
    // 缩放下限参考值。
    const min = 30
    // 放大命令且当前值未超过上限时增加百分比。
    if (command === '+' && percentage <= max) percentage += step
    // 缩小命令且当前值未低于下限时减少百分比。
    if (command === '-' && percentage >= min) percentage -= step

    // 写回新的画布百分比。
    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * 设置目标画布缩放比例。
   *
   * @param value - 目标画布缩放比例，例如 1 表示 100%。
   * @returns 无显式返回值。
   * @throws store 更新异常会按运行时错误表现。
   * @remarks
   * - 该函数不会直接写入 canvasScale。
   * - 它会根据当前 canvasScale 与 canvasPercentage 反算新的 canvasPercentage，让布局系统动态得到目标缩放。
   */
  const setCanvasScalePercentage = (value: number) => {
    // 根据目标缩放比例反算需要设置的百分比，并保留两位小数级别。
    const percentage = Math.round(value / canvasScale.value * canvasPercentage.value) / 100
    // 写回画布百分比。
    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * 重置画布尺寸和拖拽状态。
   *
   * @returns 无显式返回值。
   * @throws store 更新异常会按运行时错误表现。
   * @remarks 默认把画布百分比重置为 90，并清除拖拽状态。
   */
  const resetCanvas = () => {
    // 恢复默认画布百分比。
    mainStore.setCanvasPercentage(90)
    // 如果画布曾被拖拽移动，则清除拖拽标记。
    if (canvasDragged) mainStore.setCanvasDragged(false)
  }

  // 返回画布缩放相关状态和操作方法。
  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    scaleCanvas,
    resetCanvas,
  }
}

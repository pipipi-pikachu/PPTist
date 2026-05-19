import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTShapeElement } from '@/types/slides'

/**
 * 提供形状格式刷开关能力。
 *
 * @returns 包含 `toggleShapeFormatPainter` 的方法对象。
 * @throws 当前 composable 不主动抛错；当前操作元素不是形状时读取字段可能得到 undefined。
 * @remarks
 * - 开启格式刷时，会从当前 handleElement 捕获形状外观样式。
 * - 已开启时再次调用会关闭格式刷。
 * - 捕获字段包括填充、渐变、描边、透明度和阴影。
 */
export default () => {
  // 获取主状态 store，用于读写形状格式刷状态。
  const mainStore = useMainStore()
  // 当前形状格式刷状态和当前操作元素。
  const { shapeFormatPainter, handleElement } = storeToRefs(mainStore)

  /**
   * 切换形状格式刷状态。
   *
   * @param keep - 是否保持格式刷持续可用。
   * @returns 无显式返回值。
   * @throws store 更新异常会按运行时错误表现。
   * @remarks 调用方应保证当前 handleElement 是形状元素。
   */
  const toggleShapeFormatPainter = (keep = false) => {
    // 将当前操作元素按形状元素读取，用于捕获形状样式字段。
    const _handleElement = handleElement.value as PPTShapeElement

    // 已经开启格式刷时，再次调用表示关闭。
    if (shapeFormatPainter.value) mainStore.setShapeFormatPainter(null)
    // 未开启格式刷时，从当前形状元素捕获样式。
    else {
      // 写入形状格式刷状态。
      mainStore.setShapeFormatPainter({
        // 是否保持格式刷连续应用。
        keep,
        // 形状填充色。
        fill: _handleElement.fill,
        // 形状渐变配置。
        gradient: _handleElement.gradient,
        // 形状描边配置。
        outline: _handleElement.outline,
        // 形状透明度。
        opacity: _handleElement.opacity,
        // 形状阴影配置。
        shadow: _handleElement.shadow,
      })
    }
  }

  // 返回形状格式刷开关方法。
  return {
    toggleShapeFormatPainter,
  }
}

import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

/**
 * 提供富文本格式刷开关能力。
 *
 * @returns 包含 `toggleTextFormatPainter` 的方法对象。
 * @throws 当前 composable 不主动抛错；store 更新异常会按运行时错误表现。
 * @remarks
 * - 开启格式刷时，会从当前 richTextAttrs 中捕获一组文本样式属性。
 * - 已开启时再次调用会关闭格式刷。
 * - keep 表示是否持续应用格式刷，具体消费逻辑由后续文本编辑流程决定。
 */
export default () => {
  // 获取主状态 store，用于读写文本格式刷状态。
  const mainStore = useMainStore()
  // 当前富文本属性和文本格式刷状态。
  const { richTextAttrs, textFormatPainter } = storeToRefs(mainStore)

  /**
   * 切换文本格式刷状态。
   *
   * @param keep - 是否保持格式刷持续可用。
   * @returns 无显式返回值。
   * @throws store 更新异常会按运行时错误表现。
   */
  const toggleTextFormatPainter = (keep = false) => {
    // 已经开启格式刷时，再次调用表示关闭。
    if (textFormatPainter.value) mainStore.setTextFormatPainter(null)
    // 未开启格式刷时，从当前富文本状态捕获样式属性。
    else {
      // 写入文本格式刷状态。
      mainStore.setTextFormatPainter({
        // 是否保持格式刷连续应用。
        keep,
        // 粗体状态。
        bold: richTextAttrs.value.bold,
        // 斜体状态。
        em: richTextAttrs.value.em,
        // 下划线状态。
        underline: richTextAttrs.value.underline,
        // 删除线状态。
        strikethrough: richTextAttrs.value.strikethrough,
        // 文字颜色。
        color: richTextAttrs.value.color,
        // 文字背景色。
        backcolor: richTextAttrs.value.backcolor,
        // 字体名称。
        fontname: richTextAttrs.value.fontname,
        // 字号。
        fontsize: richTextAttrs.value.fontsize,
        // 文本对齐方式。
        align: richTextAttrs.value.align,
      })
    }
  }

  // 返回文本格式刷开关方法。
  return {
    toggleTextFormatPainter,
  }
}

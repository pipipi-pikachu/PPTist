import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import usePasteTextClipboardData from './usePasteTextClipboardData'
import usePasteDataTransfer from './usePasteDataTransfer'

/**
 * 注册全局粘贴事件监听，并把剪贴板数据分发到文件或文本粘贴逻辑。
 *
 * @returns 无返回值。
 * @throws 当前 composable 不主动抛错；粘贴解析和下游创建/导入异常会按对应函数行为表现。
 * @remarks
 * - 只有编辑区或缩略图区域处于焦点状态时才响应粘贴。
 * - 禁用快捷键状态下不处理粘贴，避免与弹窗、输入框或其他交互冲突。
 * - 文件优先于文本处理；没有可处理文件时才读取 text/plain。
 */
export default () => {
  // 读取编辑区焦点、缩略图焦点和快捷键禁用状态。
  const { editorAreaFocus, thumbnailsFocus, disableHotkeys } = storeToRefs(useMainStore())

  // 获取文本剪贴板解析方法。
  const { pasteTextClipboardData } = usePasteTextClipboardData()
  // 获取 DataTransfer 文件解析方法。
  const { pasteDataTransfer } = usePasteDataTransfer()

  /**
   * 粘贴事件监听器。
   *
   * @param e - 浏览器粘贴事件对象。
   * @returns 无显式返回值。
   * @throws 下游文件或文本粘贴处理异常会按对应函数行为表现。
   * @remarks
   * - 事件监听挂在 document 上，因此必须先判断当前业务焦点是否允许处理。
   * - 不主动 preventDefault，保持浏览器默认行为由现有逻辑决定。
   */
  const pasteListener = (e: ClipboardEvent) => {
    // 编辑区和缩略图区域都没有焦点时，不响应全局粘贴。
    if (!editorAreaFocus.value && !thumbnailsFocus.value) return
    // 快捷键禁用时不处理粘贴，避免影响弹窗、输入框等局部输入场景。
    if (disableHotkeys.value) return

    // 部分环境或事件可能没有 clipboardData，无法解析时直接返回。
    if (!e.clipboardData) return

    // 先尝试处理剪贴板中的文件内容。
    const { isFile, dataTransferFirstItem } = pasteDataTransfer(e.clipboardData)
    // 文件已处理时不再继续按文本粘贴。
    if (isFile) return
    
    // 如果剪贴板内不存在有效文件，但有文字内容，尝试解析文字内容
    if (dataTransferFirstItem && dataTransferFirstItem.kind === 'string' && dataTransferFirstItem.type === 'text/plain') {
      // 异步读取 text/plain 内容并交给文本粘贴分发逻辑。
      dataTransferFirstItem.getAsString(text => pasteTextClipboardData(text))
    }
  }

  // 组件挂载时注册 document 级粘贴监听。
  onMounted(() => {
    document.addEventListener('paste', pasteListener)
  })
  // 组件卸载时移除监听，避免重复绑定或内存泄漏。
  onUnmounted(() => {
    document.removeEventListener('paste', pasteListener)
  })
}

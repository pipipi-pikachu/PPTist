/**
 * 清除当前窗口中的所有文字选区。
 *
 * @returns 无显式返回值。
 * @throws 在没有 `window` 的非浏览器环境中调用会触发引用错误。
 * @remarks
 * - 该函数主要用于编辑器交互结束后清理浏览器原生文本选区，避免拖拽、缩放或快捷键操作时残留蓝色选中状态。
 * - `window.getSelection()` 在极少数环境下可能返回 `null`，因此这里保留空值判断。
 * - 该函数只影响浏览器原生 Selection，不会清理项目内 Pinia 维护的元素选中状态。
 */
export const removeAllRanges = () => {
  // 读取当前窗口的原生 Selection 对象，代表用户在页面上的文本选区。
  const selection = window.getSelection()
  // 当 Selection 存在时移除全部 Range；不存在时静默跳过，保持调用方无需额外判空。
  selection && selection.removeAllRanges()
}

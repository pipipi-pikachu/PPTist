import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import usePasteTextClipboardData from './usePasteTextClipboardData'
import usePasteDataTransfer from './usePasteDataTransfer'

export default () => {
  const { editorAreaFocus, thumbnailsFocus, disableHotkeys } = storeToRefs(useMainStore())

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { pasteDataTransfer } = usePasteDataTransfer()

  /**
   * 粘贴事件监听
   * @param e ClipboardEvent
   */
  const pasteListener = (e: ClipboardEvent) => {
    if (!editorAreaFocus.value && !thumbnailsFocus.value) return
    if (disableHotkeys.value) return

    if (!e.clipboardData) return

    const { isFile, dataTransferFirstItem } = pasteDataTransfer(e.clipboardData)
    if (isFile) return
    
    // 如果剪贴板内不存在有效文件，但有文字内容，尝试解析文字内容
    if (dataTransferFirstItem && dataTransferFirstItem.kind === 'string' && dataTransferFirstItem.type === 'text/plain') {
      dataTransferFirstItem.getAsString(text => pasteTextClipboardData(text))
    }
  }

  onMounted(() => {
    document.addEventListener('paste', pasteListener)
  })
  onUnmounted(() => {
    document.removeEventListener('paste', pasteListener)
  })
}
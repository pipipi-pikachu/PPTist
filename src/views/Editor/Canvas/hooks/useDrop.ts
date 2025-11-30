import { onMounted, onUnmounted, type ShallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { parseText2Paragraphs } from '@/utils/textParser'
import useCreateElement from '@/hooks/useCreateElement'
import usePasteDataTransfer from '@/hooks/usePasteDataTransfer'


export default (elementRef: ShallowRef<HTMLElement | null>) => {
  const { disableHotkeys } = storeToRefs(useMainStore())

  const { createTextElement } = useCreateElement()

  const { pasteDataTransfer } = usePasteDataTransfer()

  // 拖拽元素/页面到画布中
  const handleDrop = (e: DragEvent) => {
    if (!e.dataTransfer || e.dataTransfer.items.length === 0) return

    const { isFile, dataTransferFirstItem } = pasteDataTransfer(e.dataTransfer)
    if (isFile) return
    
    if (dataTransferFirstItem && dataTransferFirstItem.kind === 'string' && dataTransferFirstItem.type === 'text/plain') {
      dataTransferFirstItem.getAsString(text => {
        if (disableHotkeys.value) return
        const string = parseText2Paragraphs(text)
        createTextElement({
          left: 0,
          top: 0,
          width: 600,
          height: 50,
        }, { content: string })
      })
    }
  }

  onMounted(() => {
    elementRef.value && elementRef.value.addEventListener('drop', handleDrop)

    document.ondragleave = e => e.preventDefault()
    document.ondrop = e => e.preventDefault()
    document.ondragenter = e => e.preventDefault()
    document.ondragover = e => e.preventDefault()
  })
  onUnmounted(() => {
    elementRef.value && elementRef.value.removeEventListener('drop', handleDrop)

    document.ondragleave = null
    document.ondrop = null
    document.ondragenter = null
    document.ondragover = null
  })
}
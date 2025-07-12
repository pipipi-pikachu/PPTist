import { onMounted, onUnmounted, type ShallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import { parseText2Paragraphs } from '@/utils/textParser'
import useCreateElement from '@/hooks/useCreateElement'

export default (elementRef: ShallowRef<HTMLElement | null>) => {
  const { disableHotkeys } = storeToRefs(useMainStore())

  const { createImageElement, createTextElement } = useCreateElement()

  // 拖拽元素到画布中
  const handleDrop = (e: DragEvent) => {
    if (!e.dataTransfer || e.dataTransfer.items.length === 0) return

    const dataItems = e.dataTransfer.items
    const dataTransferFirstItem = dataItems[0]

    // 检查事件对象中是否存在图片，存在则插入图片，否则继续检查是否存在文字，存在则插入文字
    let isImage = false
    for (const item of dataItems) {
      if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const imageFile = item.getAsFile()
        if (imageFile) {
          getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
        }
        isImage = true
      }
    }

    if (isImage) return
    
    if (dataTransferFirstItem.kind === 'string' && dataTransferFirstItem.type === 'text/plain') {
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
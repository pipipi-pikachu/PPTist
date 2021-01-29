import { computed, onMounted, onUnmounted, Ref } from 'vue'
import { useStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import useCreateElement from '@/hooks/useCreateElement'

export default (elementRef: Ref<HTMLElement | undefined>) => {
  const store = useStore()
  const disableHotkeys = computed(() => store.state.disableHotkeys)

  const { createImageElement, createTextElement } = useCreateElement()

  const handleDrop = (e: DragEvent) => {
    if(!e.dataTransfer) return
    const dataTransferItem = e.dataTransfer.items[0]

    if(dataTransferItem.kind === 'file' && dataTransferItem.type.indexOf('image') !== -1) {
      const imageFile = dataTransferItem.getAsFile()
      if(imageFile) {
        getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
      }
    }
    else if(dataTransferItem.kind === 'string' && dataTransferItem.type === 'text/plain') {
      dataTransferItem.getAsString(text => {
        if(disableHotkeys.value) return
        createTextElement({
          left: 0,
          top: 0,
          width: 600,
          height: 50,
        }, text)
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
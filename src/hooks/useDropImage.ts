import { ref, onMounted, onUnmounted, Ref } from 'vue'

export default (elementRef: Ref<HTMLElement | null>) => {
  const imageFile = ref<File | null>(null)

  const handleDrop = (e: DragEvent) => {
    if(!e.dataTransfer) return
    const file = e.dataTransfer.items[0]
    if( file.kind === 'file' && file.type.indexOf('image') !== -1 ) {
      const _imageFile = file.getAsFile()
      if(_imageFile) imageFile.value = _imageFile
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

  return imageFile
}
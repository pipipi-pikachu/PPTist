import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useCreateElement from '@/hooks/useCreateElement'

export default () => {
  const store = useStore()
  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)
  const disableHotkeys = computed(() => store.state.disableHotkeys)

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { createImageElement } = useCreateElement()

  const pasteImageFile = (imageFile: File) => {
    getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
  }

  const pasteListener = (e: ClipboardEvent) => {
    if(!editorAreaFocus.value && !thumbnailsFocus.value) return
    if(disableHotkeys.value) return

    if(!e.clipboardData) return

    const clipboardDataItems = e.clipboardData.items
    const clipboardDataFirstItem = clipboardDataItems[0]

    if(!clipboardDataFirstItem) return

    for(const item of clipboardDataItems) {
      if(item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const imageFile = item.getAsFile()
        if(imageFile) pasteImageFile(imageFile)
        return
      }
    }

    if(clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain') {
      clipboardDataFirstItem.getAsString(text => pasteTextClipboardData(text))
    }
  }

  onMounted(() => {
    document.addEventListener('paste', pasteListener)
  })
  onUnmounted(() => {
    document.removeEventListener('paste', pasteListener)
  })
}
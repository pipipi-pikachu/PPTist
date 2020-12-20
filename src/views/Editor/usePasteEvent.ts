import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { decrypt } from '@/utils/crypto'
import { getImageDataURL } from '@/utils/image'

export default () => {
  const store = useStore<State>()
  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)
  const disableHotkeys = computed(() => store.state.disableHotkeys)

  const pasteImageFile = (imageFile: File) => {
    getImageDataURL(imageFile).then(dataURL => {
      console.log(dataURL)
    })
  }

  const pasteText = (text: string) => {
    let content
    try {
      content = JSON.parse(decrypt(text))
    }
    catch {
      content = text
    }
    console.log(content)
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

    if( clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain' ) {
      clipboardDataFirstItem.getAsString(text => pasteText(text))
    }
  }

  onMounted(() => {
    document.addEventListener('paste', pasteListener)
  })
  onUnmounted(() => {
    document.removeEventListener('paste', pasteListener)
  })
}
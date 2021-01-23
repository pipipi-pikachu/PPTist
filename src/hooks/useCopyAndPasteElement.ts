import { computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import { message } from 'ant-design-vue'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useDeleteElement from './useDeleteElement'

export default () => {
  const store = useStore<State>()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeElementList = computed<PPTElement[]>(() => store.getters.activeElementList)

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { deleteElement } = useDeleteElement()

  const copyElement = () => {
    if(!activeElementIdList.value.length) return

    const text = encrypt(JSON.stringify({
      type: 'elements',
      data: activeElementList.value,
    }))

    copyText(text).then(() => {
      store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
    })
  }

  const cutElement = () => {
    copyElement()
    deleteElement()
  }

  const pasteElement = () => {
    readClipboard().then(text => {
      pasteTextClipboardData(text)
    }).catch(err => message.warning(err))
  }

  return {
    copyElement,
    cutElement,
    pasteElement,
  }
}
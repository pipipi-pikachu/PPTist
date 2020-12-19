import { Ref } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement } from '@/types/slides'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt, decrypt } from '@/utils/crypto'
import { message } from 'ant-design-vue'

export default (deleteElement: () => void, activeElementList: Ref<PPTElement[]>, activeElementIdList: Ref<string[]>) => {
  const store = useStore<State>()

  const copyElement = () => {
    if(!activeElementIdList.value.length) return

    const text = encrypt(JSON.stringify({
      type: 'elements',
      data: activeElementList.value,
    }))

    copyText(text).then(() => {
      store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
      message.success('元素已复制到剪贴板', 0.8)
    })
  }

  const cutElement = () => {
    copyElement()
    deleteElement()
  }

  const pasteElement = () => {
    readClipboard().then(text => {
      let clipboardData
      try {
        clipboardData = JSON.parse(decrypt(text))
      }
      catch {
        clipboardData = text
      }
      console.log(clipboardData)
    }).catch(err => message.warning(err))
  }

  return {
    copyElement,
    cutElement,
    pasteElement,
  }
}
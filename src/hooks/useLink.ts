import { MutationTypes, useStore } from '@/store'
import { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { message } from 'ant-design-vue'

export default () => {
  const store = useStore()

  const { addHistorySnapshot } = useHistorySnapshot()

  const setLink = (handleElement: PPTElement, link: string) => {
    const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
    if (!link || !linkRegExp.test(link)) {
      message.error('不是正确的网页链接地址')
      return false
    }
    const props = { link }
    store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.id, props })
    addHistorySnapshot()

    return true
  }

  const removeLink = (handleElement: PPTElement) => {
    store.commit(MutationTypes.REMOVE_ELEMENT_PROPS, { id: handleElement.id, propName: 'link' })
    addHistorySnapshot()
  }

  return {
    setLink,
    removeLink,
  }
}
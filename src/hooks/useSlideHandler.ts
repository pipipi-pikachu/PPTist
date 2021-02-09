import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'
import { createRandomCode } from '@/utils/common'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import { KEYS } from '@/configs/hotkey'
import { message } from 'ant-design-vue'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const store = useStore()
  const slideIndex = computed(() => store.state.slideIndex)
  const theme = computed(() => store.state.theme)
  const slidesLength = computed(() => store.state.slides.length)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 移动页面焦点
   * @param command 移动页面焦点命令：上移、下移
   */
  const updateSlideIndex = (command: string) => {
    let targetIndex = 0
    if (command === KEYS.UP && slideIndex.value > 0) {
      targetIndex = slideIndex.value - 1
    }
    else if (command === KEYS.DOWN && slideIndex.value < slidesLength.value - 1) {
      targetIndex = slideIndex.value + 1
    }
    store.commit(MutationTypes.UPDATE_SLIDE_INDEX, targetIndex)
  }

  // 将当前页面数据加密后复制到剪贴板
  const copySlide = () => {
    const text = encrypt(JSON.stringify({
      type: 'slide',
      data: currentSlide.value,
    }))

    copyText(text).then(() => {
      store.commit(MutationTypes.SET_THUMBNAILS_FOCUS, true)
    })
  }

  // 尝试将剪贴板页面数据解密后添加到下一页（粘贴）
  const pasteSlide = () => {
    readClipboard().then(text => {
      pasteTextClipboardData(text, { onlySlide: true })
    }).catch(err => message.warning(err))
  }

  // 创建一页空白页并添加到下一页
  const createSlide = () => {
    const emptySlide = {
      id: createRandomCode(8),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    store.commit(MutationTypes.ADD_SLIDE, emptySlide)
    addHistorySnapshot()
  }

  // 将当前页复制一份到下一页
  const copyAndPasteSlide = () => {
    store.commit(MutationTypes.ADD_SLIDE, {
      ...currentSlide.value,
      id: createRandomCode(8),
    })
    addHistorySnapshot()
  }

  // 删除当前页
  const deleteSlide = () => {
    if (slidesLength.value === 1) return message.warning('无法继续删除')
    
    store.commit(MutationTypes.DELETE_SLIDE, currentSlide.value.id)
    addHistorySnapshot()
  }

  // 将当前页复制后删除（剪切）
  const cutSlide = () => {
    copySlide()
    deleteSlide()
  }

  return {
    updateSlideIndex,
    copySlide,
    pasteSlide,
    createSlide,
    copyAndPasteSlide,
    deleteSlide,
    cutSlide,
  }
}
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
  const slides = computed(() => store.state.slides)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const selectedSlidesIndex = computed(() => [...store.state.selectedSlidesIndex, slideIndex.value])
  const selectedSlides = computed(() => slides.value.filter((item, index) => selectedSlidesIndex.value.includes(index)))
  const selectedSlidesId = computed(() => selectedSlides.value.map(item => item.id))

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { addHistorySnapshot } = useHistorySnapshot()

  // 重置幻灯片
  const resetSlides = () => {
    const emptySlide = {
      id: createRandomCode(8),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    store.commit(MutationTypes.UPDATE_SLIDE_INDEX, 0)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.SET_SLIDES, [emptySlide])
  }

  /**
   * 移动页面焦点
   * @param command 移动页面焦点命令：上移、下移
   */
  const updateSlideIndex = (command: string) => {
    let targetIndex = 0
    if (command === KEYS.UP && slideIndex.value > 0) {
      targetIndex = slideIndex.value - 1
    }
    else if (command === KEYS.DOWN && slideIndex.value < slides.value.length - 1) {
      targetIndex = slideIndex.value + 1
    }
    store.commit(MutationTypes.UPDATE_SLIDE_INDEX, targetIndex)
  }

  // 将当前页面数据加密后复制到剪贴板
  const copySlide = () => {
    const text = encrypt(JSON.stringify({
      type: 'slides',
      data: selectedSlides.value,
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

  // 删除当前页，若将删除全部页面，则执行重置幻灯片操作
  const deleteSlide = (targetSlidesId = selectedSlidesId.value) => {
    if (slides.value.length === targetSlidesId.length) resetSlides()
    else store.commit(MutationTypes.DELETE_SLIDE, targetSlidesId)

    store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, [])

    addHistorySnapshot()
  }

  // 将当前页复制后删除（剪切）
  // 由于复制操作会导致多选状态消失，所以需要提前将需要删除的页面ID进行缓存
  const cutSlide = () => {
    const targetSlidesId = [...selectedSlidesId.value]
    copySlide()
    deleteSlide(targetSlidesId)
  }

  // 选中全部幻灯片
  const selectAllSlide = () => {
    const newSelectedSlidesIndex = Array.from(Array(slides.value.length), (item, index) => index)
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, newSelectedSlidesIndex)
  }

  return {
    resetSlides,
    updateSlideIndex,
    copySlide,
    pasteSlide,
    createSlide,
    copyAndPasteSlide,
    deleteSlide,
    cutSlide,
    selectAllSlide,
  }
}
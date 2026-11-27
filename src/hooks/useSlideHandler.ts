import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore, useSnapshotStore } from '@/store'
import type { Slide } from '@/types/slides'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import { createElementIdMap, remapLineConnections } from '@/utils/element'
import { KEYS } from '@/configs/hotkey'
import message from '@/utils/message'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { selectedSlidesIndex: _selectedSlidesIndex, activeElementIdList } = storeToRefs(mainStore)
  const { currentSlide, slides, theme, slideIndex } = storeToRefs(slidesStore)

  const selectedSlidesIndex = computed(() => [..._selectedSlidesIndex.value, slideIndex.value])
  const selectedSlides = computed(() => slides.value.filter((item, index) => selectedSlidesIndex.value.includes(index)))
  const selectedSlidesId = computed(() => selectedSlides.value.map(item => item.id))

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { addSlidesFromData } = useAddSlidesOrElements()
  const { addHistorySnapshot, flushHistorySnapshots } = useHistorySnapshot()

  // 重置幻灯片
  const resetSlides = () => {
    const emptySlide: Slide = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    slidesStore.updateSlideIndex(0)
    mainStore.setActiveElementIdList([])
    slidesStore.setSlides([emptySlide])
  }

  /**
   * 移动页面焦点
   * @param command 移动页面焦点命令：上移、下移
   */
  const updateSlideIndex = (command: string) => {
    if (command === KEYS.UP && slideIndex.value > 0) {
      if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
      slidesStore.updateSlideIndex(slideIndex.value - 1)
    }
    else if (command === KEYS.DOWN && slideIndex.value < slides.value.length - 1) {
      if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
      slidesStore.updateSlideIndex(slideIndex.value + 1)
    }
  }

  // 将当前页面数据加密后复制到剪贴板
  const copySlide = () => {
    const text = encrypt(JSON.stringify({
      type: 'slides',
      data: selectedSlides.value,
    }))

    copyText(text).then(() => {
      mainStore.setThumbnailsFocus(true)
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
    const emptySlide: Slide = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    mainStore.setActiveElementIdList([])
    slidesStore.addSlide(emptySlide)
    addHistorySnapshot()
  }

  // 根据模板创建新页面
  const createSlideByTemplate = (slide: Slide) => {
    const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

    for (const element of slide.elements) {
      remapLineConnections(element, elIdMap)
      element.id = elIdMap[element.id]
      if (element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    const newSlide = {
      ...slide,
      id: nanoid(10),
    }
    mainStore.setActiveElementIdList([])
    slidesStore.addSlide(newSlide)
    addHistorySnapshot()
  }

  // 将当前页复制一份到下一页
  const copyAndPasteSlide = () => {
    const slide = JSON.parse(JSON.stringify(currentSlide.value))
    addSlidesFromData([slide])
  }

  // 删除当前页，若将删除全部页面，则执行重置幻灯片操作
  const deleteSlide = (targetSlidesId = selectedSlidesId.value) => {
    if (slides.value.length === targetSlidesId.length) resetSlides()
    else slidesStore.deleteSlide(targetSlidesId)

    mainStore.updateSelectedSlidesIndex([])

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
    mainStore.setActiveElementIdList([])
    mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
  }

  // 拖拽调整幻灯片顺序同步数据
  const sortSlides = (newIndex: number, oldIndex: number, oldIndices = [oldIndex], newIndices = [newIndex]) => {
    if (oldIndices.length === newIndices.length && oldIndices.every((index, i) => index === newIndices[i])) return
    const movingIndices = new Set(oldIndices)
    const insertIndex = Math.min(...newIndices)
    const movingSlides = slides.value.filter((_, index) => movingIndices.has(index))
    const remainingSlides = slides.value.filter((_, index) => !movingIndices.has(index))
    remainingSlides.splice(insertIndex, 0, ...movingSlides)
    if (remainingSlides.every((slide, index) => slide.id === slides.value[index].id)) return

    flushHistorySnapshots()
    const currentSlideId = currentSlide.value.id
    const previousSlideIndex = slideIndex.value
    const _slides: Slide[] = JSON.parse(JSON.stringify(slides.value))

    // 移动节首页时，将节标记交给该节第一张未移动的页面；该节被移空则移除。
    for (let i = 0; i < _slides.length; i++) {
      const section = _slides[i].sectionTag
      if (!section || !movingIndices.has(i)) continue
      delete _slides[i].sectionTag
      for (let j = i + 1; j < _slides.length && !_slides[j].sectionTag; j++) {
        if (!movingIndices.has(j)) {
          _slides[j].sectionTag = section
          break
        }
      }
    }

    const moving = _slides.filter((_, index) => movingIndices.has(index))
    const remaining = _slides.filter((_, index) => !movingIndices.has(index))
    if (insertIndex === 0 && remaining[0]?.sectionTag) {
      moving[0].sectionTag = remaining[0].sectionTag
      delete remaining[0].sectionTag
    }
    remaining.splice(insertIndex, 0, ...moving)

    slidesStore.setSlides(remaining)
    slidesStore.updateSlideIndex(oldIndices.length > 1 ? remaining.findIndex(slide => slide.id === currentSlideId) : newIndex)
    // 排序会改变页面索引，上一份快照需要保留排序前的索引。
    const snapshotStore = useSnapshotStore()
    snapshotStore.addSnapshot(previousSlideIndex)
  }

  const isEmptySlide = computed(() => {
    if (slides.value.length > 1) return false
    if (slides.value[0].elements.length > 0) return false
    return true
  })

  return {
    resetSlides,
    updateSlideIndex,
    copySlide,
    pasteSlide,
    createSlide,
    createSlideByTemplate,
    copyAndPasteSlide,
    deleteSlide,
    cutSlide,
    selectAllSlide,
    sortSlides,
    isEmptySlide,
  }
}

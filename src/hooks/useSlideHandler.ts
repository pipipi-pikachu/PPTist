import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import { Slide } from '@/types/slides'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import { createElementIdMap } from '@/utils/element'
import { KEYS } from '@/configs/hotkey'
import { message } from 'ant-design-vue'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useAddSlidesOrElements from '@/hooks//useAddSlidesOrElements'

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
  const { addHistorySnapshot } = useHistorySnapshot()

  // reset slide
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
   * Move page focus
   * @param command Move page focus command: move up, move down
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

  // Copy the encrypted data of the current page to the clipboard
  const copySlide = () => {
    const text = encrypt(JSON.stringify({
      type: 'slides',
      data: selectedSlides.value,
    }))

    copyText(text).then(() => {
      mainStore.setThumbnailsFocus(true)
    })
  }

  // Attempt to decrypt the clipboard page data and add it to the next page (paste)
  const pasteSlide = () => {
    readClipboard().then(text => {
      pasteTextClipboardData(text, { onlySlide: true })
    }).catch(err => message.warning(err))
  }

  // Create a blank page and add to the next page
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

  // Create a new page based on the template
  const createSlideByTemplate = (slide: Slide) => {
    const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

    for (const element of slide.elements) {
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

  // copy the current page to the next page
  const copyAndPasteSlide = () => {
    const slide = JSON.parse(JSON.stringify(currentSlide.value))
    addSlidesFromData([slide])
  }

  // Delete the current page, if all pages will be deleted, reset the slideshow
  const deleteSlide = (targetSlidesId = selectedSlidesId.value) => {
    if (slides.value.length === targetSlidesId.length) resetSlides()
    else slidesStore.deleteSlide(targetSlidesId)

    mainStore.updateSelectedSlidesIndex([])

    addHistorySnapshot()
  }

  // Copy the current page and delete it (cut)
  // Since the copy operation will cause the multi-select state to disappear, it is necessary to cache the page ID to be deleted in advance
  const cutSlide = () => {
    const targetSlidesId = [...selectedSlidesId.value]
    copySlide()
    deleteSlide(targetSlidesId)
  }

  // select all slides
  const selectAllSlide = () => {
    const newSelectedSlidesIndex = Array.from(Array(slides.value.length), (item, index) => index)
    mainStore.setActiveElementIdList([])
    mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
  }

  // Drag and drop to adjust the order of slides to synchronize data
  const sortSlides = (newIndex: number, oldIndex: number) => {
    if (oldIndex === newIndex) return

    const _slides = JSON.parse(JSON.stringify(slides.value))
    const _slide = _slides[oldIndex]
    _slides.splice(oldIndex, 1)
    _slides.splice(newIndex, 0, _slide)
    slidesStore.setSlides(_slides)
    slidesStore.updateSlideIndex(newIndex)
  }
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
  }
}
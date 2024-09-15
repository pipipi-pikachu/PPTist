import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useSlideHandler from '@/hooks/useSlideHandler'

export default () => {
  const slidesStore = useSlidesStore()
  const { slides } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()
  const { deleteSlide } = useSlideHandler()

  const createSection = () => {
    slidesStore.updateSlide({
      sectionTag: {
        id: nanoid(6),
      },
    })
    addHistorySnapshot()
  }

  const removeSection = (sectionId: string) => {
    if (!sectionId) return

    const slide = slides.value.find(slide => slide.sectionTag?.id === sectionId)!
    slidesStore.removeSlideProps({
      id: slide.id,
      propName: 'sectionTag',
    })
    addHistorySnapshot()
  }

  const removeAllSection = () => {
    const _slides = slides.value.map(slide => {
      if (slide.sectionTag) delete slide.sectionTag
      return slide
    })
    slidesStore.setSlides(_slides)
    addHistorySnapshot()
  }

  const removeSectionSlides = (sectionId: string) => {
    let startIndex = 0
    if (sectionId) {
      startIndex = slides.value.findIndex(slide => slide.sectionTag?.id === sectionId)
    }
    const ids: string[] = []
    
    for (let i = startIndex; i < slides.value.length; i++) {
      const slide = slides.value[i]
      if (i !== startIndex && slide.sectionTag) break

      ids.push(slide.id)
    }

    deleteSlide(ids)
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    if (!title) return

    if (sectionId === 'default') {
      slidesStore.updateSlide({
        sectionTag: {
          id: nanoid(6),
          title,
        },
      }, slides.value[0].id)
    }
    else {
      const slide = slides.value.find(slide => slide.sectionTag?.id === sectionId)
      if (!slide) return

      slidesStore.updateSlide({
        sectionTag: {
          ...slide.sectionTag!,
          title,
        },
      }, slide.id)
    }
    addHistorySnapshot()
  }

  return {
    createSection,
    removeSection,
    removeAllSection,
    removeSectionSlides,
    updateSectionTitle,
  }
}
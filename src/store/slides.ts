import { defineStore } from 'pinia'
import { omit } from 'lodash'
import type { Slide, SlideTheme, PPTElement, PPTAnimation, SlideTemplate } from '@/types/slides'
import { t } from '@/i18n';

interface RemovePropData {
  id: string
  propName: string | string[]
}

interface UpdateElementData {
  id: string | string[]
  props: Partial<PPTElement>
  slideId?: string
}

interface FormatedAnimation {
  animations: PPTAnimation[]
  autoNext: boolean
}

export interface SlidesState {
  title: string
  theme: SlideTheme
  slides: Slide[]
  slideIndex: number
  viewportSize: number
  viewportRatio: number
  templates: SlideTemplate[]
}

export const useSlidesStore = defineStore('pptist-slides', {
  state: (): SlidesState => ({
    title: t('Commons.heading.text_mej254'), // 幻灯片标题
    theme: {
      themeColors: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
      fontColor: '#333',
      fontName: '',
      backgroundColor: '#fff',
      shadow: {
        h: 3,
        v: 3,
        blur: 2,
        color: '#808080',
      },
      outline: {
        width: 2,
        color: '#525252',
        style: 'solid',
      },
    }, // 主题样式
    slides: [], // 幻灯片页面数据
    slideIndex: 0, // 当前页面索引
    viewportSize: 1000, // 可视区域宽度基数
    viewportRatio: 0.5625, // 可视区域比例，默认16:9
    templates: [
      { name: t('Commons.text.text_c45x0k'), id: 'template_1', cover: '/imgs/template_1.webp', origin: t('Commons.text.text_bz6x8n') },
      { name: t('Commons.text.text_ior6ln'), id: 'template_2', cover: '/imgs/template_2.webp', origin: t('Commons.text.text_bz6x8n') },
      { name: t('Commons.text.text_dbxj4q'), id: 'template_3', cover: '/imgs/template_3.webp', origin: t('Commons.text.text_bz6x8n') },
      { name: t('Commons.text.text_9f4wxc'), id: 'template_4', cover: '/imgs/template_4.webp', origin: t('Commons.text.text_bz6x8n') },
      { name: t('Commons.text.text_g3xjfa'), id: 'template_5', cover: '/imgs/template_5.webp', origin: t('Commons.text.text_huilpu') },
      { name: t('Commons.text.text_dhcdg3'), id: 'template_6', cover: '/imgs/template_6.webp', origin: t('Commons.text.text_huilpu') },
      { name: t('Commons.text.text_egwet8'), id: 'template_7', cover: '/imgs/template_7.webp', origin: t('Commons.text.text_huilpu') },
      { name: t('Commons.text.text_i7bc6a'), id: 'template_8', cover: '/imgs/template_8.webp', origin: t('Commons.text.text_huilpu') },
    ], // 模板
  }),

  getters: {
    currentSlide(state) {
      return state.slides[state.slideIndex]
    },
  
    currentSlideAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map(el => el.id)
      return currentSlide.animations.filter(animation => elIds.includes(animation.elId))
    },

    // 格式化的当前页动画
    // 将触发条件为“与上一动画同时”的项目向上合并到序列中的同一位置
    // 为触发条件为“上一动画之后”项目的上一项添加自动向下执行标记
    formatedAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map(el => el.id)
      const animations = currentSlide.animations.filter(animation => elIds.includes(animation.elId))

      const formatedAnimations: FormatedAnimation[] = []
      for (const animation of animations) {
        if (animation.trigger === 'click' || !formatedAnimations.length) {
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
        else if (animation.trigger === 'meantime') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.animations = last.animations.filter(item => item.elId !== animation.elId)
          last.animations.push(animation)
          formatedAnimations[formatedAnimations.length - 1] = last
        }
        else if (animation.trigger === 'auto') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.autoNext = true
          formatedAnimations[formatedAnimations.length - 1] = last
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
      }
      return formatedAnimations
    },
  },

  actions: {
    setTitle(title: string) {
      if (!title) this.title = t('Commons.heading.text_mej254')
      else this.title = title
    },

    setTheme(themeProps: Partial<SlideTheme>) {
      this.theme = { ...this.theme, ...themeProps }
    },
  
    setViewportSize(size: number) {
      this.viewportSize = size
    },
  
    setViewportRatio(viewportRatio: number) {
      this.viewportRatio = viewportRatio
    },
  
    setSlides(slides: Slide[], themeProps?: Partial<SlideTheme>) {
      this.slides = slides
      if (themeProps) this.setTheme(themeProps)
    },
  
    setTemplates(templates: SlideTemplate[]) {
      this.templates = templates
    },
  
    addSlide(slide: Slide | Slide[]) {
      const slides = Array.isArray(slide) ? slide : [slide]
      for (const slide of slides) {
        if (slide.sectionTag) delete slide.sectionTag
      }

      const addIndex = this.slideIndex + 1
      this.slides.splice(addIndex, 0, ...slides)
      this.slideIndex = addIndex
    },
  
    updateSlide(props: Partial<Slide>, slideId?: string) {
      const slideIndex = slideId ? this.slides.findIndex(item => item.id === slideId) : this.slideIndex
      this.slides[slideIndex] = { ...this.slides[slideIndex], ...props }
    },
  
    removeSlideProps(data: RemovePropData) {
      const { id, propName } = data

      const slides = this.slides.map(slide => {
        return slide.id === id ? omit(slide, propName) : slide
      }) as Slide[]
      this.slides = slides
    },
  
    deleteSlide(slideId: string | string[]) {
      const slidesId = Array.isArray(slideId) ? slideId : [slideId]
      const slides: Slide[] = JSON.parse(JSON.stringify(this.slides))
  
      const deleteSlidesIndex = []
      for (const deletedId of slidesId) {
        const index = slides.findIndex(item => item.id === deletedId)
        deleteSlidesIndex.push(index)

        const deletedSlideSection = slides[index].sectionTag
        if (deletedSlideSection) {
          const handleSlideNext = slides[index + 1]
          if (handleSlideNext && !handleSlideNext.sectionTag) {
            delete slides[index].sectionTag
            slides[index + 1].sectionTag = deletedSlideSection
          }
        }

        slides.splice(index, 1)
      }
      let newIndex = Math.min(...deleteSlidesIndex)
  
      const maxIndex = slides.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex
  
      this.slideIndex = newIndex
      this.slides = slides
    },
  
    updateSlideIndex(index: number) {
      this.slideIndex = index
    },
  
    addElement(element: PPTElement | PPTElement[]) {
      const elements = Array.isArray(element) ? element : [element]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = [...currentSlideEls, ...elements]
      this.slides[this.slideIndex].elements = newEls
    },

    deleteElement(elementId: string | string[]) {
      const elementIdList = Array.isArray(elementId) ? elementId : [elementId]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = currentSlideEls.filter(item => !elementIdList.includes(item.id))
      this.slides[this.slideIndex].elements = newEls
    },
  
    updateElement(data: UpdateElementData) {
      const { id, props, slideId } = data
      const elIdList = typeof id === 'string' ? [id] : id

      const slideIndex = slideId ? this.slides.findIndex(item => item.id === slideId) : this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return elIdList.includes(el.id) ? { ...el, ...props } : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
    },
  
    removeElementProps(data: RemovePropData) {
      const { id, propName } = data
      const propsNames = typeof propName === 'string' ? [propName] : propName
  
      const slideIndex = this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return el.id === id ? omit(el, propsNames) : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
    },
  },
})
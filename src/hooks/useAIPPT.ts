import { ref } from 'vue'
import { nanoid } from 'nanoid'
import type { ImageClipDataRange, PPTElement, PPTImageElement, PPTShapeElement, PPTTextElement, Slide, TextType } from '@/types/slides'
import type { AIPPTSlide } from '@/types/AIPPT'
import { useSlidesStore } from '@/store'
import useAddSlidesOrElements from './useAddSlidesOrElements'
import useSlideHandler from './useSlideHandler'

interface PexelsImage {
  id: string
  src: string
  width: number
  height: number
}

export default () => {
  const slidesStore = useSlidesStore()
  const { addSlidesFromData } = useAddSlidesOrElements()
  const { isEmptySlide } = useSlideHandler()

  const imgPool = ref<PexelsImage[]>([])

  const checkTextType = (el: PPTElement, type: TextType) => {
    return (el.type === 'text' && el.textType === type) || (el.type === 'shape' && el.text && el.text.type === type)
  }
  
  const getUseableTemplates = (templates: Slide[], n: number, type: TextType) => {
    if (n === 1) {
      const list = templates.filter(slide => {
        const items = slide.elements.filter(el => checkTextType(el, type))
        const titles = slide.elements.filter(el => checkTextType(el, 'title'))
        const texts = slide.elements.filter(el => checkTextType(el, 'content'))
  
        return !items.length && titles.length === 1 && texts.length === 1
      })
  
      if (list.length) return list
    }
  
    let target: Slide | null = null
  
    const list = templates.filter(slide => {
      const len = slide.elements.filter(el => checkTextType(el, type)).length
      return len >= n
    })
    if (list.length === 0) {
      const sorted = templates.sort((a, b) => {
        const aLen = a.elements.filter(el => checkTextType(el, type)).length
        const bLen = b.elements.filter(el => checkTextType(el, type)).length
        return aLen - bLen
      })
      target = sorted[sorted.length - 1]
    }
    else {
      target = list.reduce((closest, current) => {
        const currentLen = current.elements.filter(el => checkTextType(el, type)).length
        const closestLen = closest.elements.filter(el => checkTextType(el, type)).length
        return (currentLen - n) <= (closestLen - n) ? current : closest
      })
    }
  
    return templates.filter(slide => {
      const len = slide.elements.filter(el => checkTextType(el, type)).length
      const targetLen = target!.elements.filter(el => checkTextType(el, type)).length
      return len === targetLen
    })
  }
  
  const getAdaptedFontsize = ({
    text,
    fontSize,
    fontFamily,
    width,
    maxLine,
  }: {
    text: string
    fontSize: number
    fontFamily: string
    width: number
    maxLine: number
  }) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
  
    let newFontSize = fontSize
    const minFontSize = 10
  
    while (newFontSize >= minFontSize) {
      context.font = `${newFontSize}px ${fontFamily}`
      const textWidth = context.measureText(text).width
      const line = Math.ceil(textWidth / width)
  
      if (line <= maxLine) return newFontSize
  
      const step = newFontSize <= 22 ? 1 : 2
      newFontSize = newFontSize - step
    }
  
    return minFontSize
  }
  
  const getFontInfo = (htmlString: string) => {
    const fontSizeRegex = /font-size:\s*(\d+)\s*px/i
    const fontFamilyRegex = /font-family:\s*['"]?([^'";]+)['"]?\s*(?=;|>|$)/i
  
    const defaultInfo = {
      fontSize: 16,
      fontFamily: 'Microsoft Yahei',
    }
  
    const fontSizeMatch = htmlString.match(fontSizeRegex)
    const fontFamilyMatch = htmlString.match(fontFamilyRegex)
  
    return {
      fontSize: fontSizeMatch ? (+fontSizeMatch[1].trim()) : defaultInfo.fontSize,
      fontFamily: fontFamilyMatch ? fontFamilyMatch[1].trim() : defaultInfo.fontFamily,
    }
  }
  
  const getNewTextElement = ({
    el,
    text,
    maxLine,
    longestText,
    digitPadding,
  }: {
    el: PPTTextElement | PPTShapeElement
    text: string
    maxLine: number
    longestText?: string
    digitPadding?: boolean
  }): PPTTextElement | PPTShapeElement => {
    const padding = 10
    const width = el.width - padding * 2 - 10
  
    let content = el.type === 'text' ? el.content : el.text!.content
  
    const fontInfo = getFontInfo(content)
    const size = getAdaptedFontsize({
      text: longestText || text,
      fontSize: fontInfo.fontSize,
      fontFamily: fontInfo.fontFamily,
      width,
      maxLine,
    })
  
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
  
    const treeWalker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  
    const firstTextNode = treeWalker.nextNode()
    if (firstTextNode) {
      if (digitPadding && firstTextNode.textContent && firstTextNode.textContent.length === 2 && text.length === 1) {
        firstTextNode.textContent = '0' + text
      }
      else firstTextNode.textContent = text
    }
  
    if (doc.body.innerHTML.indexOf('font-size') === -1) {
      const p = doc.querySelector('p')
      if (p) p.style.fontSize = '16px'
    }
  
    content = doc.body.innerHTML.replace(/font-size:(.+?)px/g, `font-size: ${size}px`)
  
    return el.type === 'text' ? { ...el, content, lineHeight: size < 15 ? 1.2 : el.lineHeight } : { ...el, text: { ...el.text!, content } }
  }

  const getUseableImage = (el: PPTImageElement): PexelsImage | null => {
    let img: PexelsImage | null = null
  
    let imgs = []
  
    if (el.width === el.height) imgs = imgPool.value.filter(img => img.width === img.height)
    else if (el.width > el.height) imgs = imgPool.value.filter(img => img.width > img.height)
    else imgs = imgPool.value.filter(img => img.width <= img.height)
    if (!imgs.length) imgs = imgPool.value
  
    img = imgs[Math.floor(Math.random() * imgs.length)]
    imgPool.value = imgPool.value.filter(item => item.id !== img!.id)
  
    return img
  }
  
  const getNewImgElement = (el: PPTImageElement): PPTImageElement => {
    const img = getUseableImage(el)
    if (!img) return el
  
    let scale = 1
    let w = el.width
    let h = el.height
    let range: ImageClipDataRange = [[0, 0], [0, 0]]
    const radio = el.width / el.height
    if (img.width / img.height >= radio) {
      scale = img.height / el.height
      w = img.width / scale
      const diff = (w - el.width) / 2 / w * 100
      range = [[diff, 0], [100 - diff, 100]]
    }
    else {
      scale = img.width / el.width
      h = img.height / scale
      const diff = (h - el.height) / 2 / h * 100
      range = [[0, diff], [100, 100 - diff]]
    }
    const clipShape = (el.clip && el.clip.shape) ? el.clip.shape : 'rect'
    const clip = { range, shape: clipShape }
    const src = img.src
  
    return { ...el, src, clip }
  }
  
  const getMdContent = (content: string) => {
    const regex = /```markdown([^```]*)```/
    const match = content.match(regex)
    if (match) return match[1].trim()
    return content.replace('```markdown', '').replace('```', '')
  }

  const AIPPT = (templateSlides: Slide[], _AISlides: AIPPTSlide[], imgs?: PexelsImage[]) => {
    if (imgs) imgPool.value = imgs

    const AISlides: AIPPTSlide[] = []
    for (const template of _AISlides) {
      if (template.type === 'content') {
        const items = template.data.items
        if (items.length === 5 || items.length === 6) {
          const items1 = items.slice(0, 3)
          const items2 = items.slice(3)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 3 })
        }
        else if (items.length === 7 || items.length === 8) {
          const items1 = items.slice(0, 4)
          const items2 = items.slice(4)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 4 })
        }
        else if (items.length === 9 || items.length === 10) {
          const items1 = items.slice(0, 3)
          const items2 = items.slice(3, 6)
          const items3 = items.slice(6)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 3 })
          AISlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 6 })
        }
        else if (items.length > 10) {
          const items1 = items.slice(0, 4)
          const items2 = items.slice(4, 8)
          const items3 = items.slice(8)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 4 })
          AISlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 8 })
        }
        else {
          AISlides.push(template)
        }
      }
      else if (template.type === 'contents') {
        const items = template.data.items
        if (items.length === 7) {
          const items1 = items.slice(0, 5)
          const items2 = items.slice(5)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 5 })
        }
        else if (items.length > 7 && items.length <= 12) {
          const items1 = items.slice(0, 6)
          const items2 = items.slice(6)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 6 })
        }
        else if (items.length === 13) {
          const items1 = items.slice(0, 6)
          const items2 = items.slice(6, 11)
          const items3 = items.slice(11)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 6 })
          AISlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 11 })
        }
        else if (items.length > 13) {
          const items1 = items.slice(0, 6)
          const items2 = items.slice(6, 12)
          const items3 = items.slice(12)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 6 })
          AISlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 12 })
        }
        else {
          AISlides.push(template)
        }
      }
      else AISlides.push(template)
    }

    const coverTemplates = templateSlides.filter(slide => slide.type === 'cover')
    const contentsTemplates = templateSlides.filter(slide => slide.type === 'contents')
    const transitionTemplates = templateSlides.filter(slide => slide.type === 'transition')
    const contentTemplates = templateSlides.filter(slide => slide.type === 'content')
    const endTemplates = templateSlides.filter(slide => slide.type === 'end')

    const coverTemplate = coverTemplates[Math.floor(Math.random() * coverTemplates.length)]
    const transitionTemplate = transitionTemplates[Math.floor(Math.random() * transitionTemplates.length)]
    const endTemplate = endTemplates[Math.floor(Math.random() * endTemplates.length)]

    const slides = []

    let transitionIndex = 0
    
    for (const item of AISlides) {
      if (item.type === 'cover') {
        const elements = coverTemplate.elements.map(el => {
          if (el.type === 'image' && el.imageType && imgPool.value.length) return getNewImgElement(el)
          if (el.type !== 'text' && el.type !== 'shape') return el
          if (checkTextType(el, 'title') && item.data.title) {
            return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
          }
          if (checkTextType(el, 'content') && item.data.text) {
            return getNewTextElement({ el, text: item.data.text, maxLine: 3 })
          }
          return el
        })
        slides.push({
          ...coverTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'contents') {
        const _contentsTemplates = getUseableTemplates(contentsTemplates, item.data.items.length, 'item')
        const contentsTemplate = _contentsTemplates[Math.floor(Math.random() * _contentsTemplates.length)]

        const sortedItemIds = contentsTemplate.elements.filter(el => checkTextType(el, 'item')).sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const sortedNumberItemIds = contentsTemplate.elements.filter(el => checkTextType(el, 'itemNumber')).sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const longestText = item.data.items.reduce((longest, current) => current.length > longest.length ? current : longest, '')

        const elements = contentsTemplate.elements.map(el => {
          if (el.type === 'image' && el.imageType && imgPool.value.length) return getNewImgElement(el)
          if (el.type !== 'text' && el.type !== 'shape') return el
          if (checkTextType(el, 'item')) {
            const index = sortedItemIds.findIndex(id => id === el.id)
            const itemTitle = item.data.items[index]
            if (itemTitle) return getNewTextElement({ el, text: itemTitle, maxLine: 1, longestText })
          }
          if (checkTextType(el, 'itemNumber')) {
            const index = sortedNumberItemIds.findIndex(id => id === el.id)
            const offset = item.offset || 0
            return getNewTextElement({ el, text: index + offset + 1 + '', maxLine: 1, digitPadding: true })
          }
          return el
        })
        slides.push({
          ...contentsTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'transition') {
        transitionIndex++
        const elements = transitionTemplate.elements.map(el => {
          if (el.type === 'image' && el.imageType && imgPool.value.length) return getNewImgElement(el)
          if (el.type !== 'text' && el.type !== 'shape') return el
          if (checkTextType(el, 'title') && item.data.title) {
            return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
          }
          if (checkTextType(el, 'content') && item.data.text) {
            return getNewTextElement({ el, text: item.data.text, maxLine: 3 })
          }
          if (checkTextType(el, 'partNumber')) {
            return getNewTextElement({ el, text: transitionIndex + '', maxLine: 1, digitPadding: true })
          }
          return el
        })
        slides.push({
          ...transitionTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'content') {
        const _contentTemplates = getUseableTemplates(contentTemplates, item.data.items.length, 'item')
        const contentTemplate = _contentTemplates[Math.floor(Math.random() * _contentTemplates.length)]

        const sortedTitleItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'itemTitle')).sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const sortedTextItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'item')).sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const sortedNumberItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'itemNumber')).sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const itemTitles = []
        const itemTexts = []

        for (const _item of item.data.items) {
          if (_item.title) itemTitles.push(_item.title)
          if (_item.text) itemTexts.push(_item.text)
        }
        const longestTitle = itemTitles.reduce((longest, current) => current.length > longest.length ? current : longest, '')
        const longestText = itemTexts.reduce((longest, current) => current.length > longest.length ? current : longest, '')

        const elements = contentTemplate.elements.map(el => {
          if (el.type === 'image' && el.imageType && imgPool.value.length) return getNewImgElement(el)
          if (el.type !== 'text' && el.type !== 'shape') return el
          if (item.data.items.length === 1) {
            const contentItem = item.data.items[0]
            if (checkTextType(el, 'content') && contentItem.text) {
              return getNewTextElement({ el, text: contentItem.text, maxLine: 6 })
            }
          }
          else {
            if (checkTextType(el, 'itemTitle')) {
              const index = sortedTitleItemIds.findIndex(id => id === el.id)
              const contentItem = item.data.items[index]
              if (contentItem && contentItem.title) {
                return getNewTextElement({ el, text: contentItem.title, longestText: longestTitle, maxLine: 1 })
              }
            }
            if (checkTextType(el, 'item')) {
              const index = sortedTextItemIds.findIndex(id => id === el.id)
              const contentItem = item.data.items[index]
              if (contentItem && contentItem.text) {
                return getNewTextElement({ el, text: contentItem.text, longestText, maxLine: 4 })
              }
            }
            if (checkTextType(el, 'itemNumber')) {
              const index = sortedNumberItemIds.findIndex(id => id === el.id)
              const offset = item.offset || 0
              return getNewTextElement({ el, text: index + offset + 1 + '', maxLine: 1, digitPadding: true })
            }
          }
          if (checkTextType(el, 'title') && item.data.title) {
            return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
          }
          return el
        })
        slides.push({
          ...contentTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'end') {
        const elements = endTemplate.elements.map(el => {
          if (el.type === 'image' && el.imageType && imgPool.value.length) return getNewImgElement(el)
          return el
        })
        slides.push({
          ...endTemplate,
          id: nanoid(10),
          elements,
        })
      }
    }
    if (isEmptySlide.value) slidesStore.setSlides(slides)
    else addSlidesFromData(slides)
  }

  return {
    AIPPT,
    getMdContent,
  }
}
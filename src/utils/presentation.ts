import { useSlidesStore } from '@/store/slides'
import type { Presentation } from '@/types/version'

export const capturePresentation = (): Presentation => {
  const { title, slides, theme, viewportSize, viewportRatio } = useSlidesStore()
  return JSON.parse(JSON.stringify({ title, slides, theme, viewportSize, viewportRatio }))
}

export const applyPresentation = (presentation: Presentation) => {
  const store = useSlidesStore()
  const { title, slides, theme, viewportSize, viewportRatio } = presentation
  const copy: Presentation = JSON.parse(JSON.stringify({ title, slides, theme, viewportSize, viewportRatio }))
  store.$patch({ ...copy, slideIndex: 0 })
}

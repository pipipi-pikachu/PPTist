import type { Slide, SlideTheme } from './slides'

export interface Presentation {
  title: string
  slides: Slide[]
  theme: SlideTheme
  viewportSize: number
  viewportRatio: number
}

export interface PresentationVersion {
  id: string
  documentId: string
  createdAt: number
  reason: 'automatic' | 'manual' | 'before-change' | 'restore'
  presentation: Presentation
}

export interface VersionStorage {
  list(documentId: string): Promise<PresentationVersion[]>
  save(version: PresentationVersion): Promise<void>
}

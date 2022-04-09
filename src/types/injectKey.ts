import { InjectionKey, Ref } from 'vue'

export type SlideScale = Ref<number>
export type SlideId = Ref<string>

export const injectKeySlideScale: InjectionKey<SlideScale> = Symbol()
export const injectKeySlideId: InjectionKey<SlideId> = Symbol()
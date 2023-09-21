import type { InjectionKey, Ref } from 'vue'

export type SlideScale = Ref<number>
export type SlideId = Ref<string>
export type RadioGroupValue = {
  value: Ref<string>
  updateValue: (value: string) => void
}

export const injectKeySlideScale: InjectionKey<SlideScale> = Symbol()
export const injectKeySlideId: InjectionKey<SlideId> = Symbol()
export const injectKeyRadioGroupValue: InjectionKey<RadioGroupValue> = Symbol()
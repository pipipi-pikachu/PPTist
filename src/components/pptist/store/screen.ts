import { defineStore } from 'pinia'

export interface ScreenState {
  screening: boolean
}

export const useScreenStore = defineStore('screen', {
  state: (): ScreenState => ({
    screening: false, // 是否进入放映状态
  }),

  actions: {
    setScreening(screening: boolean) {
      this.screening = screening
    },
  },
})
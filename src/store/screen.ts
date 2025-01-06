import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'

export interface screeningBCChannelType {
  bcID: string;
  bc: BroadcastChannel;
}
export interface ScreenState {
  screening: boolean
  presenterBCChannel: screeningBCChannelType | null;
  screeningMode: 'base' | 'presenter' | undefined; // 演示模式、基础播放模式
}

export const useScreenStore = defineStore('screen', {
  state: (): ScreenState => ({
    screening: false, // 是否进入放映状态
    presenterBCChannel: null,
    screeningMode: undefined,
  }),

  actions: {
    setScreening(screening: boolean) {
      this.screening = screening
      if (screening) {
        this.setScreeningBCChannel()
      }
      else if (this.presenterBCChannel) {
        this.presenterBCChannel.bc.close()
        this.presenterBCChannel = null
      }
    },
    setScreeningBCChannel() {
      // 浏览器页面通讯
      const bcID = nanoid()
      this.presenterBCChannel = {
        bcID,
        bc: new BroadcastChannel('presenterMessage'),
      }
      const { exitScreening } = useScreening()
      this.presenterBCChannel.bc.onmessage = function(e) {
        const slidesStore = useSlidesStore()
        const screenStore = useScreenStore()

        const data = e.data
        if (data.origin !== bcID) {
          switch (data.message.action) {
            case 'updateSlideIndexByBC':
              slidesStore.updateSlideIndex(data.message.value, 'disableBCAction')
              break
            case 'exitScreeningByBC':
              if (screenStore.screeningMode === 'base') {
                exitScreening()
              }
              else if (screenStore.screeningMode === 'presenter') {
                window.close()
              }
              break
            default:
              break
          }
        }
      }
    },
    changeScreeningMode(mode: 'base' | 'presenter' | undefined) {
      this.screeningMode = mode
    }
  },
})
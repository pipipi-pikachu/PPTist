import { defineStore } from 'pinia'

export interface KeyboardState {
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
}

export const useKeyboardStore = defineStore('keyboard', {
  state: (): KeyboardState => ({
    ctrlKeyState: false, // ctrl键按下状态
    shiftKeyState: false, // shift键按下状态
  }),

  getters: {
    ctrlOrShiftKeyActive(state) {
      return state.ctrlKeyState || state.shiftKeyState
    },
  },

  actions: {
    setCtrlKeyState(active: boolean) {
      this.ctrlKeyState = active
    },
    setShiftKeyState(active: boolean) {
      this.shiftKeyState = active
    },
  },
})
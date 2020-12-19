import { createStore } from 'vuex'
import { mutations } from './mutations'
import { getters } from './getters'
import { MutationTypes } from './constants'

import { Slide } from '@/types/slides'
import { slides } from '@/mocks/index'
import { FontName } from '@/configs/fontName'

export { MutationTypes }

export interface State {
  activeElementIdList: string[];
  handleElementId: string;
  editorAreaShowScale: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  availableFonts: FontName[];
  slides: Slide[];
  slideIndex: number;
  cursor: number;
  historyRecordLength: number;
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
}

const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  editorAreaShowScale: 85,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  disableHotkeys: false,
  availableFonts: [],
  slides: slides,
  slideIndex: 0,
  cursor: -1,
  historyRecordLength: 0,
  ctrlKeyState: false,
  shiftKeyState: false,
}

export default createStore({
  state,
  getters,
  mutations,
})

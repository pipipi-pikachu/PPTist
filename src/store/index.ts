import { createStore } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { MutationTypes, ActionTypes } from './constants'

import { Slide } from '@/types/slides'
import { slides } from '@/mocks/index'
import { FontName } from '@/configs/fontName'

export { MutationTypes, ActionTypes }

export interface State {
  activeElementIdList: string[];
  handleElementId: string;
  editorAreaShowScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  availableFonts: FontName[];
  slides: Slide[];
  slideIndex: number;
  snapshotCursor: number;
  snapshotLength: number;
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
}

const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  editorAreaShowScale: 90,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  disableHotkeys: false,
  availableFonts: [],
  slides: slides,
  slideIndex: 0,
  snapshotCursor: -1,
  snapshotLength: 0,
  ctrlKeyState: false,
  shiftKeyState: false,
}

export default createStore({
  state,
  getters,
  mutations,
  actions,
})

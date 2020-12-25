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
  canvasPercentage: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  showGridLines: boolean;
  availableFonts: FontName[];
  toolbarState: string;
  slides: Slide[];
  slideIndex: number;
  snapshotCursor: number;
  snapshotLength: number;
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
  screening: boolean;
}

const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  canvasPercentage: 90,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  disableHotkeys: false,
  showGridLines: false,
  availableFonts: [],
  toolbarState: '',
  slides: slides,
  slideIndex: 0,
  snapshotCursor: -1,
  snapshotLength: 0,
  ctrlKeyState: false,
  shiftKeyState: false,
  screening: false,
}

export default createStore({
  state,
  getters,
  mutations,
  actions,
})

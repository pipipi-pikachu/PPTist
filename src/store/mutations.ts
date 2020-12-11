import { MutationTypes } from './constants'
import { State } from './state'

export type Mutations = {
  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state: State, activeElementIdList: string[]): void;
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state: State, handleElementId: string): void;
}

export const mutations: Mutations = {
  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state, activeElementIdList) {
    if(activeElementIdList.length === 1) state.handleElementId = activeElementIdList[0]
    else state.handleElementId = ''
    
    state.activeElementIdList = activeElementIdList
  },
  
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state, handleElementId) {
    state.handleElementId = handleElementId
  },
}
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { state, State } from './state'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { MutationTypes, ActionTypes } from './constants'

export { MutationTypes, ActionTypes }

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state,
  getters,
  mutations,
  actions,
})

export const useStore = () => baseUseStore(key)
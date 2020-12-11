import { createStore } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { getters } from './getters'

export default createStore({
  state,
  getters,
  mutations,
})

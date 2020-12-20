import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { State, ActionTypes } from '@/store'

export default () => {
  const store = useStore<State>()

  const addHistorySnapshot = debounce(function() {
    store.dispatch(ActionTypes.ADD_SNAPSHOT)
  }, 300, { trailing: true })

  return {
    addHistorySnapshot,
  }
}
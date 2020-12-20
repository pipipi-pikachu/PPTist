import { useStore } from 'vuex'
import throttle from 'lodash/throttle'
import { State, ActionTypes } from '@/store'

export default () => {
  const store = useStore<State>()

  const redo = throttle(function() {
    store.dispatch(ActionTypes.RE_DO)
  }, 100, { leading: true, trailing: false })

  const undo = throttle(function() {
    store.dispatch(ActionTypes.UN_DO)
  }, 100, { leading: true, trailing: false })

  return {
    redo,
    undo,
  }
}
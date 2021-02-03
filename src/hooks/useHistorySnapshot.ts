import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { ActionTypes, useStore } from '@/store'

export default () => {
  const store = useStore()

  const addHistorySnapshot = debounce(function () {
    store.dispatch(ActionTypes.ADD_SNAPSHOT)
  }, 300, { trailing: true })

  const redo = throttle(function () {
    store.dispatch(ActionTypes.RE_DO)
  }, 100, { leading: true, trailing: false })

  const undo = throttle(function () {
    store.dispatch(ActionTypes.UN_DO)
  }, 100, { leading: true, trailing: false })

  return {
    addHistorySnapshot,
    redo,
    undo,
  }
}
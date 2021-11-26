import { debounce, throttle} from 'lodash'
import { useSnapshotStore } from '@/store'

export default () => {
  const snapshotStore = useSnapshotStore()

  // 添加历史快照(历史记录)
  const addHistorySnapshot = debounce(function() {
    snapshotStore.addSnapshot()
  }, 300, { trailing: true })

  // 重做
  const redo = throttle(function() {
    snapshotStore.reDo()
  }, 100, { leading: true, trailing: false })

  // 撤销
  const undo = throttle(function() {
    snapshotStore.unDo()
  }, 100, { leading: true, trailing: false })

  return {
    addHistorySnapshot,
    redo,
    undo,
  }
}
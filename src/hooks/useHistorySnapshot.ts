import { debounce, throttle, type DebouncedFunc } from 'lodash'
import { useSnapshotStore } from '@/store'

// 同一文稿的修改可能来自不同组件；排序前需要提交这些组件尚未执行的快照。
const pendingSnapshots = new WeakMap<ReturnType<typeof useSnapshotStore>, Set<DebouncedFunc<() => Promise<void>>>>()

export default () => {
  const snapshotStore = useSnapshotStore()
  const pending = pendingSnapshots.get(snapshotStore) || new Set<DebouncedFunc<() => Promise<void>>>()
  pendingSnapshots.set(snapshotStore, pending)

  // 添加历史快照(历史记录)
  const saveSnapshot = debounce(function() {
    pending.delete(saveSnapshot)
    return snapshotStore.addSnapshot()
  }, 300, { trailing: true })

  const addHistorySnapshot = () => {
    pending.add(saveSnapshot)
    saveSnapshot()
  }

  const flushHistorySnapshots = () => {
    if (!pending.size) return
    // 待执行任务都读取当前文稿，合并为一次写入即可保留排序前的完整状态。
    for (const save of pending) save.cancel()
    pending.clear()
    return snapshotStore.addSnapshot()
  }

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
    flushHistorySnapshots,
    redo,
    undo,
  }
}
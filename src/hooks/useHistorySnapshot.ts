import { debounce, throttle} from 'lodash'
import { useSnapshotStore } from '@/store'

/**
 * 提供历史快照、撤销和重做操作。
 *
 * @returns 包含添加历史快照、重做和撤销的方法集合。
 * @throws 当前 composable 不主动抛错；snapshotStore 内部异常会向上表现为运行时错误。
 * @remarks
 * - 添加历史快照使用 debounce，避免连续小操作过度写入历史记录。
 * - 撤销/重做使用 throttle，避免快捷键长按或重复触发造成状态跳变过快。
 */
export default () => {
  // 获取历史快照 store，实际快照读写由该 store 负责。
  const snapshotStore = useSnapshotStore()

  /**
   * 添加历史快照。
   *
   * @returns 无显式返回值。
   * @throws snapshotStore.addSnapshot 异常会在 debounce 执行时向上表现。
   * @remarks
   * - 延迟 300ms，并只在 trailing 阶段执行。
   * - 多个连续调用会合并为一次快照，适合拖拽、输入或批量属性更新后的记录。
   */
  const addHistorySnapshot = debounce(function() {
    // 将当前演示文稿状态写入历史快照。
    snapshotStore.addSnapshot()
  }, 300, { trailing: true })

  /**
   * 执行重做。
   *
   * @returns 无显式返回值。
   * @throws snapshotStore.reDo 异常会在 throttle 执行时向上表现。
   * @remarks 100ms 内只允许 leading 执行一次，避免快捷键重复触发过快。
   */
  const redo = throttle(function() {
    // 调用 store 的重做逻辑。
    snapshotStore.reDo()
  }, 100, { leading: true, trailing: false })

  /**
   * 执行撤销。
   *
   * @returns 无显式返回值。
   * @throws snapshotStore.unDo 异常会在 throttle 执行时向上表现。
   * @remarks 100ms 内只允许 leading 执行一次，避免快捷键重复触发过快。
   */
  const undo = throttle(function() {
    // 调用 store 的撤销逻辑。
    snapshotStore.unDo()
  }, 100, { leading: true, trailing: false })

  // 返回历史记录相关操作方法。
  return {
    addHistorySnapshot,
    redo,
    undo,
  }
}

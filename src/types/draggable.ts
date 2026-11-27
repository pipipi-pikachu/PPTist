import type { SortableEvent } from 'sortablejs'

export interface DraggableEvent extends SortableEvent {
  originalEvent: Event
  oldIndex: number
  newIndex: number
  cancelled: boolean
  keys: (string | number)[]
  // 按拖拽前的列表顺序排列；单选时也始终只有一项。
  oldIndices: number[]
  newIndices: number[]
}

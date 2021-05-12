import { ActionTree } from 'vuex'
import { IndexableTypeArray } from 'dexie'
import { State } from './state'
import { ActionTypes, MutationTypes } from './constants'
import { snapshotDB, Snapshot } from '@/utils/database'

export const actions: ActionTree<State, State> = {
  async [ActionTypes.INIT_SNAPSHOT_DATABASE]({ commit, state }) {
    const snapshots: Snapshot[] = await snapshotDB.snapshots.orderBy('id').toArray()
    const lastSnapshot = snapshots.slice(-1)[0]

    if (lastSnapshot) {
      snapshotDB.snapshots.clear()
    }

    const newFirstSnapshot = {
      index: state.slideIndex,
      slides: state.slides,
    }
    await snapshotDB.snapshots.add(newFirstSnapshot)
    commit(MutationTypes.SET_SNAPSHOT_CURSOR, 0)
    commit(MutationTypes.SET_SNAPSHOT_LENGTH, 1)
  },

  async [ActionTypes.ADD_SNAPSHOT]({ state, commit }) {

    // 获取当前indexeddb中全部快照的ID
    const allKeys = await snapshotDB.snapshots.orderBy('id').keys()

    let needDeleteKeys: IndexableTypeArray = []

    // 记录需要删除的快照ID
    // 若当前快照指针不处在最后一位，那么再添加快照时，应该将当前指针位置后面的快照全部删除，对应的实际情况是：
    // 用户撤回多次后，再进行操作（添加快照），此时原先被撤销的快照都应该被删除
    if (state.snapshotCursor >= 0 && state.snapshotCursor < allKeys.length - 1) {
      needDeleteKeys = allKeys.slice(state.snapshotCursor + 1)
    }

    // 添加新快照
    const snapshot = {
      index: state.slideIndex,
      slides: state.slides,
    }
    await snapshotDB.snapshots.add(snapshot)

    // 计算当前快照长度，用于设置快照指针的位置（此时指针应该处在最后一位，即：快照长度 - 1）
    let snapshotLength = allKeys.length - needDeleteKeys.length + 1

    // 快照数量超过长度限制时，应该将头部多余的快照删除
    const snapshotLengthLimit = 20
    if (snapshotLength > snapshotLengthLimit) {
      needDeleteKeys.push(allKeys[0])
      snapshotLength--
    }

    // 快照数大于1时，需要保证撤回操作后维持页面焦点不变：也就是将倒数第二个快照对应的索引设置为当前页的索引
    // https://github.com/pipipi-pikachu/PPTist/issues/27
    if (snapshotLength >= 2) {
      snapshotDB.snapshots.update(allKeys[snapshotLength - 2] as number, { index: state.slideIndex })
    }

    await snapshotDB.snapshots.bulkDelete(needDeleteKeys)

    commit(MutationTypes.SET_SNAPSHOT_CURSOR, snapshotLength - 1)
    commit(MutationTypes.SET_SNAPSHOT_LENGTH, snapshotLength)
  },

  async [ActionTypes.UN_DO]({ state, commit }) {
    if (state.snapshotCursor <= 0) return

    const snapshotCursor = state.snapshotCursor - 1
    const snapshots: Snapshot[] = await snapshotDB.snapshots.orderBy('id').toArray()
    const snapshot = snapshots[snapshotCursor]
    const { index, slides } = snapshot

    const slideIndex = index > slides.length - 1 ? slides.length - 1 : index

    commit(MutationTypes.SET_SLIDES, slides)
    commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex)
    commit(MutationTypes.SET_SNAPSHOT_CURSOR, snapshotCursor)
    commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
  },

  async [ActionTypes.RE_DO]({ state, commit }) {
    if (state.snapshotCursor >= state.snapshotLength - 1) return

    const snapshotCursor = state.snapshotCursor + 1
    const snapshots: Snapshot[] = await snapshotDB.snapshots.orderBy('id').toArray()
    const snapshot = snapshots[snapshotCursor]
    const { index, slides } = snapshot

    const slideIndex = index > slides.length - 1 ? slides.length - 1 : index

    commit(MutationTypes.SET_SLIDES, slides)
    commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex)
    commit(MutationTypes.SET_SNAPSHOT_CURSOR, snapshotCursor)
    commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
  },
}
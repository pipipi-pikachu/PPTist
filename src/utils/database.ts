import Dexie, { type EntityTable } from 'dexie'
import { databaseId } from '@/store/main'
import type { Slide } from '@/types/slides'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'

/**
 * 放映画笔或批注画板缓存图片记录。
 *
 * @property id - 图片记录唯一标识，通常与幻灯片或画板状态关联。
 * @property dataURL - 图片的 Data URL 字符串，可直接用于 `<img>` 或 canvas 还原。
 * @remarks 该数据存放在 IndexedDB 中，适合保存体积较大的临时绘制结果，避免塞入 localStorage。
 */
export interface writingBoardImg {
  id: string
  dataURL: string
}

/**
 * 编辑历史快照记录。
 *
 * @property id - IndexedDB 自增主键。
 * @property index - 快照在历史栈中的位置索引，用于撤销/重做定位。
 * @property slides - 当前快照保存的完整幻灯片数据。
 * @remarks slides 体积可能较大，因此使用 IndexedDB 持久化，减少内存和 localStorage 压力。
 */
export interface Snapshot {
  id: number
  index: number
  slides: Slide[]
}

// 项目 IndexedDB 名称前缀；真实库名还会包含本次应用实例 id 和创建时间。
const databaseNamePrefix = 'PPTist'

/**
 * 删除失效或过期的 PPTist IndexedDB 数据库。
 *
 * @returns Promise；清理流程完成后 resolve。
 * @throws 当浏览器 IndexedDB、Dexie 或 localStorage 访问失败时，异常会向上抛出。
 * @remarks
 * - 应用关闭或刷新时会把当前数据库 ID 写入 localStorage，表示该数据库已失效。
 * - 应用初始化时会扫描浏览器内全部数据库，删除已记录失效的库。
 * - 为防止异常退出导致未记录失效 ID，创建时间超过 12 小时的 PPTist 数据库也会被删除。
 * - 只处理名称包含 `PPTist` 前缀的数据库，避免误删其他应用数据。
 */
export const deleteDiscardedDB = async () => {
  // 记录当前时间戳，用于判断数据库名称中的创建时间是否已经超过保留窗口。
  const now = new Date().getTime()

  // 从 localStorage 读取已失效数据库 ID 列表；该字段通常在页面关闭或刷新时写入。
  const localStorageDiscardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  // 将 JSON 字符串解析为数组；没有记录时按空数组处理，避免后续 includes 报错。
  const localStorageDiscardedDBList: string[] = localStorageDiscardedDB ? JSON.parse(localStorageDiscardedDB) : []

  // 读取当前浏览器环境下 Dexie 可见的所有 IndexedDB 名称。
  const databaseNames = await Dexie.getDatabaseNames()
  // 筛选出需要删除的 PPTist 数据库名称。
  const discardedDBNames = databaseNames.filter(name => {
    // 非 PPTist 前缀数据库不是本项目创建的，必须跳过，避免影响其他站点或功能。
    if (name.indexOf(databaseNamePrefix) === -1) return false
    
    // 数据库命名约定为 `PPTist_${databaseId}_${timestamp}`，拆分后用于校验和过期判断。
    const [prefix, id, time] = name.split('_')
    // 命名结构不完整的 PPTist 数据库视为异常残留，允许清理。
    if (prefix !== databaseNamePrefix || !id || !time) return true
    // 如果数据库 ID 已被记录为失效，说明对应应用实例已经关闭或刷新，应清理。
    if (localStorageDiscardedDBList.includes(id)) return true
    // 数据库创建超过 12 小时视为过期，防止异常退出后无限残留。
    if (now - (+time) >= 1000 * 60 * 60 * 12) return true

    // 未命中任何失效条件时保留该数据库。
    return false
  })

  // 逐个删除筛选出的失效数据库；保持既有行为，不等待每个 delete Promise。
  for (const name of discardedDBNames) Dexie.delete(name)
  // 清理本次消费过的失效数据库记录，避免下一次启动重复处理同一批 ID。
  localStorage.removeItem(LOCALSTORAGE_KEY_DISCARDED_DB)
}

// 创建当前应用实例专属数据库，名称包含随机实例 ID 和创建时间，降低多标签页之间的冲突概率。
const db = new Dexie(`${databaseNamePrefix}_${databaseId}_${new Date().getTime()}`) as Dexie & {
  // 历史快照表，主键为自增 id。
  snapshots: EntityTable<Snapshot, 'id'>,
  // 画板图片表，主键为业务侧传入的字符串 id。
  writingBoardImgs: EntityTable<writingBoardImg, 'id'>,
}

// 声明数据库版本和表结构；版本号变更时 Dexie 会按迁移规则处理结构升级。
db.version(1).stores({
  // `++id` 表示 id 为自增主键，适合历史快照顺序写入。
  snapshots: '++id',
  // `id` 表示使用记录中的 id 字段作为主键，适合按画板或幻灯片标识直接查找。
  writingBoardImgs: 'id',
})

// 导出数据库单例，供历史快照、画板缓存等模块复用。
export { db }

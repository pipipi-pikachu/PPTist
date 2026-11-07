import Dexie, { type EntityTable } from 'dexie'
import type { PresentationVersion, VersionStorage } from '@/types/version'

export const VERSION_LIMIT = 30
export const VERSION_BYTE_LIMIT = 50 * 1024 * 1024

// Kept outside the transient PPTist_* undo databases.
const database = new Dexie('pptist-version-history') as Dexie & {
  versions: EntityTable<PresentationVersion & { bytes: number }, 'id'>
}
database.version(1).stores({ versions: 'id, documentId, createdAt' })

export const indexedDBVersionStorage: VersionStorage = {
  async list(documentId) {
    const versions = await database.versions.where('documentId').equals(documentId).sortBy('createdAt')
    return versions.reverse()
  },
  async save(version) {
    const bytes = new Blob([JSON.stringify(version)]).size
    if (bytes > VERSION_BYTE_LIMIT) throw new Error('此版本超过 50 MB，无法保存到浏览器历史记录')
    await database.transaction('rw', database.versions, async () => {
      const latest = await database.versions.orderBy('createdAt').last()
      await database.versions.put({ ...version, createdAt: Math.max(Date.now(), (latest?.createdAt || 0) + 1), bytes })
      const versions = await database.versions.orderBy('createdAt').reverse().toArray()
      let total = 0
      const counts = new Map<string, number>()
      const remove: string[] = []
      for (const item of versions) {
        const count = (counts.get(item.documentId) || 0) + 1
        counts.set(item.documentId, count)
        if (count > VERSION_LIMIT || total + item.bytes > VERSION_BYTE_LIMIT) remove.push(item.id)
        else total += item.bytes
      }
      await database.versions.bulkDelete(remove)
    })
  },
}

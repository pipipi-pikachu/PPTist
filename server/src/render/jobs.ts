import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { nanoid } from 'nanoid'

import type { AppConfig } from '../config'
import type { Db, DocumentRow, ExportJobRow } from '../db'
import { exportsDir, runExport, type ExportRequest } from './export'
import type { RenderQueue } from './queue'

const FILE_TTL_MS = 24 * 60 * 60 * 1000

export function getExportJob(db: Db, jobId: string): ExportJobRow | undefined {
  return db.prepare('SELECT * FROM export_jobs WHERE id = ?').get(jobId) as ExportJobRow | undefined
}

export function findJobByFile(db: Db, file: string): ExportJobRow | undefined {
  return db.prepare('SELECT * FROM export_jobs WHERE file = ?').get(file) as ExportJobRow | undefined
}

export function exportsUsedToday(db: Db, ownerId: string): number {
  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const row = db.prepare('SELECT COUNT(*) AS n FROM export_jobs WHERE owner_id = ? AND created_at >= ?')
    .get(ownerId, dayStart.getTime()) as { n: number }
  return row.n
}

export function exportQuotaFor(db: Db, config: AppConfig, ownerId: string): number {
  const row = db.prepare('SELECT quota_exports_per_day FROM users WHERE id = ?').get(ownerId) as { quota_exports_per_day: number | null } | undefined
  return row?.quota_exports_per_day ?? config.defaultQuotaExportsPerDay
}

export interface SubmittedJob {
  job: ExportJobRow
  // 任务结束（done 或 failed）后 resolve 为最新 job 行
  settled: Promise<ExportJobRow>
}

// 建任务并入队；导出结果落盘后回填 file，失败回填 error
export function submitExport(
  deps: { db: Db, config: AppConfig, queue: RenderQueue },
  row: DocumentRow,
  req: ExportRequest,
): SubmittedJob {
  const { db, config, queue } = deps
  const id = nanoid(21)
  const now = Date.now()
  db.prepare('INSERT INTO export_jobs (id, owner_id, doc_id, version, format, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, row.owner_id, row.id, row.version, req.format, 'pending', now)

  const task = queue.run(async () => {
    db.prepare('UPDATE export_jobs SET status = ? WHERE id = ?').run('running', id)
    return await runExport({ config }, row, req)
  })

  const settled = task
    .then(result => {
      db.prepare('UPDATE export_jobs SET status = ?, file = ?, finished_at = ? WHERE id = ?')
        .run('done', result.fileName, Date.now(), id)
    })
    .catch(err => {
      db.prepare('UPDATE export_jobs SET status = ?, error = ?, finished_at = ? WHERE id = ?')
        .run('failed', (err as Error).message ?? '导出失败', Date.now(), id)
    })
    .then(() => getExportJob(db, id)!)

  return { job: getExportJob(db, id)!, settled }
}

// 清理超过 24h 的导出文件与对应 job 记录（含没有记录的孤儿文件）
export function cleanupExpiredExports(db: Db, config: AppConfig): { files: number, jobs: number } {
  const cutoff = Date.now() - FILE_TTL_MS
  const dir = exportsDir(config)
  let files = 0

  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    try {
      if (statSync(path).mtimeMs < cutoff) {
        unlinkSync(path)
        files++
      }
    }
    catch { /* 文件可能正被写入或已删除 */ }
  }

  const staleJobs = db.prepare('SELECT file FROM export_jobs WHERE created_at < ?').all(cutoff) as { file: string | null }[]
  for (const job of staleJobs) {
    if (job.file) {
      const path = join(dir, job.file)
      if (existsSync(path)) {
        try {
          unlinkSync(path); files++ 
        }
        catch { /* 忽略 */ }
      }
    }
  }
  const removed = db.prepare('DELETE FROM export_jobs WHERE created_at < ?').run(cutoff)
  return { files, jobs: removed.changes }
}

import { gunzipSync, gzipSync } from 'node:zlib'
import { isDeepStrictEqual } from 'node:util'
import * as jsonpatch from 'fast-json-patch'
import { nanoid } from 'nanoid'

import type { PPTVideoElement, SlideTheme } from '../../../src/types/slides'
import { docLinks, type DocAccess } from '../auth'
import type { AppConfig } from '../config'
import type { Db, DocumentRow, UserRow } from '../db'
import { AppError } from '../errors'
import { publish } from '../events'
import { dataUrlToAsset } from '../assets/store'
import { parseDocument, normalizeDocIds, type DocData } from '../schema/document'
import { collectDataImageUrls, sanitizeDocument } from '../schema/sanitize'
import { summarize } from './diff'
import { mergeDocuments } from './merge'
import { applyOps, type Op } from './ops'
import { maintainRefs } from './refs'

const SNAPSHOT_KEEP = 100

// 与 src/store/slides.ts 初始值一致
const DEFAULT_THEME: SlideTheme = {
  themeColors: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
  fontColor: '#333',
  fontName: '',
  backgroundColor: '#fff',
  shadow: { h: 3, v: 3, blur: 2, color: '#808080' },
  outline: { width: 2, color: '#525252', style: 'solid' },
}

export interface CommitResult {
  version: number
  summary: string[]
  normalized: boolean
  unchanged: boolean
}

export interface DocServiceDeps {
  db: Db
  config: AppConfig
}

export function createDocService({ db, config }: DocServiceDeps) {
  const getUserStmt = () => db.prepare('SELECT * FROM users WHERE id = ?')

  function mustGetDoc(docId: string): DocumentRow {
    const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId) as DocumentRow | undefined
    if (!row) throw AppError.notFound()
    return row
  }

  function ownerQuota(ownerId: string): { docs: number, docBytes: number } {
    const user = getUserStmt().get(ownerId) as UserRow | undefined
    return {
      docs: user?.quota_docs ?? config.defaultQuotaDocs,
      docBytes: user?.quota_doc_bytes ?? config.defaultQuotaDocBytes,
    }
  }

  // 写入流水线第 1–5 步：校验 → 补全 id → 清洗 → data: 图片转存 → 维护引用
  // normalized=true 表示提交的内容被这些步骤改动过（网页端应重新拉取一次）
  function prepare(raw: unknown, ownerId: string): { data: DocData, normalized: boolean } {
    const data = parseDocument(raw)
    let normalized = normalizeDocIds(data)

    const beforeSanitize = JSON.stringify(data)
    sanitizeDocument(data)
    if (JSON.stringify(data) !== beforeSanitize) normalized = true

    for (const hit of collectDataImageUrls(data)) {
      const slide = data.slides[hit.slideIndex]
      const current = hit.elementIndex === null
        ? slide.background!.image!.src
        : hit.kind === 'src'
          ? (slide.elements[hit.elementIndex] as { src: string }).src
          : (slide.elements[hit.elementIndex] as PPTVideoElement).poster!
      const saved = dataUrlToAsset(db, config, ownerId, current)
      if (!saved) continue
      if (hit.elementIndex === null) slide.background!.image!.src = saved.url
      else if (hit.kind === 'src') (slide.elements[hit.elementIndex] as { src: string }).src = saved.url
      else (slide.elements[hit.elementIndex] as PPTVideoElement).poster = saved.url
      normalized = true
    }

    if (maintainRefs(data.slides)) normalized = true
    return { data, normalized }
  }

  // 写入流水线第 6–9 步：大小检查 → 无变化短路 → 事务写库 → SSE 推送
  function commitPrepared(docId: string, data: DocData, normalized: boolean, author: 'agent' | 'user', keyId?: string): CommitResult {
    const row = mustGetDoc(docId)
    const quota = ownerQuota(row.owner_id)
    const json = JSON.stringify(data)
    const size = Buffer.byteLength(json)
    if (size > quota.docBytes) {
      throw AppError.docTooLarge(`文档超过大小限制（${Math.round(quota.docBytes / 1024 / 1024)}MB）`)
    }

    const prev = JSON.parse(row.data) as DocData
    if (isDeepStrictEqual(prev, data)) {
      return { version: row.version, summary: [], normalized, unchanged: true }
    }

    const version = row.version + 1
    const summary = summarize(prev, data)
    const snapshot = gzipSync(json)
    const now = Date.now()

    const write = db.transaction(() => {
      db.prepare('UPDATE documents SET title = ?, data = ?, version = ?, size = ?, updated_at = ? WHERE id = ?')
        .run(data.title, json, version, size, now, docId)
      db.prepare('INSERT INTO revisions (doc_id, version, author, key_id, summary, snapshot, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(docId, version, author, keyId ?? null, JSON.stringify(summary), snapshot, now)
      db.prepare('UPDATE revisions SET snapshot = NULL WHERE doc_id = ? AND version <= ? AND snapshot IS NOT NULL')
        .run(docId, version - SNAPSHOT_KEEP)
    })
    write()

    publish(docId, { version, author, summary })
    return { version, summary, normalized, unchanged: false }
  }

  function commit(docId: string, raw: unknown, author: 'agent' | 'user', keyId?: string): CommitResult {
    const row = mustGetDoc(docId)
    const { data, normalized } = prepare(raw, row.owner_id)
    return commitPrepared(docId, data, normalized, author, keyId)
  }

  return {
    // 新建文档：检查文档数配额，数据同样走完整流水线
    createDoc(ownerId: string, input: { title?: string, theme?: SlideTheme, viewportRatio?: number, slides?: unknown }, author: 'agent' | 'user', keyId?: string) {
      const quota = ownerQuota(ownerId)
      const count = db.prepare('SELECT COUNT(*) AS n FROM documents WHERE owner_id = ?').get(ownerId) as { n: number }
      if (count.n >= quota.docs) {
        throw AppError.quotaExceeded(`文档数量已达上限（${quota.docs}）`)
      }

      const raw = {
        title: input.title ?? '未命名演示文稿',
        theme: input.theme ?? DEFAULT_THEME,
        viewportSize: 1000,
        viewportRatio: input.viewportRatio ?? 0.5625,
        slides: input.slides ?? [],
      }
      const { data } = prepare(raw, ownerId)
      const json = JSON.stringify(data)
      const size = Buffer.byteLength(json)
      if (size > quota.docBytes) {
        throw AppError.docTooLarge(`文档超过大小限制（${Math.round(quota.docBytes / 1024 / 1024)}MB）`)
      }

      const id = nanoid(12)
      const now = Date.now()
      const summary = [data.slides.length ? `创建文档（${data.slides.length} 页）` : '创建文档']
      const write = db.transaction(() => {
        db.prepare('INSERT INTO documents (id, owner_id, title, data, version, size, link_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(id, ownerId, data.title, json, 1, size, 1, now, now)
        db.prepare('INSERT INTO revisions (doc_id, version, author, key_id, summary, snapshot, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .run(id, 1, author, keyId ?? null, JSON.stringify(summary), gzipSync(json), now)
      })
      write()

      const row = mustGetDoc(id)
      publish(id, { version: 1, author, summary })
      return { docId: id, version: 1, ...docLinks(config, row) }
    },

    getDoc(docId: string) {
      const row = mustGetDoc(docId)
      return { row, data: JSON.parse(row.data) as DocData }
    },

    listDocs(ownerId: string) {
      const rows = db.prepare(
        'SELECT id, title, version, data, updated_at FROM documents WHERE owner_id = ? ORDER BY updated_at DESC'
      ).all(ownerId) as { id: string, title: string, version: number, data: string, updated_at: number }[]
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        version: row.version,
        slideCount: (JSON.parse(row.data) as DocData).slides.length,
        updatedAt: row.updated_at,
      }))
    },

    deleteDoc(docId: string) {
      mustGetDoc(docId)
      const write = db.transaction(() => {
        db.prepare('DELETE FROM revisions WHERE doc_id = ?').run(docId)
        db.prepare('DELETE FROM documents WHERE id = ?').run(docId)
      })
      write()
    },

    // 网页端自动保存：baseVersion == 当前版本直接写；落后则三方合并
    putDoc(access: DocAccess, docId: string, baseVersion: number, input: unknown) {
      const row = mustGetDoc(docId)
      const { data: theirs, normalized } = prepare(input, row.owner_id)

      if (baseVersion === row.version) {
        const result = commitPrepared(docId, theirs, normalized, access.author, access.keyId)
        return { ...result, merged: false }
      }

      const rev = db.prepare('SELECT snapshot FROM revisions WHERE doc_id = ? AND version = ?')
        .get(docId, baseVersion) as { snapshot: Buffer | null } | undefined
      if (!rev?.snapshot) {
        throw AppError.conflict('基线版本的快照已被清理，无法合并', { currentVersion: row.version })
      }
      const base = JSON.parse(gunzipSync(rev.snapshot).toString()) as DocData
      const mine = JSON.parse(row.data) as DocData
      const outcome = mergeDocuments(base, mine, theirs)
      if (outcome.conflicts) {
        throw AppError.conflict('与另一端的修改冲突', { currentVersion: row.version, conflicts: outcome.conflicts })
      }
      const result = commitPrepared(docId, outcome.result, normalized, access.author, access.keyId)
      return { ...result, merged: true }
    },

    // Agent 原子操作：传了 baseVersion 但和当前版本不一致 → 409
    applyAgentOps(access: DocAccess, docId: string, ops: Op[], baseVersion?: number) {
      const row = mustGetDoc(docId)
      if (baseVersion !== undefined && baseVersion !== row.version) {
        throw AppError.conflict(`baseVersion=${baseVersion} 与当前版本 ${row.version} 不一致，请先拉取最新文档`, { currentVersion: row.version })
      }
      const current = JSON.parse(row.data) as DocData
      const next = applyOps(current, ops)
      // ops 产物仍需走完整流水线：清洗新内容、维护引用、转存 data: 图片
      return commit(docId, next, access.author, access.keyId)
    },

    // RFC6902 patch：baseVersion 必须等于当前版本
    applyJsonPatch(access: DocAccess, docId: string, baseVersion: number, patch: unknown[]) {
      const row = mustGetDoc(docId)
      if (baseVersion !== row.version) {
        throw AppError.conflict(`baseVersion=${baseVersion} 与当前版本 ${row.version} 不一致`, { currentVersion: row.version })
      }
      const current = JSON.parse(row.data) as DocData
      let next: DocData
      try {
        next = jsonpatch.applyPatch(structuredClone(current), patch as jsonpatch.Operation[], true, false).newDocument as DocData
      }
      catch (err) {
        throw AppError.validation(`JSON Patch 应用失败: ${(err as Error).message}`)
      }
      return commit(docId, next, access.author, access.keyId)
    },

    listRevisions(docId: string, since: number) {
      mustGetDoc(docId)
      const rows = db.prepare(
        'SELECT version, author, summary, created_at FROM revisions WHERE doc_id = ? AND version > ? ORDER BY version'
      ).all(docId, since) as { version: number, author: string, summary: string, created_at: number }[]
      return rows.map(row => ({
        version: row.version,
        author: row.author,
        createdAt: row.created_at,
        summary: JSON.parse(row.summary) as string[],
      }))
    },

    // 重新生成链接：link_version+1，旧令牌立即失效
    rotateLinks(docId: string) {
      mustGetDoc(docId)
      db.prepare('UPDATE documents SET link_version = link_version + 1 WHERE id = ?').run(docId)
      const row = mustGetDoc(docId)
      return docLinks(config, row)
    },
  }
}

export type DocService = ReturnType<typeof createDocService>

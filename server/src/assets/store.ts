import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { nanoid } from 'nanoid'

import type { AppConfig } from '../config'
import type { AssetRow, Db } from '../db'
import { AppError } from '../errors'

const MAGIC: { mime: string, ext: string, bytes: number[] }[] = [
  { mime: 'image/png', ext: 'png', bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/jpeg', ext: 'jpg', bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/gif', ext: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // 需再校验第 8~11 字节为 WEBP
]

export function detectImageType(buffer: Buffer): { mime: string, ext: string } | undefined {
  for (const magic of MAGIC) {
    if (buffer.length < magic.bytes.length) continue
    if (!magic.bytes.every((byte, i) => buffer[i] === byte)) continue
    if (magic.ext === 'webp' && buffer.toString('ascii', 8, 12) !== 'WEBP') continue
    return { mime: magic.mime, ext: magic.ext }
  }
  return undefined
}

function looksLikeSvg(buffer: Buffer): boolean {
  const head = buffer.toString('utf8', 0, Math.min(buffer.length, 512)).trimStart()
  return head.startsWith('<') && (head.includes('<svg') || head.startsWith('<?xml'))
}

// 保存图片资产：文件头识别类型（只允许 png/jpeg/gif/webp，禁 svg），按 (owner_id, sha256) 去重
export function saveAsset(db: Db, config: AppConfig, ownerId: string, buffer: Buffer): { id: string, url: string, mime: string, size: number } {
  if (!buffer.length) throw AppError.validation('图片内容为空')
  if (buffer.length > config.maxAssetBytes) {
    throw AppError.docTooLarge(`图片超过大小限制（${Math.round(config.maxAssetBytes / 1024 / 1024)}MB）`)
  }
  if (looksLikeSvg(buffer)) {
    throw AppError.validation('不允许上传 svg 图片')
  }
  const type = detectImageType(buffer)
  if (!type) throw AppError.validation('无法识别的图片格式（仅支持 png/jpeg/gif/webp）')

  const sha256 = createHash('sha256').update(buffer).digest('hex')
  const existing = db.prepare('SELECT * FROM assets WHERE owner_id = ? AND sha256 = ?').get(ownerId, sha256) as AssetRow | undefined
  if (existing) {
    return { id: existing.id, url: assetUrl(existing.id, existing.mime), mime: existing.mime, size: existing.size }
  }

  const id = nanoid(16)
  const dir = join(config.dataDir, 'assets')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, `${id}.${type.ext}`), buffer)
  db.prepare('INSERT INTO assets (id, owner_id, mime, size, sha256, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, ownerId, type.mime, buffer.length, sha256, Date.now())
  return { id, url: assetUrl(id, type.mime), mime: type.mime, size: buffer.length }
}

export function assetUrl(id: string, mime: string): string {
  return `/assets/${id}.${mimeExt(mime)}`
}

function mimeExt(mime: string): string {
  return { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' }[mime] ?? 'bin'
}

// 把 data:image/... 转存为资产；不是 data: 地址时返回 undefined
export function dataUrlToAsset(db: Db, config: AppConfig, ownerId: string, dataUrl: string): { id: string, url: string } | undefined {
  const match = /^data:image\/(png|jpe?g|gif|webp);base64,(.+)$/is.exec(dataUrl)
  if (!match) return undefined
  // 非法 base64 解码出的内容过不了文件头校验，会在这里被拒绝
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64')
  return saveAsset(db, config, ownerId, buffer)
}

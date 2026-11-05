import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { fetchRemoteAsset } from '../assets/fetch'
import { dataUrlToAsset, saveAsset } from '../assets/store'
import { docLinks, type DocAccess } from '../auth'
import type { AppConfig } from '../config'
import type { Db, DocumentRow } from '../db'
import { toOutline } from '../docs/outline'
import type { Op } from '../docs/ops'
import type { DocService } from '../docs/service'
import { exportQuotaFor, exportsUsedToday, getExportJob, submitExport } from '../render/jobs'
import { EXPORT_FORMATS, renderSlideImage, type ExportFormat } from '../render/export'
import type { RenderQueue } from '../render/queue'
import type { DocData } from '../schema/document'
import { AppError } from '../errors'
import { getAuthoringGuide } from './guide'
import { MCP_INSTRUCTIONS } from './instructions'

export interface McpContext {
  db: Db
  config: AppConfig
  service: DocService
  queue: RenderQueue
  ownerId: string
  keyId: string
}

interface TextResult {
  [key: string]: unknown
  content: (
    | { type: 'text', text: string }
    | { type: 'image', data: string, mimeType: string }
  )[]
  isError?: boolean
}

function ok(data: unknown): TextResult {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  return { content: [{ type: 'text', text }] }
}

// 把服务端错误转成 Agent 能自我修正的提示
function fail(err: unknown): TextResult {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { error: err.code, message: err.message }
    if (err.issues !== undefined) body.issues = err.issues
    if (err.code === 'conflict') {
      body.hint = '文档已被另一端修改：先用 get_presentation 获取最新版本，在新版本基础上重新执行修改'
    }
    else if (err.code === 'validation') {
      body.hint = '按 issues 里的 path 定位并修正字段；元素结构不确定时先用 get_authoring_guide 查对应章节'
    }
    else if (err.code === 'not_found') {
      body.hint = '确认 docId 是否属于当前账号的文档，可用 list_presentations 查看'
    }
    return { content: [{ type: 'text', text: JSON.stringify(body, null, 2) }], isError: true }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify({ error: 'internal_error', message: `服务器内部错误: ${(err as Error).message}` }) }],
    isError: true,
  }
}

// 每个 MCP 请求新建一个 McpServer（无状态模式），ownerId/keyId 来自本次请求的 Bearer Key
export function buildMcpServer(ctx: McpContext): McpServer {
  const { db, config, service, queue, ownerId, keyId } = ctx
  const server = new McpServer(
    { name: 'pptist', version: '0.1.0' },
    { instructions: MCP_INSTRUCTIONS },
  )

  // Key 只能访问本人文档，不存在一律 404
  function ownDoc(docId: string): { row: DocumentRow, access: DocAccess } {
    const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId) as DocumentRow | undefined
    if (!row || row.owner_id !== ownerId) throw AppError.notFound('文档不存在或不属于当前账号')
    return {
      row,
      access: { ownerId, role: 'owner', author: 'agent', keyId, linkVersion: row.link_version },
    }
  }

  function docData(docId: string): { row: DocumentRow, data: DocData } {
    const { row } = ownDoc(docId)
    return { row, data: JSON.parse(row.data) as DocData }
  }

  function runOps(docId: string, ops: Op[]) {
    const { access } = ownDoc(docId)
    const result = service.applyAgentOps(access, docId, ops)
    return { version: result.version, summary: result.summary }
  }

  const call = <A>(fn: (args: A) => unknown | Promise<unknown>) =>
    async (args: A): Promise<TextResult> => {
      try {
        return ok(await fn(args))
      }
      catch (err) {
        return fail(err)
      }
    }

  const docIdField = z.string().min(1).describe('文档 id，由 create_presentation / list_presentations 返回')

  server.registerTool('get_authoring_guide', {
    description: '获取 PPTist 页面数据编写规范（AI_PPT_SCHEMA.md）。创建或修改页面前先调用：不传 section 返回章节目录，传了返回该章节完整 Markdown，如 general（坐标系/几何/样式）、slide、text、image、shape、line、table、chart、richtext（富文本白名单）、fonts（可用字体）、example（综合示例）。',
    inputSchema: { section: z.string().optional().describe('章节 key，见目录；不传返回目录') },
  }, call(({ section }: { section?: string }) => getAuthoringGuide(section)))

  server.registerTool('create_presentation', {
    description: '新建演示文稿，返回 docId、version、editUrl（给用户编辑的链接）和 viewUrl（只读链接）。可以只传 title 先建空文档再 add_slides，也可以一次带上全部 slides。完成后务必把 editUrl 发给用户。',
    inputSchema: {
      title: z.string().min(1).describe('演示文稿标题'),
      slides: z.array(z.looseObject({})).optional().describe('初始页面数组，结构见 get_authoring_guide 的 slide 章节'),
      theme: z.looseObject({}).optional().describe('主题（themeColors/fontColor/fontName/backgroundColor/outline/shadow），不传用默认主题'),
      viewportRatio: z.number().positive().optional().describe('页面宽高比，默认 0.5625（16:9）'),
    },
  }, call((args: { title: string, slides?: unknown[], theme?: Record<string, unknown>, viewportRatio?: number }) =>
    service.createDoc(ownerId, args as { title?: string, theme?: never, viewportRatio?: number, slides?: unknown }, 'agent', keyId)))

  server.registerTool('list_presentations', {
    description: '列出当前账号的全部演示文稿（id、标题、版本、页数、最近修改时间）。找已有文档的 docId 用它。',
  }, call(() => service.listDocs(ownerId)))

  server.registerTool('get_presentation', {
    description: '读取文档。默认 view="outline" 返回压缩大纲（每页 id、类型、各元素 id/类型/坐标/纯文本、未回复批注），省 token；需要完整元素数据时传 view="full"。返回当前 version，修改类操作和 get_changes 都以它为准。',
    inputSchema: {
      docId: docIdField,
      view: z.enum(['outline', 'full']).optional().describe('outline（默认）或 full 完整 JSON'),
    },
  }, call(({ docId, view }: { docId: string, view?: 'outline' | 'full' }) => {
    const { row, data } = docData(docId)
    if (view === 'full') {
      const links = docLinks(config, row)
      return { docId, version: row.version, view: 'full', document: data, editUrl: links.editUrl, viewUrl: links.viewUrl }
    }
    return { docId, version: row.version, view: 'outline', ...toOutline(data) }
  }))

  server.registerTool('get_slide', {
    description: '按 slideId 或 index（从 0 开始）取单页完整 JSON，修改某一页前用它看现有元素 id 和结构。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().optional().describe('页面 id（与 index 二选一）'),
      index: z.number().int().min(0).optional().describe('页码从 0 开始（与 slideId 二选一）'),
    },
  }, call(({ docId, slideId, index }: { docId: string, slideId?: string, index?: number }) => {
    const { row, data } = docData(docId)
    if (slideId === undefined && index === undefined) {
      throw AppError.validation('需要 slideId 或 index 之一')
    }
    const at = slideId !== undefined
      ? data.slides.findIndex(slide => slide.id === slideId)
      : index!
    if (at < 0 || at >= data.slides.length) {
      throw AppError.validation(
        slideId !== undefined
          ? `找不到页面 id=${slideId}，可用 get_presentation 查看页面列表`
          : `index=${index} 超出范围（共 ${data.slides.length} 页）`
      )
    }
    return { docId, version: row.version, index: at, slide: data.slides[at] }
  }))

  server.registerTool('add_slides', {
    description: '在文档末尾（或 index 指定位置）插入一个或多个新页面。页面结构见 get_authoring_guide 的 slide 章节。',
    inputSchema: {
      docId: docIdField,
      slides: z.array(z.looseObject({})).min(1).describe('要新增的页面数组'),
      index: z.number().int().min(0).optional().describe('插入位置（页码从 0 开始），不传追加到末尾'),
    },
  }, call(({ docId, slides, index }: { docId: string, slides: unknown[], index?: number }) =>
    runOps(docId, [{ op: 'addSlides', slides, ...(index !== undefined ? { index } : {}) } as Op])))

  server.registerTool('update_slide', {
    description: '浅合并修改单页除 elements 外的属性（背景、备注、类型、翻页动画等）。元素请用 add_elements / update_elements / delete_elements。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().describe('页面 id'),
      props: z.looseObject({}).describe('要合并的页面字段，如 background / remark / type / turningMode / sectionTag'),
    },
  }, call(({ docId, slideId, props }: { docId: string, slideId: string, props: Record<string, unknown> }) =>
    runOps(docId, [{ op: 'updateSlide', slideId, props } as Op])))

  server.registerTool('delete_slides', {
    description: '按 id 删除一个或多个页面。删除会同时清掉指向它们的链接等元素引用。',
    inputSchema: {
      docId: docIdField,
      slideIds: z.array(z.string()).min(1).describe('要删除的页面 id 数组'),
    },
  }, call(({ docId, slideIds }: { docId: string, slideIds: string[] }) =>
    runOps(docId, [{ op: 'deleteSlides', slideIds }])))

  server.registerTool('move_slide', {
    description: '把一页移动到 toIndex 位置（页码从 0 开始）。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().describe('页面 id'),
      toIndex: z.number().int().min(0).describe('目标位置，页码从 0 开始'),
    },
  }, call(({ docId, slideId, toIndex }: { docId: string, slideId: string, toIndex: number }) =>
    runOps(docId, [{ op: 'moveSlide', slideId, toIndex }])))

  server.registerTool('add_elements', {
    description: '向指定页面添加一个或多个元素（追加在顶层，index 可指定图层位置）。元素必填字段见 get_authoring_guide 对应章节。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().describe('目标页面 id'),
      elements: z.array(z.looseObject({})).min(1).describe('元素数组'),
      index: z.number().int().min(0).optional().describe('插入到元素列表的位置，不传追加到顶层'),
    },
  }, call(({ docId, slideId, elements, index }: { docId: string, slideId: string, elements: unknown[], index?: number }) =>
    runOps(docId, [{ op: 'addElements', slideId, elements, ...(index !== undefined ? { index } : {}) } as Op])))

  server.registerTool('update_elements', {
    description: '按元素 id 浅合并修改属性（坐标、尺寸、文本 content、样式等；不能改 id 和 type）。id 可在任意页，updates 一次可改多个元素。',
    inputSchema: {
      docId: docIdField,
      updates: z.array(z.looseObject({
        id: z.string().describe('元素 id'),
        props: z.looseObject({}).describe('要合并的字段'),
      })).min(1),
    },
  }, call(({ docId, updates }: { docId: string, updates: { id: string, props: Record<string, unknown> }[] }) =>
    runOps(docId, [{ op: 'updateElements', updates }])))

  server.registerTool('delete_elements', {
    description: '按元素 id 删除元素（可跨页）。引用它们的动画、线条连接会一并清理。',
    inputSchema: {
      docId: docIdField,
      ids: z.array(z.string()).min(1).describe('要删除的元素 id 数组'),
    },
  }, call(({ docId, ids }: { docId: string, ids: string[] }) =>
    runOps(docId, [{ op: 'deleteElements', ids }])))

  server.registerTool('batch_edit', {
    description: '一次提交多个原子操作，只产生一条修订：ops 每项形如 { op: 操作名, ...参数 }，操作名同各单步工具（addSlides/updateSlide/deleteSlides/moveSlide/addElements/updateElements/deleteElements/setTheme/setTitle/addNote/replyNote），按顺序执行，任一步失败整体回滚。',
    inputSchema: {
      docId: docIdField,
      ops: z.array(z.looseObject({ op: z.string() })).min(1).describe('原子操作数组'),
    },
  }, call(({ docId, ops }: { docId: string, ops: { op: string }[] }) => runOps(docId, ops as Op[])))

  server.registerTool('set_theme', {
    description: '浅合并修改文档主题（themeColors/fontColor/fontName/backgroundColor/outline/shadow），影响全部页面。',
    inputSchema: {
      docId: docIdField,
      theme: z.looseObject({}).describe('要合并的主题字段'),
    },
  }, call(({ docId, theme }: { docId: string, theme: Record<string, unknown> }) =>
    runOps(docId, [{ op: 'setTheme', theme } as Op])))

  server.registerTool('get_changes', {
    description: '查看 sinceVersion 之后的修订摘要（了解用户在网页端改了什么的主入口）。author 默认 "user" 只看用户的修改，传 "all" 包含你自己的修改。返回 currentVersion 和 changes 数组；changes 为空表示尚无新修改。把返回的 currentVersion 记下来作为下次的 sinceVersion。',
    inputSchema: {
      docId: docIdField,
      sinceVersion: z.number().int().min(0).describe('上次看到的 version，返回之后的修订'),
      author: z.enum(['user', 'all']).optional().describe('只看用户修改（默认）或全部修订'),
    },
  }, call(({ docId, sinceVersion, author }: { docId: string, sinceVersion: number, author?: 'user' | 'all' }) => {
    const { row } = ownDoc(docId)
    const changes = service.listRevisions(docId, sinceVersion)
      .filter(rev => author === 'all' || rev.author === 'user')
    if (!changes.length) {
      return { currentVersion: row.version, changes, message: '用户尚未修改' }
    }
    return { currentVersion: row.version, changes }
  }))

  server.registerTool('list_comments', {
    description: '列出各页的批注（含页码、关联元素 id、回复）。用户在网页上写批注等于给你下指令，处理完用 reply_comment 回复。默认 onlyUnreplied=true 只看还没回复的。',
    inputSchema: {
      docId: docIdField,
      onlyUnreplied: z.boolean().optional().describe('只返回未回复的批注（默认 true）'),
    },
  }, call(({ docId, onlyUnreplied }: { docId: string, onlyUnreplied?: boolean }) => {
    const { data } = docData(docId)
    const unreplied = onlyUnreplied ?? true
    return {
      slides: data.slides
        .map((slide, index) => ({
          index,
          slideId: slide.id,
          comments: (slide.notes ?? [])
            .filter(note => !unreplied || !(note.replies ?? []).length)
            .map(note => ({
              id: note.id,
              user: note.user,
              content: note.content,
              ...(note.elId ? { elId: note.elId } : {}),
              time: note.time,
              replies: note.replies ?? [],
            })),
        }))
        .filter(item => item.comments.length),
    }
  }))

  server.registerTool('add_comment', {
    description: '在指定页面写一条批注（显示为 Agent 留言），可用 elId 关联到某个元素。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().describe('页面 id'),
      content: z.string().min(1).describe('批注内容'),
      elId: z.string().optional().describe('关联的元素 id'),
    },
  }, call(({ docId, slideId, content, elId }: { docId: string, slideId: string, content: string, elId?: string }) =>
    runOps(docId, [{ op: 'addNote', slideId, content, ...(elId ? { elId } : {}) }])))

  server.registerTool('reply_comment', {
    description: '回复用户在网页端留的批注（显示为 Agent 的回复）。noteId 从 list_comments 或 get_presentation 大纲里取。',
    inputSchema: {
      docId: docIdField,
      slideId: z.string().describe('页面 id'),
      noteId: z.string().describe('批注 id'),
      content: z.string().min(1).describe('回复内容'),
    },
  }, call(({ docId, slideId, noteId, content }: { docId: string, slideId: string, noteId: string, content: string }) =>
    runOps(docId, [{ op: 'replyNote', slideId, noteId, content }])))

  server.registerTool('rotate_links', {
    description: '重新生成文档的编辑/只读链接，旧链接立即失效。需要给用户换新链接或吊销旧链接时用。',
    inputSchema: { docId: docIdField },
  }, call(({ docId }: { docId: string }) => {
    ownDoc(docId)
    return service.rotateLinks(docId)
  }))

  server.registerTool('delete_presentation', {
    description: '删除整个演示文稿（含修订历史），不可恢复。执行前确认用户确实要删。',
    inputSchema: { docId: docIdField },
  }, call(({ docId }: { docId: string }) => {
    ownDoc(docId)
    service.deleteDoc(docId)
    return { ok: true }
  }))

  server.registerTool('upload_image', {
    description: '把图片转存为站内资产，返回可写进 image 元素 src（或背景图、视频封面）的 /assets/... 地址。url 转存外链图片，base64 传图片内容（也接受 data:image/... 前缀）。仅支持 png/jpeg/gif/webp，内网地址会被拒绝。',
    inputSchema: {
      url: z.string().optional().describe('外链图片地址（http/https），与 base64 二选一'),
      base64: z.string().optional().describe('图片 base64（可带 data:image/... 前缀），与 url 二选一'),
    },
  }, call(async ({ url, base64 }: { url?: string, base64?: string }) => {
    if (base64) {
      const saved = dataUrlToAsset(db, config, ownerId, base64)
        ?? saveAsset(db, config, ownerId, Buffer.from(base64.replace(/\s/g, ''), 'base64'))
      return saved
    }
    if (url) {
      const buffer = await fetchRemoteAsset(url, config)
      return saveAsset(db, config, ownerId, buffer)
    }
    throw AppError.validation('需要 url 或 base64 之一')
  }))

  server.registerTool('render_slide', {
    description: '把指定页渲染成 PNG 截图并返回图片内容，用于导出前自检排版是否溢出/重叠。index 页码从 0 开始，width 为输出像素宽（默认 1000，建议 500~2000）。返回里附带可调用的 REST 截图地址。',
    inputSchema: {
      docId: docIdField,
      index: z.number().int().min(0).describe('页码，从 0 开始'),
      width: z.number().int().min(16).max(4000).optional().describe('输出图片宽度像素，默认 1000'),
    },
  }, async ({ docId, index, width }: { docId: string, index: number, width?: number }): Promise<TextResult> => {
    try {
      const { row, data } = docData(docId)
      if (index >= data.slides.length) {
        throw AppError.validation(`页码 ${index} 超出范围（共 ${data.slides.length} 页）`)
      }
      const w = width ?? 1000
      const png = await queue.run(() => renderSlideImage({ config }, row, index, w))
      return {
        content: [
          { type: 'image', data: png.toString('base64'), mimeType: 'image/png' },
          {
            type: 'text',
            text: JSON.stringify({
              docId,
              index,
              width: w,
              url: `${config.publicBaseUrl}/api/docs/${docId}/slides/${index}.png?width=${w}`,
            }, null, 2),
          },
        ],
      }
    }
    catch (err) {
      return fail(err)
    }
  })

  server.registerTool('export_presentation', {
    description: '导出文档为 pptx / pdf / png / json。slides 可传页码子集（从 0 开始）。计入每日导出配额；约 45 秒内完成直接返回 url，否则返回 pending + jobId，稍后用 get_export 轮询。多页 png 返回 zip 包。',
    inputSchema: {
      docId: docIdField,
      format: z.enum(EXPORT_FORMATS as [ExportFormat, ...ExportFormat[]]).describe('导出格式：pptx | pdf | png | json'),
      slides: z.array(z.number().int().min(0)).optional().describe('只导出这些页（页码从 0 开始），不传导出全部'),
    },
  }, call(async ({ docId, format, slides }: { docId: string, format: ExportFormat, slides?: number[] }) => {
    const { row, data } = docData(docId)
    const bad = slides?.find(i => !Number.isInteger(i) || i < 0 || i >= data.slides.length)
    if (bad !== undefined) {
      throw AppError.validation(`slides 包含非法页码 ${bad}（共 ${data.slides.length} 页）`)
    }
    const quota = exportQuotaFor(db, config, ownerId)
    if (exportsUsedToday(db, ownerId) >= quota) {
      throw AppError.quotaExceeded(`今日导出次数已达上限（${quota} 次/天）`)
    }
    const { job, settled } = submitExport({ db, config, queue }, row, { format, slides })
    const finished = await Promise.race([
      settled.then(() => true),
      new Promise<false>(resolve => setTimeout(() => resolve(false), config.exportSyncWaitMs)),
    ])
    if (!finished) return { status: 'pending', jobId: job.id }
    const latest = getExportJob(db, job.id)!
    return {
      status: latest.status,
      jobId: latest.id,
      ...(latest.file ? { url: `${config.publicBaseUrl}/exports/${latest.file}` } : {}),
      ...(latest.error ? { error: latest.error } : {}),
    }
  }))

  server.registerTool('get_export', {
    description: '查询导出任务状态：pending/running 时稍后重试，done 时返回下载 url（24h 内有效），failed 时返回 error。',
    inputSchema: { jobId: z.string().min(1).describe('export_presentation 返回的任务 id') },
  }, call(({ jobId }: { jobId: string }) => {
    const job = getExportJob(db, jobId)
    if (!job || job.owner_id !== ownerId) throw AppError.notFound('导出任务不存在')
    return {
      jobId: job.id,
      status: job.status,
      format: job.format,
      ...(job.file ? { url: `${config.publicBaseUrl}/exports/${job.file}` } : {}),
      ...(job.error ? { error: job.error } : {}),
    }
  }))

  return server
}

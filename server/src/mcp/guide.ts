import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AppError } from '../errors'

// get_authoring_guide 的内容来源：doc/AI_PPT_SCHEMA.md 按二级标题切段
// 运行时按候选路径读取：tsx/vitest 下位于 server/src/mcp，esbuild 打包后位于 server/dist，
// 两种布局回退到仓库根目录的 doc/ 都能找到；M5 Dockerfile 也会复制该文件
const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
const CANDIDATES = [
  resolve(MODULE_DIR, '../../../doc/AI_PPT_SCHEMA.md'),
  resolve(MODULE_DIR, '../../doc/AI_PPT_SCHEMA.md'),
  resolve(process.cwd(), 'doc/AI_PPT_SCHEMA.md'),
  resolve(process.cwd(), '../doc/AI_PPT_SCHEMA.md'),
]

interface GuideSection {
  key: string
  title: string
  content: string
}

// 二级标题 → 对外 section key；元素章节直接用反引号里的类型名
const H2_KEYS: Record<string, string> = {
  '坐标系与通用规则': 'general',
  '页面 Slide': 'slide',
  '综合示例数据': 'example',
}

// 三级标题里允许单独取用的子章节
const H3_KEYS: Record<string, string> = {
  '富文本内容约束': 'richtext',
  '可用字体': 'fonts',
  '页面坐标系': 'coords',
  '通用几何字段': 'geometry',
  '共享样式结构': 'styles',
}

function locateGuideFile(): string {
  for (const path of CANDIDATES) {
    if (existsSync(path)) return path
  }
  throw new Error('找不到 doc/AI_PPT_SCHEMA.md，请确认部署中包含该文件')
}

function backtickKey(title: string): string | undefined {
  const match = /`([a-z]+)`/i.exec(title)
  return match?.[1]
}

// 三级子章节内容：从标题行到下一个同级或更高级标题
function parseSections(markdown: string): Map<string, GuideSection> {
  const sections = new Map<string, GuideSection>()
  const lines = markdown.split('\n')
  const headings = lines
    .map((line, i) => ({ line, i, match: /^(#{2,3})\s+(.+)$/.exec(line) }))
    .filter(item => item.match)

  for (let i = 0; i < headings.length; i++) {
    const { i: lineIndex, match } = headings[i]
    const level = match![1].length
    const title = match![2].trim()
    const key = level === 2 ? (H2_KEYS[title] ?? backtickKey(title)) : H3_KEYS[title]
    if (!key || sections.has(key)) continue

    const end = headings
      .slice(i + 1)
      .find(item => item.match![1].length <= level)?.i ?? lines.length
    sections.set(key, { key, title, content: lines.slice(lineIndex, end).join('\n').trim() })
  }
  return sections
}

let cached: Map<string, GuideSection> | undefined

function sections(): Map<string, GuideSection> {
  cached ??= parseSections(readFileSync(locateGuideFile(), 'utf8'))
  return cached
}

// 不传 section 返回章节目录；传了返回对应章节 Markdown
export function getAuthoringGuide(section?: string): string {
  const all = sections()
  if (!section) {
    const list = [...all.values()].map(item => `- ${item.key}: ${item.title}`).join('\n')
    return `# PPTist 页面数据编写规范（AI_PPT_SCHEMA.md）\n\n用 get_authoring_guide(section) 取对应章节完整内容：\n\n${list}`
  }
  const found = all.get(section)
  if (!found) {
    throw AppError.validation(
      `未知的章节 "${section}"，可用章节: ${[...all.keys()].join(', ')}`
    )
  }
  return found.content
}

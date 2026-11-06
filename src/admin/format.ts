// 相对时间：刚刚 / N 分钟前 / N 小时前 / 昨天 / 日期
export function relativeTime(ms: number | null, now = Date.now()): string {
  if (ms === null) return '从未'
  const diff = now - ms
  if (diff < 0) return formatDate(ms)
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  const day = new Date(ms)
  const today = new Date(now)
  if (day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && today.getDate() - day.getDate() === 1) {
    return '昨天'
  }
  return formatDate(ms)
}

export function formatDate(ms: number | null): string {
  if (ms === null) return '—'
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function avatarColor(name: string): string {
  const palette = [
    ['#5B8DEF', '#3B6FE0'],
    ['#7C6CF0', '#5B4FE0'],
    ['#E8752A', '#C85A18'],
    ['#18A058', '#0E7C42'],
    ['#0E9BA8', '#0B7285'],
    ['#C2529B', '#9E3B7D'],
  ]
  let h = 0
  for (const c of name) h = (h * 31 + c.codePointAt(0)!) >>> 0
  const [a, b] = palette[h % palette.length]
  return `linear-gradient(145deg, ${a}, ${b})`
}

export function avatarLetter(name: string): string {
  return (name.trim()[0] ?? '?').toUpperCase()
}

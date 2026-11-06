import { h, type FunctionalComponent } from 'vue'

// 与原型一致的内联 SVG 图标（stroke 风格，currentColor）
const make = (inner: string, extra: Record<string, string> = {}): FunctionalComponent =>
  () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    innerHTML: inner,
    ...extra,
  })

export const IconBrand = make('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8"/><path d="M8 9h5"/><path d="M8 13h8"/>')
export const IconUsers = make('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>')
export const IconShield = make('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>')
export const IconPlus = make('<path d="M12 5v14"/><path d="M5 12h14"/>')
export const IconSearch = make('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>')
export const IconWarn = make('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>')
export const IconClose = make('<path d="M6 6l12 12"/><path d="M18 6L6 18"/>')
export const IconCopy = make('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>')
export const IconLogout = make('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>')
export const IconDots = () => h('svg', {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true',
  innerHTML: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
})

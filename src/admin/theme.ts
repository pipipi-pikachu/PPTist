import type { GlobalThemeOverrides } from 'naive-ui'

// 与原型一致的视觉系统：暖白画布 / 品牌橙 / 成功绿 / 危险红
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#E8752A',
    primaryColorHover: '#F08A44',
    primaryColorPressed: '#C85A18',
    primaryColorSuppl: '#E8752A',
    successColor: '#18A058',
    successColorHover: '#2BB56A',
    successColorPressed: '#128A4B',
    errorColor: '#D03050',
    errorColorHover: '#DA4866',
    errorColorPressed: '#B02742',
    warningColor: '#E8752A',
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    bodyColor: '#F7F8FA',
    cardColor: '#FFFFFF',
    borderColor: '#E6E8EC',
    textColorBase: '#1A1D21',
    textColor1: '#1A1D21',
    textColor2: '#3C4149',
    textColor3: '#6B7280',
    fontSize: '14px',
  },
  Button: {
    fontWeight: '600',
    rippleColor: '#E8752A',
  },
  Input: {
    borderRadius: '8px',
    heightMedium: '34px',
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '8px',
        heightMedium: '34px',
      },
    },
  },
  Tag: {
    borderRadius: '999px',
    fontWeightStrong: '600',
  },
  Message: {
    borderRadius: '10px',
  },
}

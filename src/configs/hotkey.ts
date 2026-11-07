import { t } from '@/i18n'
export const enum KEYS {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  O = 'O',
  R = 'R',
  T = 'T',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5',
}

interface HotkeyItem {
  type: string
  children: {
    label: string
    value?: string
  }[] 
}

export const HOTKEY_DOC: HotkeyItem[] = [
  {
    type: t('通用'),
    children: [
      { label: t('剪切'), value: 'Ctrl + X' },
      { label: t('复制'), value: 'Ctrl + C' },
      { label: t('粘贴'), value: 'Ctrl + V' },
      { label: t('粘贴为纯文本'), value: 'Ctrl + Shift + V' },
      { label: t('快速复制粘贴'), value: 'Ctrl + D' },
      { label: t('全选'), value: 'Ctrl + A' },
      { label: t('撤销'), value: 'Ctrl + Z' },
      { label: t('恢复'), value: 'Ctrl + Y' },
      { label: t('删除'), value: 'Delete / Backspace' },
      { label: t('多选'), value: t('按住 Ctrl 或 Shift') },
      { label: t('打开搜索替换'), value: 'Ctrl + F' },
      { label: t('打印'), value: 'Ctrl + P' },
      { label: t('关闭弹窗'), value: 'ESC' },
    ],
  },
  {
    type: t('幻灯片放映'),
    children: [
      { label: t('从头开始放映幻灯片'), value: 'F5' },
      { label: t('从当前开始放映幻灯片'), value: 'Shift + F5' },
      { label: t('切换上一页'), value: '↑ / ← / PgUp' },
      { label: t('切换下一页'), value: '↓ / → / PgDown' },
      { label: t('切换下一页'), value: 'Enter / Space' },
      { label: t('退出放映'), value: 'ESC' },
    ],
  },
  {
    type: t('幻灯片编辑'),
    children: [
      { label: t('新建幻灯片'), value: 'Enter' },
      { label: t('移动画布'), value: t('Space + 鼠标拖拽') },
      { label: t('缩放画布'), value: t('Ctrl + 鼠标滚轮') },
      { label: t('放大画布'), value: 'Ctrl + =' },
      { label: t('缩小画布'), value: 'Ctrl + -' },
      { label: t('使画布适应当前屏幕'), value: 'Ctrl + 0' },
      { label: t('上一页（未选中元素）'), value: '↑' },
      { label: t('下一页（未选中元素）'), value: '↓' },
      { label: t('上一页'), value: t('鼠标上滚 / PgUp') },
      { label: t('下一页'), value: t('鼠标下滚 / PgDown') },
      { label: t('快速创建文本'), value: t('双击空白处 / T') },
      { label: t('快速创建矩形'), value: 'R' },
      { label: t('快速创建圆形'), value: 'O' },
      { label: t('快速创建线条'), value: 'L' },
      { label: t('退出绘制状态'), value: t('鼠标右键') },
    ],
  },
  {
    type: t('元素操作'),
    children: [
      { label: t('移动'), value: '↑ / ← / ↓ / →' },
      { label: t('锁定'), value: 'Ctrl + L' },
      { label: t('组合'), value: 'Ctrl + G' },
      { label: t('取消组合'), value: 'Ctrl + Shift + G' },
      { label: t('置顶层'), value: 'Alt + F' },
      { label: t('置底层'), value: 'Alt + B' },
      { label: t('锁定宽高比例'), value: t('按住 Ctrl 或 Shift') },
      { label: t('快速复制'), value: t('按住 Ctrl + 拖拽') },
      { label: t('创建水平 / 垂直线条'), value: t('按住 Ctrl 或 Shift') },
      { label: t('切换焦点元素'), value: 'Tab' },
      { label: t('确认图片裁剪'), value: 'Enter' },
      { label: t('完成自定义形状绘制'), value: 'Enter' },
    ],
  },
  {
    type: t('表格编辑'),
    children: [
      { label: t('聚焦到下一个单元格'), value: 'Tab' },
      { label: t('移动焦点单元格'), value: '↑ / ← / ↓ / →' },
      { label: t('在上方插入一行'), value: 'Ctrl + ↑' },
      { label: t('在下方插入一行'), value: 'Ctrl + ↓' },
      { label: t('在左侧插入一列'), value: 'Ctrl + ←' },
      { label: t('在右侧插入一列'), value: 'Ctrl + →' },
    ],
  },
  {
    type: t('图表数据编辑'),
    children: [
      { label: t('聚焦到下一行'), value: 'Enter' },
    ],
  },
  {
    type: t('文本编辑'),
    children: [
      { label: t('加粗'), value: 'Ctrl + B' },
      { label: t('斜体'), value: 'Ctrl + I' },
      { label: t('下划线'), value: 'Ctrl + U' },
      { label: t('行内代码'), value: 'Ctrl + E' },
      { label: t('上角标'), value: 'Ctrl + ;' },
      { label: t('下角标'), value: `Ctrl + '` },
      { label: t('选中段落'), value: `ESC` },
    ],
  },
  {
    type: t('其他快捷操作'),
    children: [
      { label: t('添加图片 - 粘贴来自系统剪贴板的图片') },
      { label: t('添加图片 - 将本地图片拖拽到画布中') },
      { label: t('添加图片 - 在画布中粘贴SVG代码') },
      { label: t('添加图片 - 粘贴来自 pexels 的图片链接') },
      { label: t('添加文本 - 粘贴来自系统剪贴板的文字') },
      { label: t('添加文本 - 将外部选中文字拖拽到画布中') },
      { label: t('文本编辑 - 支持 markdown 语法创建列表和引用') },
    ],
  },
]
import { Slide, SlideTheme } from '@/types/slides'
import { CreatingElement } from '@/types/edit'
import { ToolbarState } from '@/types/toolbar'
import { slides } from '@/mocks/slides'
import { theme } from '@/mocks/theme'
import { SYS_FONTS } from '@/configs/font'

export interface State {
  activeElementIdList: string[];
  handleElementId: string;
  activeGroupElementId: string;
  canvasPercentage: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  showGridLines: boolean;
  creatingElement: CreatingElement | null;
  availableFonts: typeof SYS_FONTS;
  toolbarState: ToolbarState;
  theme: SlideTheme;
  viewportRatio: number;
  slides: Slide[];
  slideIndex: number;
  selectedSlidesIndex: number[];
  snapshotCursor: number;
  snapshotLength: number;
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
  screening: boolean;
  clipingImageElementId: string;
}

export const state: State = {
  activeElementIdList: [], // 被选中的元素ID集合，包含 handleElementId
  handleElementId: '', // 正在操作的元素ID
  activeGroupElementId: '', // 组合元素成员中，被选中可独立操作的元素ID
  canvasPercentage: 90, // 画布可视区域百分比
  canvasScale: 1, // 画布缩放比例（基于宽度1000px）
  thumbnailsFocus: false, // 左侧导航缩略图区域聚焦
  editorAreaFocus: false, //  编辑区域聚焦
  disableHotkeys: false, // 禁用快捷键
  showGridLines: false, // 显示网格线
  creatingElement: null, // 正在插入的元素信息，需要绘制插入的元素需要（文字、形状、线条）
  availableFonts: [], // 当前环境可用字体
  toolbarState: 'slideStyle', // 右侧工具栏状态
  viewportRatio: 0.5625, // 可是区域比例，默认16:9
  theme: theme, // 主题样式
  slides: slides, // 幻灯片页面数据
  slideIndex: 0, // 当前页面索引
  selectedSlidesIndex: [], // 当前被选中的页面索引集合
  snapshotCursor: -1, // 历史快照指针
  snapshotLength: 0, // 历史快照长度
  ctrlKeyState: false, // ctrl键按下状态
  shiftKeyState: false, // shift键按下状态
  screening: false, // 是否进入放映状态
  clipingImageElementId: '', // 当前正在裁剪的图片ID  
}
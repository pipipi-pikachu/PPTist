import { Slide, SlideTheme } from '@/types/slides'
import { CreatingElement } from '@/types/edit'
import { ToolbarState } from '@/types/toolbar'
import { slides } from '@/mocks/index'
import { SYS_FONTS } from '@/configs/font'

export interface State {
  activeElementIdList: string[];
  handleElementId: string;
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
  activeElementIdList: [],
  handleElementId: '',
  canvasPercentage: 90,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  disableHotkeys: false,
  showGridLines: false,
  creatingElement: null,
  availableFonts: [],
  toolbarState: 'slideStyle',
  theme: {
    themeColor: '#d14424',
    fontColor: '#333',
    fontName: '微软雅黑',
    backgroundColor: '#fff',
  },
  viewportRatio: 0.5625,
  slides: slides,
  slideIndex: 0,
  selectedSlidesIndex: [],
  snapshotCursor: -1,
  snapshotLength: 0,
  ctrlKeyState: false,
  shiftKeyState: false,
  screening: false,
  clipingImageElementId: '',
}
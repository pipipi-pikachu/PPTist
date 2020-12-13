import { Slide } from '@/types/slides'
import { slides } from '@/mocks/index'

export type SaveState = 'complete' | 'pending'

export type State = {
  activeElementIdList: string[];
  handleElementId: string;
  isShowGridLines: boolean;
  editorAreaShowScale: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  availableFonts: string[];
  saveState: SaveState;
  slides: Slide[];
  slideIndex: number;
  cursor: number;
  historyRecordLength: number;
}

export const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  isShowGridLines: false,
  editorAreaShowScale: 85,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  availableFonts: [],
  saveState: 'complete',
  slides: slides,
  slideIndex: 0,
  cursor: -1,
  historyRecordLength: 0,
}
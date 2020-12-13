import { Slide } from '@/types/slides'
import { slides } from '@/mocks/index'
import { FontName } from '@/configs/fontName'

export type SaveState = 'complete' | 'pending'

export type State = {
  activeElementIdList: string[];
  handleElementId: string;
  editorAreaShowScale: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  availableFonts: FontName[];
  saveState: SaveState;
  slides: Slide[];
  slideIndex: number;
  cursor: number;
  historyRecordLength: number;
}

export const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  editorAreaShowScale: 85,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  disableHotkeys: false,
  availableFonts: [],
  saveState: 'complete',
  slides: slides,
  slideIndex: 0,
  cursor: -1,
  historyRecordLength: 0,
}
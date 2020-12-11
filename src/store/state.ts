import { Slide } from '@/types/slides'

export type State = {
  activeElementIdList: string[];
  handleElementId: string;
  isShowGridLines: boolean;
  editorAreaShowScale: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  availableFonts: string[];
  slides: Slide[],
  slideIndex: number,
}

export const state: State = {
  activeElementIdList: [],
  handleElementId: '',
  isShowGridLines: false,
  editorAreaShowScale: 80,
  canvasScale: 1,
  thumbnailsFocus: false,
  editorAreaFocus: false,
  availableFonts: [],
  slides: [],
  slideIndex: 0,
}
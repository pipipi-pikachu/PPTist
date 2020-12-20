export enum MutationTypes {

  // editor
  SET_ACTIVE_ELEMENT_ID_LIST = 'setActiveElementIdList',
  SET_HANDLE_ELEMENT_ID = 'setHandleElementId',
  SET_EDITOR_AREA_SHOW_SCALE = 'setEditorAreaShowScale',
  SET_THUMBNAILS_FOCUS = 'setThumbnailsFocus',
  SET_EDITORAREA_FOCUS = 'setEditorAreaFocus',
  SET_DISABLE_HOTKEYS_STATE = 'setDisableHotkeysState',
  SET_AVAILABLE_FONTS = 'setAvailableFonts',

  // slides
  SET_SLIDES = 'setSlides',
  ADD_SLIDE = 'addSlide',
  UPDATE_SLIDE = 'updateSlide',
  DELETE_SLIDE = 'deleteSlide',
  UPDATE_SLIDE_INDEX = 'updateSlideIndex',
  ADD_ELEMENT = 'addElement',
  UPDATE_ELEMENT = 'updateElement',

  // history
  SET_CURSOR = 'setCursor',
  UNDO = 'undo',
  REDO = 'redo',
  SET_HISTORY_RECORD_LENGTH = 'setHistoryRecordLength',

  // keyboard
  SET_CTRL_KEY_STATE = 'setCtrlKeyState',
  SET_SHIFT_KEY_STATE = 'setShiftKeyState',
}
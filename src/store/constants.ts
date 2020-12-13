export enum MutationTypes {

  // editor
  SET_ACTIVE_ELEMENT_ID_LIST = 'setActiveElementIdList',
  SET_HANDLE_ELEMENT_ID = 'setHandleElementId',
  SET_EDITOR_AREA_SHOW_SCALE = 'setEditorAreaShowScale',
  SET_CANVAS_SCALE = 'setCanvasScale',
  TOGGLE_SHOW_GRID_LINES = 'toggleShowGridLines',
  SET_THUMBNAILS_FOCUS = 'setThumbnailsFocus',
  SET_EDITORAREA_FOCUS = 'setEditorAreaFocus',
  SET_AVAILABLE_FONTS = 'setAvailableFonts',
  SET_SAVE_STATE = 'setSaveState',

  // slides
  SET_SLIDES = 'setSlides',
  ADD_SLIDES = 'addSlides',
  SET_SLIDE = 'setSlide',
  ADD_SLIDE = 'addSlide',
  UPDATE_SLIDE = 'updateSlide',
  DELETE_SLIDE = 'deleteSlide',
  UPDATE_SLIDE_INDEX = 'updateSlideIndex',
  ADD_ELEMENTS = 'addElements',
  UPDATE_ELEMENT = 'updateElement',

  // history
  SET_CURSOR = 'setCursor',
  UNDO = 'undo',
  REDO = 'redo',
  SET_HISTORY_RECORD_LENGTH = 'setHistoryRecordLength',
}
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

  // slides
  SET_SLIDES = 'setSlides',
  SET_SLIDE = 'setSlide',
  ADD_SLIDE = 'addSlide',
  ADD_SLIDES = 'addSlides',
  UPDATE_SLIDE = 'updateSlide',
  DELETE_SLIDE = 'deleteSlide',
  UPDATE_SLIDE_INDEX = 'updateSlideIndex',
  ADD_ELEMENTS = 'addElements',
  UPDATE_ELEMENT = 'updateElement',
  UPDATE_ELEMENTS = 'updateElements',

  // history
  SET_CURSOR = 'setCursor',
  UNDO = 'undo',
  REDO = 'redo',
  SET_HISTORY_RECORD_LENGTH = 'setHistoryRecordLength',
}
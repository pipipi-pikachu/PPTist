export enum MutationTypes {

  // editor
  SET_ACTIVE_ELEMENT_ID_LIST = 'setActiveElementIdList',
  SET_HANDLE_ELEMENT_ID = 'setHandleElementId',
  SET_CANVAS_PERCENTAGE = 'setCanvasPercentage',
  SET_CANVAS_SCALE = 'setCanvasScale',
  SET_THUMBNAILS_FOCUS = 'setThumbnailsFocus',
  SET_EDITORAREA_FOCUS = 'setEditorAreaFocus',
  SET_DISABLE_HOTKEYS_STATE = 'setDisableHotkeysState',
  SET_GRID_LINES_STATE = 'setGridLinesState',
  SET_CREATING_ELEMENT = 'setCreatingElement',
  SET_AVAILABLE_FONTS = 'setAvailableFonts',
  SET_TOOLBAR_STATE = 'setToolbarState',
  SET_CLIPING_IMAGE_ELEMENT_ID = 'setClipingImageElementId',

  // slides
  SET_THEME = 'setTheme',
  SET_SLIDES = 'setSlides',
  ADD_SLIDE = 'addSlide',
  UPDATE_SLIDE = 'updateSlide',
  DELETE_SLIDE = 'deleteSlide',
  UPDATE_SLIDE_INDEX = 'updateSlideIndex',
  ADD_ELEMENT = 'addElement',
  UPDATE_ELEMENT = 'updateElement',
  REMOVE_ELEMENT_PROPS = 'removeElementProps',

  // snapshot
  SET_SNAPSHOT_CURSOR = 'setSnapshotCursor',
  SET_SNAPSHOT_LENGTH = 'setSnapshotLength',

  // keyboard
  SET_CTRL_KEY_STATE = 'setCtrlKeyState',
  SET_SHIFT_KEY_STATE = 'setShiftKeyState',

  // screen
  SET_SCREENING = 'setScreening',
}

export enum ActionTypes {
  INIT_SNAPSHOT_DATABASE = 'initSnapshotDatabase',
  ADD_SNAPSHOT = 'addSnapshot',
  UN_DO = 'undo',
  RE_DO = 'redo',
}
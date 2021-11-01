// https://iconpark.bytedance.com/official

import { App } from 'vue'
import {
  PlayOne,
  Lock,
  Unlock,
  Ppt,
  Format,
  Picture,
  FullScreen,
  List,
  OrderedList,
  Helpcenter,
  FlipVertically,
  FlipHorizontally,
  FontSize,
  Code,
  TextBold,
  TextItalic,
  TextUnderline,
  Strikethrough,
  Edit,
  Quote,
  BackgroundColor,
  Group,
  Ungroup,
  Back,
  Next,
  Fullwidth,
  AlignTop,
  AlignLeft,
  AlignRight,
  AlignBottom,
  AlignVertically,
  AlignHorizontally,
  BringToFront,
  SendToBack,
  AlignTextLeft,
  AlignTextRight,
  AlignTextCenter,
  RowHeight,
  Write,
  InsertTable,
  AddText,
  Fill,
  Tailoring,
  Effects,
  ColorFilter,
  Down,
  Plus,
  Minus,
  Connection,
  BringToFrontOne,
  SentToBack,
  Github,
  ChartProportion,
  ChartHistogram,
  ChartLine,
  ChartPie,
  Text,
  Rotate,
  LeftTwo,
  RightTwo,
  Platte,
  UpOne,
  DownOne,
  Close,
  CloseSmall,
  Undo,
  Transform,
  Click,
  Theme,
  ArrowCircleLeft,
  GraphicDesign,
  Logout,
  Erase,
  Clear,
  FolderClose,
  AlignTextTopOne,
  AlignTextBottomOne,
  AlignTextMiddleOne,
  Pause,
  VolumeMute,
  VolumeNotice,
  VolumeSmall,
  VideoTwo,
  Formula,
} from '@icon-park/vue-next'

export default {
  install(app: App) {
    // 插入元素
    app.component('IconFontSize', FontSize)
    app.component('IconPicture', Picture)
    app.component('IconGraphicDesign', GraphicDesign)
    app.component('IconConnection', Connection)
    app.component('IconChartProportion', ChartProportion)
    app.component('IconInsertTable', InsertTable)
    app.component('IconVideoTwo', VideoTwo)
    app.component('IconFormula', Formula)

    // 锁定与解锁
    app.component('IconLock', Lock)
    app.component('IconUnlock', Unlock)

    // 全屏
    app.component('IconFullScreen', FullScreen)

    // 撤销重做
    app.component('IconBack', Back)
    app.component('IconNext', Next)    
    
    // 对齐
    app.component('IconAlignTop', AlignTop)
    app.component('IconAlignLeft', AlignLeft)
    app.component('IconAlignRight', AlignRight)
    app.component('IconAlignBottom', AlignBottom)
    app.component('IconAlignVertically', AlignVertically)
    app.component('IconAlignHorizontally', AlignHorizontally)

    // 层级
    app.component('IconBringToFront', BringToFront)
    app.component('IconSentToBack', SentToBack)
    app.component('IconBringToFrontOne', BringToFrontOne)
    app.component('IconSendToBack', SendToBack)

    // 组合
    app.component('IconGroup', Group)
    app.component('IconUngroup', Ungroup)

    // 通用元素编辑
    app.component('IconFill', Fill)
    app.component('IconBackgroundColor', BackgroundColor)
    app.component('IconPlatte', Platte)
    
    // 图片编辑
    app.component('IconTailoring', Tailoring)
    app.component('IconColorFilter', ColorFilter)
    app.component('IconFlipVertically', FlipVertically)
    app.component('IconFlipHorizontally', FlipHorizontally)

    // 文字编辑
    app.component('IconText', Text)
    app.component('IconAddText', AddText)
    app.component('IconAlignTextLeft', AlignTextLeft)
    app.component('IconAlignTextRight', AlignTextRight)
    app.component('IconAlignTextCenter', AlignTextCenter)
    app.component('IconRowHeight', RowHeight)
    app.component('IconFullwidth', Fullwidth)
    app.component('IconCode', Code)
    app.component('IconTextBold', TextBold)
    app.component('IconTextItalic', TextItalic)
    app.component('IconTextUnderline', TextUnderline)
    app.component('IconStrikethrough', Strikethrough)
    app.component('IconQuote', Quote)
    app.component('IconList', List)
    app.component('IconOrderedList', OrderedList)
    app.component('IconUpOne', UpOne)
    app.component('IconDownOne', DownOne)
    app.component('IconFormat', Format)
    app.component('IconAlignTextTopOne', AlignTextTopOne)
    app.component('IconAlignTextBottomOne', AlignTextBottomOne)
    app.component('IconAlignTextMiddleOne', AlignTextMiddleOne)

    // 箭头与符号
    app.component('IconDown', Down)
    app.component('IconLeftTwo', LeftTwo)
    app.component('IconRightTwo', RightTwo)
    app.component('IconPlus', Plus)
    app.component('IconMinus', Minus)
    app.component('IconClose', Close)
    app.component('IconCloseSmall', CloseSmall)
    
    // 图表
    app.component('IconChartHistogram', ChartHistogram)
    app.component('IconChartLine', ChartLine)
    app.component('IconChartPie', ChartPie)

    // 其他
    app.component('IconPlayOne', PlayOne)
    app.component('IconPpt', Ppt)
    app.component('IconHelpcenter', Helpcenter)
    app.component('IconGithub', Github)
    app.component('IconWrite', Write)
    app.component('IconErase', Erase)
    app.component('IconEffects', Effects)
    app.component('IconRotate', Rotate)
    app.component('IconEdit', Edit)
    app.component('IconUndo', Undo)
    app.component('IconTransform', Transform)
    app.component('IconClick', Click)
    app.component('IconTheme', Theme)
    app.component('IconArrowCircleLeft', ArrowCircleLeft)
    app.component('IconLogout', Logout)
    app.component('IconClear', Clear)
    app.component('IconFolderClose', FolderClose)

    // 视频播放器
    app.component('IconPause', Pause)
    app.component('IconVolumeMute', VolumeMute)
    app.component('IconVolumeNotice', VolumeNotice)
    app.component('IconVolumeSmall', VolumeSmall)
  }
}
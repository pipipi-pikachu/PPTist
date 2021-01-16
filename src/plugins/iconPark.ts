import { App } from 'vue'
import {
  Home,
  PlayOne,
  Lock,
  Unlock,
  Search,
  Delete,
  Slide,
  SettingOne,
  Clear,
  Format,
  Picture,
  FullScreen,
  OffScreen,
  LinkOne,
  List,
  OrderedList,
  Drag,
  Formula,
  Helpcenter,
  SplitCells,
  MergeCells,
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
  EnterTheKeyboard,
  Copy,
  Clipboard,
  Find,
  BackgroundColor,
  Group,
  Ungroup,
  FullSelection,
  ClearFormat,
  Back,
  Next,
  Fullwidth,
  GridFour,
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
  More,
  Write,
  InsertTable,
  CuttingOne,
  AddThree,
  AddText,
  Fill,
  Tailoring,
  Newlybuild,
  Effects,
  ColorFilter,
  Up,
  Down,
  Left,
  Right,
  Plus,
  Minus,
  Check,
  Close,
  Connection,
  BringToFrontOne,
  SentToBack,
  Github,
  ChartRing,
  ChartLine,
  ChartHistogramOne,
  ChartHistogram,
  ChartProportion,
  ChartScatter,
  PentagonOne,
  PageTemplate,
  Text,
  Rotate,
  LeftC,
  RightC,
  Platte,
  UpOne,
  DownOne,
} from '@icon-park/vue-next'

export default {
  install(app: App) {
    // 插入元素
    app.component('IconFontSize', FontSize)
    app.component('IconPicture', Picture)
    app.component('IconPentagonOne', PentagonOne)
    app.component('IconConnection', Connection)
    app.component('IconInsertTable', InsertTable)
    app.component('IconFormula', Formula)

    // 剪贴板
    app.component('IconCopy', Copy)
    app.component('IconClipboard', Clipboard)
    app.component('IconCuttingOne', CuttingOne)

    // 锁定与解锁
    app.component('IconLock', Lock)
    app.component('IconUnlock', Unlock)

    // 全屏
    app.component('IconFullScreen', FullScreen)
    app.component('IconOffScreen', OffScreen)

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

    // 表格编辑
    app.component('IconSplitCells', SplitCells)
    app.component('IconMergeCells', MergeCells)
    
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
    app.component('IconEdit', Edit)
    app.component('IconQuote', Quote)
    app.component('IconList', List)
    app.component('IconOrderedList', OrderedList)
    app.component('IconUpOne', UpOne)
    app.component('IconDownOne', DownOne)
    app.component('IconFormat', Format)

    // 箭头与符号
    app.component('IconUp', Up)
    app.component('IconDown', Down)
    app.component('IconLeft', Left)
    app.component('IconRight', Right)
    app.component('IconLeftC', LeftC)
    app.component('IconRightC', RightC)
    app.component('IconPlus', Plus)
    app.component('IconMinus', Minus)
    app.component('IconCheck', Check)
    app.component('IconClose', Close)
    
    // 图表
    app.component('IconChartRing', ChartRing)
    app.component('IconChartLine', ChartLine)
    app.component('IconChartHistogramOne', ChartHistogramOne)
    app.component('IconChartHistogram', ChartHistogram)
    app.component('IconChartProportion', ChartProportion)
    app.component('IconChartScatter', ChartScatter)

    // 其他
    app.component('IconHome', Home)
    app.component('IconPlayOne', PlayOne)
    app.component('IconSearch', Search)
    app.component('IconDelete', Delete)
    app.component('IconSlide', Slide)
    app.component('IconSettingOne', SettingOne)
    app.component('IconClear', Clear)
    app.component('IconLinkOne', LinkOne)
    app.component('IconDrag', Drag)
    app.component('IconHelpcenter', Helpcenter)
    app.component('IconEnterTheKeyboard', EnterTheKeyboard)
    app.component('IconFind', Find)
    app.component('IconFullSelection', FullSelection)
    app.component('IconClearFormat', ClearFormat)
    app.component('IconGridFour', GridFour)
    app.component('IconPageTemplate', PageTemplate)
    app.component('IconGithub', Github)
    app.component('IconMore', More)
    app.component('IconWrite', Write)
    app.component('IconAddThree', AddThree)
    app.component('IconNewlybuild', Newlybuild)
    app.component('IconEffects', Effects)
    app.component('IconRotate', Rotate)
  }
}
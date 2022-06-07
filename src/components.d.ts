import FileInput from '@/components/FileInput.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

import {
  PlayOne,
  FullScreenPlay,
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
  ChartHistogramOne,
  ChartLineArea,
  ChartRing,
  ChartScatter,
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
  LinkOne,
  FullScreenOne,
  OffScreenOne,
  Power,
  ListView,
  Magic,
  HighLight,
  Share,
  IndentLeft,
  IndentRight,
  VerticalSpacingBetweenItems,
  Copy,
  Delete,
  Square,
  Round,
} from '@icon-park/vue-next'

declare module 'vue' {
  export interface GlobalComponents {

    // antd 组件
    InputNumber: typeof import('ant-design-vue')['InputNumber'];
    Divider: typeof import('ant-design-vue')['Divider'];
    Button: typeof import('ant-design-vue')['Button'];
    ButtonGroup: typeof import('ant-design-vue')['Button']['Group'];
    Tooltip: typeof import('ant-design-vue')['Tooltip'];
    Popover: typeof import('ant-design-vue')['Popover'];
    Slider: typeof import('ant-design-vue')['Slider'];
    Select: typeof import('ant-design-vue')['Select'];
    SelectOption: typeof import('ant-design-vue')['Select']['Option'];
    SelectOptGroup: typeof import('ant-design-vue')['Select']['OptGroup'];
    Switch: typeof import('ant-design-vue')['Switch'];
    Radio: typeof import('ant-design-vue')['Radio'];
    RadioGroup: typeof import('ant-design-vue')['Radio']['Group'];
    RadioButton: typeof import('ant-design-vue')['Radio']['Button'];
    Input: typeof import('ant-design-vue')['Input'];
    InputGroup: typeof import('ant-design-vue')['Input']['Group'];
    TextArea: typeof import('ant-design-vue')['Input']['TextArea'];
    Modal: typeof import('ant-design-vue')['Modal'];
    Dropdown: typeof import('ant-design-vue')['Dropdown'];
    Menu: typeof import('ant-design-vue')['Menu'];
    MenuItem: typeof import('ant-design-vue')['Menu']['Item'];
    Checkbox: typeof import('ant-design-vue')['Checkbox'];
    Drawer: typeof import('ant-design-vue')['Drawer'];
    Spin: typeof import('ant-design-vue')['Spin'];

    // 自定义组件
    FileInput: typeof FileInput;
    CheckboxButton: typeof CheckboxButton;
    CheckboxButtonGroup: typeof CheckboxButtonGroup;
    ColorPicker: typeof ColorPicker;
    FullscreenSpin: typeof FullscreenSpin;

    // IconPark 图标组件
    IconPlayOne: typeof PlayOne;
    IconFullScreenPlay: typeof FullScreenPlay;
    IconLock: typeof Lock;
    IconUnlock: typeof Unlock;
    IconPpt: typeof Ppt;
    IconFormat: typeof Format;
    IconPicture: typeof Picture;
    IconFullScreen: typeof FullScreen;
    IconList: typeof List;
    IconOrderedList: typeof OrderedList;
    IconHelpcenter: typeof Helpcenter;
    IconFlipVertically: typeof FlipVertically;
    IconFlipHorizontally: typeof FlipHorizontally;
    IconFontSize: typeof FontSize;
    IconCode: typeof Code;
    IconTextBold: typeof TextBold;
    IconTextItalic: typeof TextItalic;
    IconTextUnderline: typeof TextUnderline;
    IconStrikethrough: typeof Strikethrough;
    IconEdit: typeof Edit;
    IconQuote: typeof Quote;
    IconBackgroundColor: typeof BackgroundColor;
    IconGroup: typeof Group;
    IconUngroup: typeof Ungroup;
    IconBack: typeof Back;
    IconNext: typeof Next;
    IconFullwidth: typeof Fullwidth;
    IconAlignTop: typeof AlignTop;
    IconAlignLeft: typeof AlignLeft;
    IconAlignRight: typeof AlignRight;
    IconAlignBottom: typeof AlignBottom;
    IconAlignVertically: typeof AlignVertically;
    IconAlignHorizontally: typeof AlignHorizontally;
    IconBringToFront: typeof BringToFront;
    IconSendToBack: typeof SendToBack;
    IconAlignTextLeft: typeof AlignTextLeft;
    IconAlignTextRight: typeof AlignTextRight;
    IconAlignTextCenter: typeof AlignTextCenter;
    IconRowHeight: typeof RowHeight;
    IconWrite: typeof Write;
    IconInsertTable: typeof InsertTable;
    IconAddText: typeof AddText;
    IconFill: typeof Fill;
    IconTailoring: typeof Tailoring;
    IconEffects: typeof Effects;
    IconColorFilter: typeof ColorFilter;
    IconDown: typeof Down;
    IconPlus: typeof Plus;
    IconMinus: typeof Minus;
    IconConnection: typeof Connection;
    IconBringToFrontOne: typeof BringToFrontOne;
    IconSentToBack: typeof SentToBack;
    IconGithub: typeof Github;
    IconChartProportion: typeof ChartProportion;
    IconChartHistogram: typeof ChartHistogram;
    IconChartHistogramOne: typeof ChartHistogramOne;
    IconChartLineArea: typeof ChartLineArea;
    IconChartRing: typeof ChartRing;
    IconChartScatter: typeof ChartScatter;
    IconChartLine: typeof ChartLine;
    IconChartPie: typeof ChartPie;
    IconText: typeof Text;
    IconRotate: typeof Rotate;
    IconLeftTwo: typeof LeftTwo;
    IconRightTwo: typeof RightTwo;
    IconPlatte: typeof Platte;
    IconUpOne: typeof UpOne;
    IconDownOne: typeof DownOne;
    IconClose: typeof Close;
    IconCloseSmall: typeof CloseSmall;
    IconUndo: typeof Undo;
    IconTransform: typeof Transform;
    IconClick: typeof Click;
    IconTheme: typeof Theme;
    IconArrowCircleLeft: typeof ArrowCircleLeft;
    IconGraphicDesign: typeof GraphicDesign;
    IconLogout: typeof Logout;
    IconErase: typeof Erase;
    IconClear: typeof Clear;
    IconFolderClose: typeof FolderClose;
    IconAlignTextTopOne: typeof AlignTextTopOne;
    IconAlignTextBottomOne: typeof AlignTextBottomOne;
    IconAlignTextMiddleOne: typeof AlignTextMiddleOne;
    IconPause: typeof Pause;
    IconVolumeMute: typeof VolumeMute;
    IconVolumeNotice: typeof VolumeNotice;
    IconVolumeSmall: typeof VolumeSmall;
    IconVideoTwo: typeof VideoTwo;
    IconFormula: typeof Formula;
    IconLinkOne: typeof LinkOne;
    IconFullScreenOne: typeof FullScreenOne;
    IconOffScreenOne: typeof OffScreenOne;
    IconPower: typeof Power;
    IconListView: typeof ListView;
    IconMagic: typeof Magic;
    IconHighLight: typeof HighLight;
    IconShare: typeof Share;
    IconIndentLeft: typeof IndentLeft;
    IconIndentRight: typeof IndentRight;
    IconVerticalSpacingBetweenItems: typeof VerticalSpacingBetweenItems;
    IconCopy: typeof Copy;
    IconDelete: typeof Delete;
    IconSquare: typeof Square;
    IconRound: typeof Round;
  }
}

export {}
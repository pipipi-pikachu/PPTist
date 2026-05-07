# PPT_DATA_SCHEMA

> 注意，该文档专用于 AI 生成，并非完整数据定义

约定默认画布：

- 逻辑宽度固定为 `1000`
- 逻辑高度固定为 `562.5`
- 原点固定在页面左上角
- 坐标单位统一为逻辑像素 `px`
- 除线条外，元素默认都使用矩形包围盒表达位置和尺寸

## 坐标系与通用规则

### 页面坐标系

- 页面原点是左上角，即 `(0, 0)`
- 页面右下角默认是 `(1000, 562.5)`
- `x` 向右增大，`y` 向下增大

### 通用几何字段

以下规则适用于文本、图片、形状、表格、图表这类“矩形元素”：

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 必须 | 元素唯一 ID，全局唯一，如 `el_title_01` |
| `left` | `number` | 必须 | 元素未旋转时包围盒左上角的 `x` |
| `top` | `number` | 必须 | 元素未旋转时包围盒左上角的 `y` |
| `width` | `number` | 必须 | 元素包围盒宽度 |
| `height` | `number` | 必须 | 元素包围盒高度 |
| `rotate` | `number` | 必须 | 顺时针旋转角度，单位度，通常填 `0` |

注：
- 矩形元素的旋转中心是元素中心点
- `left/top/width/height` 始终描述“未旋转前”的包围盒

### 共享样式结构

#### 边框 `outline`

```json
{
  "style": "solid",
  "width": 2,
  "color": "#333333"
}
```

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `style` | `"solid" \\| "dashed" \\| "dotted"` | 建议 | 边框样式 |
| `width` | `number` | 建议 | 边框宽度 |
| `color` | `string` | 建议 | 边框颜色 |

#### 阴影 `shadow`

```json
{
  "h": 3,
  "v": 3,
  "blur": 2,
  "color": "rgba(0,0,0,0.25)"
}
```

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `h` | `number` | 建议 | 水平偏移 |
| `v` | `number` | 建议 | 垂直偏移 |
| `blur` | `number` | 建议 | 模糊半径 |
| `color` | `string` | 建议 | 阴影颜色 |

#### 渐变 `gradient`

```json
{
  "type": "linear",
  "rotate": 0,
  "colors": [
    { "pos": 0, "color": "#F8FAFF" },
    { "pos": 100, "color": "#E8EEF9" }
  ]
}
```

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"linear" \\| "radial"` | 必须 | 渐变类型 |
| `rotate` | `number` | 建议 | 线性渐变角度 |
| `colors` | `{ pos: number; color: string }[]` | 必须 | 渐变色标，`pos` 为 0 到 100 |

### 富文本内容约束

文本元素和形状内文本都使用 HTML 字符串。只有以下列出的 HTML 节点和内联样式会被识别，**严禁使用未列出的标签或样式**。

- 块级标签：`p`、`ul`、`ol`、`li`、`blockquote`
- 行内标签：`strong`、`em`、`u`、`strike`、`sup`、`sub`、`code`、`a`
- 行内样式标签：`span`

支持的样式：

- `span`：`color`、`background-color`、`font-size`、`font-family`
- `p`：`text-align`
- `ul/ol`：`list-style-type`、`font-size`、`color`

富文本示例：

**单段居中标题**

```html
<p style="text-align:center;"><span style="font-size:32px;color:#0F172A;">年度经营复盘</span></p>
```

**多段正文**

```html
<p>第一段文字内容。</p>
<p>第二段文字内容，其中<strong>关键词加粗</strong>展示。</p>
```

**无序列表**

```html
<ul>
  <li><p>列表项一</p></li>
  <li><p>列表项二</p></li>
</ul>
```

> **列表格式要求**：`<li>` 内部必须包裹 `<p>` 标签，如 `<li><p>内容</p></li>`。

### 文本类型

`title`: 标题
`subtitle`: 副标题
`content`: 正文
`item`: 列表项目
`itemTitle`: 列表项标题
`notes`: 注释
`header`: 页眉
`footer`: 页脚
`partNumber`: 节编号
`itemNumber`: 项目编号

### 可用字体

> 字体仅允许从以下列表选择，缺省值（未填写时）为系统默认字体

`SourceHanSans`： 思源黑体
`SourceHanSerif`： 思源宋体
`WenDingPLKaiTi`： 文鼎PL楷体
`WenDingPLSongTi`： 文鼎PL宋体
`ZhuqueFangSong`： 朱雀仿宋
`LXGWWenKai`： 霞鹜文楷
`AlibabaPuHuiTi`： 阿里巴巴普惠体
`MiSans`： MiSans
`DeYiHei`： 得意黑
`CangerXiaowanzi`： 仓耳小丸子
`YousheTitleBlack`： 优设标题黑
`FengguangMingrui`： 峰广明锐体
`ShetuModernSquare`： 摄图摩登小方体
`ZcoolHappy`： 站酷快乐体
`ZizhiQuXiMai`： 字制区喜脉体
`SucaiJishiKangkang`： 素材集市康康体
`SucaiJishiCoolSquare`： 素材集市酷方体
`TuniuRounded`： 途牛类圆体
`RuiziZhenyan`： 锐字真言体
`SourceSerif4`： Source Serif 4
`JetBrainsMono`： JetBrains Mono
`Literata`： Literata
`Inter`： Inter
`Roboto`： Roboto
`OpenSans`： Open Sans
`Montserrat`： Montserrat
`SourceSansPro`： Source Sans Pro
`Merriweather`： Merriweather

## 页面 Slide

### 最小推荐结构

```json
{
  "id": "slide_001",
  "background": {
    "type": "solid",
    "color": "#FFFFFF"
  },
  "elements": []
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 必须 | 页面唯一 ID |
| `background` | `object` | 建议 | 页面背景，包含纯色背景和渐变背景 |
| `elements` | `array` | 必须 | 本页元素数组 |

#### 纯色背景

```json
{
  "type": "solid",
  "color": "#FFFFFF"
}
```

#### 渐变背景

```json
{
  "type": "gradient",
  "gradient": {
    "type": "linear",
    "rotate": 90,
    "colors": [
      { "pos": 0, "color": "#F8FAFF" },
      { "pos": 100, "color": "#EEF2FF" }
    ]
  }
}
```

背景字段说明：

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"solid" \\| "gradient"` | 必须 | 背景类型 |
| `color` | `string` | `solid` 时必须 | 背景纯色 |
| `gradient` | `Gradient` | `gradient` 时必须 | 背景渐变 |

## 文本元素 `text`

### 最小推荐结构

```json
{
  "type": "text",
  "id": "el_title_01",
  "left": 72,
  "top": 54,
  "width": 856,
  "height": 72,
  "rotate": 0,
  "content": "<p><strong>年度经营分析</strong></p>",
  "defaultFontName": "SourceHanSans",
  "defaultColor": "#1F2937"
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"text"` | 必须 | 元素类型 |
| `content` | `string` | 必须 | 富文本 HTML |
| `defaultFontName` | `string` | 必须 | 默认字体，未被内联样式覆盖时生效 |
| `defaultColor` | `string` | 必须 | 默认文字颜色，未被内联样式覆盖时生效 |
| `fill` | `string` | 可选 | 文本框背景色 |
| `outline` | `object` | 可选 | 文本框边框 |
| `lineHeight` | `number` | 建议 | 行高倍数，默认约 `1.5` |
| `wordSpace` | `number` | 可选 | 字间距，单位 px |
| `opacity` | `number` | 可选 | 透明度，`0~1` |
| `shadow` | `object` | 可选 | 文本框阴影 |
| `textType` | `string` | 可选 | 文本类型 |

## 图片元素 `image`

### 最小推荐结构

```json
{
  "type": "image",
  "id": "el_image_01",
  "left": 650,
  "top": 126,
  "width": 278,
  "height": 182,
  "rotate": 0,
  "src": "https://images.pexels.com/photos/730670/pexels-photo-730670.jpeg",
  "description": "深蓝商务风办公室场景，一位亚洲女性站在玻璃白板前讲解增长曲线，光线干净，16:9 构图"
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"image"` | 必须 | 元素类型 |
| `src` | `string` | 必须 | 图片资源地址 |
| `description` | `string` | 必须 | 用于后续调用生图模型 |
| `outline` | `object` | 可选 | 图片轮廓边框 |
| `filters` | `object` | 可选 | 图片滤镜 |
| `clip` | `object` | 可选 | 图片裁剪 |
| `shadow` | `object` | 可选 | 阴影 |
| `radius` | `number` | 可选 | 圆角半径，主要用于矩形裁剪 |
| `colorMask` | `string` | 可选 | 颜色蒙版 |

### 图片滤镜 `filters`

示例：

```json
{
  "brightness": "108%",
  "contrast": "105%",
  "saturate": "92%",
  "opacity": "92%"
}
```

支持字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `blur` | `string` | 如 `"2px"` |
| `brightness` | `string` | 如 `"110%"` |
| `contrast` | `string` | 如 `"105%"` |
| `grayscale` | `string` | 如 `"100%"` |
| `saturate` | `string` | 如 `"80%"` |
| `hue-rotate` | `string` | 如 `"90deg"` |
| `sepia` | `string` | 如 `"60%"` |
| `invert` | `string` | 如 `"100%"` |
| `opacity` | `string` | 如 `"70%"` |

### 图片裁剪 `clip`

示例：

```json
{
  "shape": "roundRect",
  "range": [[5, 5], [95, 95]]
}
```

字段说明：

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `shape` | `string` | 建议 | 裁剪形状 key |
| `range` | `[[number, number], [number, number]]` | 必须 | 以百分比描述原图裁剪区间 |

`range` 说明：

- `[[x1, y1], [x2, y2]]`
- 范围为原图百分比，`0` 到 `100`
- `[[10, 10], [90, 90]]` 表示截取原图中间 80% 的区域

可使用的 `shape`：

- `rect`
- `roundRect`
- `ellipse`
- `triangle`
- `diamond`
- `pentagon`
- `hexagon`

## 形状元素 `shape`

### 最小推荐结构

```json
{
  "type": "shape",
  "id": "el_shape_01",
  "left": 72,
  "top": 140,
  "width": 240,
  "height": 52,
  "rotate": 0,
  "viewBox": [1000, 1000],
  "path": "M80 0 L920 0 Q1000 0 1000 80 L1000 920 Q1000 1000 920 1000 L80 1000 Q0 1000 0 920 L0 80 Q0 0 80 0 Z",
  "fill": "#E8F0FF"
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"shape"` | 必须 | 元素类型 |
| `viewBox` | `[number, number]` | 必须 | 路径坐标系大小，例如 `[1000, 1000]` |
| `path` | `string` | 必须 | SVG path `d` 字符串 |
| `fill` | `string` | 必须 | 填充色；若同时有 `gradient`，则 `gradient` 优先 |
| `gradient` | `object` | 可选 | 渐变填充 |
| `outline` | `object` | 可选 | 形状边框 |
| `opacity` | `number` | 可选 | 透明度，`0~1` |
| `shadow` | `object` | 可选 | 阴影 |
| `text` | `object` | 可选 | 形状内文本 |

### `path` 绘制规范

- 只能使用标准 SVG path 命令：`M`、`L`、`Q`、`C`、`A`、`Z`
- 路径坐标全部写在 `viewBox` 坐标系内，推荐统一使用 `viewBox: [1000, 1000]`

### 形状内文本 `text`

示例：

```json
{
  "content": "<p><strong>核心结论</strong></p>",
  "defaultFontName": "SourceHanSans",
  "defaultColor": "#1D4ED8",
  "align": "middle",
  "lineHeight": 1.4,
  "wordSpace": 0,
}
```

字段说明：

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | 必须 | 富文本 HTML |
| `defaultFontName` | `string` | 必须 | 默认字体 |
| `defaultColor` | `string` | 必须 | 默认文字颜色 |
| `align` | `"top" \\| "middle" \\| "bottom"` | 必须 | 文本在形状内部的垂直对齐 |
| `lineHeight` | `number` | 建议 | 行高倍数 |
| `wordSpace` | `number` | 可选 | 字间距 |
| `type` | `string` | 可选 | 文本类型 |

## 线条元素 `line`

### 最小推荐结构

```json
{
  "type": "line",
  "id": "el_line_01",
  "left": 72,
  "top": 230,
  "start": [0, 0],
  "end": [420, 0],
  "width": 2,
  "style": "solid",
  "color": "#CBD5E1",
  "points": ["", ""]
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"line"` | 必须 | 元素类型 |
| `id` | `string` | 必须 | 元素 ID |
| `left` | `number` | 必须 | 线条局部坐标系左上角在页面中的位置 |
| `top` | `number` | 必须 | 线条局部坐标系左上角在页面中的位置 |
| `start` | `[number, number]` | 必须 | 起点，相对 `left/top` |
| `end` | `[number, number]` | 必须 | 终点，相对 `left/top` |
| `width` | `number` | 必须 | 线宽，不是包围盒宽度 |
| `style` | `"solid" \\| "dashed" \\| "dotted"` | 必须 | 线型 |
| `color` | `string` | 必须 | 线条颜色 |
| `points` | `["" \\| "arrow" \\| "dot", "" \\| "arrow" \\| "dot"]` | 必须 | 起点和终点端点样式 |
| `shadow` | `object` | 可选 | 阴影 |

### 线条与其他元素的关键差异

- 没有 `height`
- 没有 `rotate`
- `width` 表示描边粗细，不表示几何宽度
- 方向完全由 `start` 和 `end` 决定
- `left/top` 只是线条局部坐标系的锚点

## 表格元素 `table`

### 最小推荐结构

```json
{
  "type": "table",
  "id": "el_table_01",
  "left": 72,
  "top": 290,
  "width": 420,
  "height": 180,
  "rotate": 0,
  "outline": {
    "width": 1,
    "style": "solid",
    "color": "#D1D5DB"
  },
  "colWidths": [0.3, 0.35, 0.35],
  "cellMinHeight": 45,
  "data": [
    [
      { "id": "c_1_1", "colspan": 1, "rowspan": 1, "text": "区域" },
      { "id": "c_1_2", "colspan": 1, "rowspan": 1, "text": "收入" },
      { "id": "c_1_3", "colspan": 1, "rowspan": 1, "text": "同比" }
    ],
    [
      { "id": "c_2_1", "colspan": 1, "rowspan": 1, "text": "华东" },
      { "id": "c_2_2", "colspan": 1, "rowspan": 1, "text": "3200 万" },
      { "id": "c_2_3", "colspan": 1, "rowspan": 1, "text": "+18%" }
    ]
  ]
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"table"` | 必须 | 元素类型 |
| `outline` | `object` | 必须 | 表格边框 |
| `theme` | `object` | 可选 | 表格主题色和头尾行列标记 |
| `colWidths` | `number[]` | 必须 | 每列宽度占比，总和应为 `1` |
| `cellMinHeight` | `number` | 必须 | 每行最小高度 |
| `data` | `TableCell[][]` | 必须 | 二维单元格数据 |

### 单元格 `TableCell`

```json
{
  "id": "c_1_1",
  "colspan": 1,
  "rowspan": 1,
  "text": "区域",
  "style": {
    "bold": true,
    "color": "#111827",
    "backcolor": "#F3F4F6",
    "fontsize": "14px",
    "fontname": "SourceHanSans",
    "align": "center",
    "vAlign": "middle"
  }
}
```

字段说明：

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 必须 | 单元格 ID |
| `colspan` | `number` | 必须 | 跨列数，默认 `1` |
| `rowspan` | `number` | 必须 | 跨行数，默认 `1` |
| `text` | `string` | 必须 | 纯文本内容 |
| `style` | `object` | 可选 | 单元格样式 |

### 单元格样式 `style`

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `bold` | `boolean` | 可选 | 加粗 |
| `em` | `boolean` | 可选 | 斜体 |
| `underline` | `boolean` | 可选 | 下划线 |
| `strikethrough` | `boolean` | 可选 | 删除线 |
| `color` | `string` | 可选 | 文字颜色 |
| `backcolor` | `string` | 可选 | 单元格背景色 |
| `fontsize` | `string` | 可选 | 字号，如 `"14px"` |
| `fontname` | `string` | 可选 | 字体名 |
| `align` | `"left" \\| "center" \\| "right" \\| "justify"` | 可选 | 水平对齐 |
| `vAlign` | `"top" \\| "middle" \\| "bottom"` | 可选 | 垂直对齐 |

### 表格主题 `theme`

```json
{
  "color": "#3B82F6",
  "rowHeader": true,
  "rowFooter": false,
  "colHeader": false,
  "colFooter": false
}
```

说明：

- `color` 是主题主色
- `rowHeader` 表示首行视为表头
- `rowFooter` 表示末行视为表尾
- `colHeader` 表示首列视为表头列
- `colFooter` 表示末列视为表尾列

## 图表元素 `chart`

### 最小推荐结构

```json
{
  "type": "chart",
  "id": "el_chart_01",
  "left": 528,
  "top": 290,
  "width": 400,
  "height": 220,
  "rotate": 0,
  "chartType": "column",
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "legends": ["营收"],
    "series": [[120, 150, 180, 210]]
  },
  "themeColors": ["#3B82F6", "#93C5FD"],
  "textColor": "#475569",
  "lineColor": "#E2E8F0"
}
```

### 字段说明

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `type` | `"chart"` | 必须 | 元素类型 |
| `fill` | `string` | 可选 | 图表容器背景色 |
| `chartType` | `"bar" \\| "column" \\| "line" \\| "pie" \\| "ring" \\| "area" \\| "radar" \\| "scatter"` | 必须 | 图表类型 |
| `data` | `object` | 必须 | 图表数据 |
| `themeColors` | `string[]` | 必须 | 系列主题色，至少 1 个 |
| `textColor` | `string` | 可选 | 坐标轴、标签、图例文字颜色 |
| `lineColor` | `string` | 可选 | 网格线或雷达轴线颜色 |

### 数据结构 `data`

```json
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "legends": ["营收", "利润"],
  "series": [
    [120, 150, 180, 210],
    [25, 28, 33, 41]
  ]
}
```

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| `labels` | `string[]` | 必须 | 类目标签 |
| `legends` | `string[]` | 建议 | 系列名称 |
| `series` | `number[][]` | 必须 | 数据序列数组 |

### 数据约束

#### 柱状图 / 条形图 / 折线图 / 面积图

- `labels.length` 应等于每个 `series[i].length`
- `legends.length` 应等于 `series.length`

#### 饼图 / 环形图

- 只使用 `series[0]`
- `series[0].length` 应等于 `labels.length`
- `labels` 表示每个扇区名称
- `legends` 可写一个系列名，也可与 `labels` 保持一致，但渲染主要依赖 `labels`

#### 雷达图

- `labels` 表示雷达各维度名
- `series[i].length` 应等于 `labels.length`
- `legends.length` 应等于 `series.length`

#### 散点图

- `series[0]` 视为 `x` 数据
- `series[1]` 视为 `y` 数据

## 综合示例数据

```json
{
  "id": "slide_business_review_01",
  "background": {
    "type": "gradient",
    "gradient": {
      "type": "linear",
      "rotate": 0,
      "colors": [
        { "pos": 0, "color": "#F8FBFF" },
        { "pos": 100, "color": "#EEF4FF" }
      ]
    }
  },
  "elements": [
    {
      "type": "text",
      "id": "el_title_01",
      "left": 72,
      "top": 56,
      "width": 856,
      "height": 72,
      "rotate": 0,
      "content": "<p><strong>2026 年第一季度营收结构分析</strong></p>",
      "defaultFontName": "SourceHanSans",
      "defaultColor": "#0F172A",
      "lineHeight": 1.2,
      "paragraphSpace": 5
    },
    {
      "type": "text",
      "id": "el_summary_01",
      "left": 72,
      "top": 142,
      "width": 856,
      "height": 96,
      "rotate": 0,
      "content": "<p>本页展示 2026 年第一季度营收构成。整体上，<strong>企业服务</strong>仍是主要收入来源，教育培训与订阅服务形成稳定补充，其他业务占比相对较小。</p>",
      "defaultFontName": "SourceHanSans",
      "defaultColor": "#334155",
      "lineHeight": 1.5,
      "paragraphSpace": 8
    },
    {
      "type": "chart",
      "id": "el_chart_01",
      "left": 235,
      "top": 260,
      "width": 530,
      "height": 250,
      "rotate": 0,
      "fill": "#FFFFFF",
      "chartType": "pie",
      "data": {
        "labels": ["企业服务", "教育培训", "订阅服务", "其他"],
        "legends": ["营收占比"],
        "series": [
          [46, 24, 18, 12]
        ]
      },
      "outline": {
        "width": 1,
        "style": "solid",
        "color": "#E2E8F0"
      },
      "themeColors": ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
      "textColor": "#475569",
      "lineColor": "#E2E8F0"
    }
  ]
}
```
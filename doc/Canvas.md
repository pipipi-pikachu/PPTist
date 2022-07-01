## 画布与元素

#### 编辑器的基本结构
```
└──编辑器
    ├── 顶部菜单里
    ├── 左侧导航栏
    ├── 右侧导航栏
    ├── 中上部插入/工具栏
    ├── 底部输入栏
    └── 画布
         ├── 可视区域
         │    ├── 可编辑元素
         │    └── 鼠标选框
         │
         └── 画布工具
              ├── 参考线
              ├── 标尺
              ├── 元素操作节点层（如拖拽缩放点）
              ├── 吸附对齐线
              └── 可视区域背景
```

#### 画布的基本原理
我们把关注点放在相对复杂的【画布】部分。画布中的每一个元素都由一组数据来描述，例如：
```typescript
interface PPTBaseElement {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
```
顾名思义，`left` 表示元素距离画布左上角的位置，`width` 表示元素的宽度，以此类推。
重点需要知道的是：可视区域默认以 宽1000像素 、高562.5像素为基础比例。即无论画布和可视区域实际大小是多少，一个 `{ width: 1000px, height: 562.5px, left: 0, top: 0 }` 的元素一定会正好铺满整个可视区域。
具体实现的方法很简单：假设可视区域的实际宽度为 1200px ，计算出此时的缩放比为 1200 / 1000 = 1.2 ，然后将可视区域内的元素全部缩放到 1.2 倍即可。
同理【缩略图】 和 【放映页面】 其实上就是一个实际大小更小或更大的可视区域。

#### 画布内的元素
除了上述中的位置和尺寸信息，还可以携带更多的数据，以一个文本元素为例：
```typescript
interface PPTTextElement {
  type: 'text';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  link?: string;
  content: string;
  rotate: number;
  defaultFontName: string;
  defaultColor: string;
  outline?: PPTElementOutline;
  fill?: string;
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  shadow?: PPTElementShadow;
}
```
你可以定义一个 `rotate` 来表示文本框旋转的角度、定义一个 `opacity` 来表示文本框的透明度 等。在实现时只需要按照你所定义的数据来渲染元素组件即可，而编辑元素的本质就是在修改这些数据。
以上就是一个画布最基本的组成了。

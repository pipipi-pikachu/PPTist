## 如何自定义一个元素

我们以【网页元素】为例，来梳理下自定义一个元素的过程。
> 完整代码在 https://github.com/pipipi-pikachu/PPTist/tree/document-demo

> 注意：由于版本更新，该文档和仓库中的代码并不是直接复制粘贴就可以使用，这里仅提供思路。

### 编写新元素的结构与配置
首先需要定义这个元素的结构，并添加该元素类型
```typescript 
// types/slides.ts

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
  LATEX = 'latex',
  VIDEO = 'video',
  AUDIO = 'audio',
  FRAME = 'frame', // add
}

// add
export interface PPTFrameElement extends PPTBaseElement {
  type: 'frame'
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  url: string; // 网页链接地址
}

// 修改 PPTElement Type
export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement | PPTFrameElement
```

在配置文件中添加新元素的中文名，以及最小尺寸：
```typescript
// configs/element

export const ELEMENT_TYPE_ZH = {
  text: '文本',
  image: '图片',
  shape: '形状',
  line: '线条',
  chart: '图表',
  table: '表格',
  video: '视频',
  audio: '音频',
  frame: '网页', // add
}

export const MIN_SIZE = {
  text: 20,
  image: 20,
  shape: 15,
  chart: 200,
  table: 20,
  video: 250,
  audio: 20,
  frame: 200, // add
}
```

### 编写新元素组件
然后开始编写该元素的组件：
```html
<!-- views/components/element/FrameElement/index.vue -->

<template>
  <div class="editable-element-frame"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div 
        class="element-content" 
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
      >
        <iframe 
          :src="elementInfo.url"
          :width="elementInfo.width"
          :height="elementInfo.height"
          :frameborder="0" 
          :allowfullscreen="true"
        ></iframe>

        <div class="drag-handler top"></div>
        <div class="drag-handler bottom"></div>
        <div class="drag-handler left"></div>
        <div class="drag-handler right"></div>

        <div class="mask" 
          v-if="handleElementId !== elementInfo.id"
          @mousedown="$event => handleSelectElement($event, false)"
          @touchstart="$event => handleSelectElement($event, false)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTFrameElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
  selectElement: {
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTFrameElement, canMove?: boolean) => void>,
    required: true,
  },
  contextmenus: {
    type: Function as PropType<() => ContextmenuItem[] | null>,
  },
})

const { handleElementId } = storeToRefs(useMainStore())

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
  e.stopPropagation()
  props.selectElement(e, props.elementInfo, canMove)
}
</script>

<style lang="scss" scoped>
.editable-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
  cursor: move;
}
.drag-handler {
  position: absolute;

  &.top {
    height: 20px;
    left: 0;
    right: 0;
    top: 0;
  }
  &.bottom {
    height: 20px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.left {
    width: 20px;
    top: 0;
    bottom: 0;
    left: 0;
  }
  &.right {
    width: 20px;
    top: 0;
    bottom: 0;
    right: 0;
  }
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

此外我们需要另一个不带编辑功能的基础版组件，用于缩略图/放映模式下显示：
```html
<!-- views/components/element/FrameElement/BaseFrameElement.vue -->

<template>
  <div class="base-element-frame"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div class="element-content">
        <iframe 
          :src="elementInfo.url"
          :width="elementInfo.width"
          :height="elementInfo.height"
          :frameborder="0" 
          :allowfullscreen="true"
        ></iframe>

        <div class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { PPTFrameElement } from '@/types/slides'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.base-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

在这里你可能会发现，这两个组件非常相似，确实如此，对于比较简单的元素组件来说，可编辑版和不可编辑版是高度一致的，不可编辑版可能仅仅是少了一些方法而已。但是对于比较复杂的元素组件，两者的差异就会比较大了（具体可以比较文本元素和图片元素的两版），因此，你可以自行判断是否将二者合并抽象为一个组件，这里不过多展开。

编写完元素组件，我们需要把它用在需要的地方，具体可能包括：

- 缩略图元素组件 `views/components/ThumbnailSlide/ThumbnailElement.vue`
- 放映元素组件 `views/Screen/ScreenElement.vue`
- 可编辑元素组件 `views/Editor/Canvas/EditableElement.vue`
- 移动端可编辑元素组件 `views/Mobile/MobileEditor/MobileEditableElement.vue`

一般来说，前两者使用不可编辑版，后两者使用可编辑版。
这里仅以画布中的可编辑元素组件为例：
```html
<!-- views/Editor/Canvas/EditableElement.vue -->

<script lang="ts" setup>
 import FrameElement from '@/views/components/element/FrameElement/index.vue'

 const currentElementComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
    [ElementTypes.FRAME]: FrameElement, // add
  }
  return elementTypeMap[props.elementInfo.type] || null
})
</script>
```

在画布的可编辑元素中，还需要为元素添加操作节点 `Operate`（一般包括八个缩放点、四条边线、一个旋转点），对于特殊的元素（如线条的操作节点明显与其他不同）你可以自己编写该组件，但是一般情况下可以直接使用已经编写好的通用操作节点：
```html
<!-- src\views\Editor\Canvas\Operate\index.vue -->

<script lang="ts" setup>
const currentOperateComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElementOperate,
    [ElementTypes.TEXT]: TextElementOperate,
    [ElementTypes.SHAPE]: ShapeElementOperate,
    [ElementTypes.LINE]: LineElementOperate,
    [ElementTypes.TABLE]: TableElementOperate,
    [ElementTypes.CHART]: CommonElementOperate,
    [ElementTypes.LATEX]: CommonElementOperate,
    [ElementTypes.VIDEO]: CommonElementOperate,
    [ElementTypes.AUDIO]: CommonElementOperate,
    [ElementTypes.FRAME]: CommonElementOperate, // add
  }
  return elementTypeMap[props.elementInfo.type] || null
})
</script>
```

### 编写右侧元素编辑面板
接下来需要为元素添加一个样式面板。当选中元素时，右侧工具栏会自动聚焦到该面板，你需要在这里添加一些你认为需要的设置项来操作元素本身，只需要记住一点：修改元素实际是修改元素的数据，也就是最开始定义的结构中的各个字段。
另外，修改元素后不要忘了将操作添加到历史记录。
```html
<!-- src\views\Editor\Toolbar\ElementStylePanel\FrameStylePanel.vue -->

<template>
  <div class="frame-style-panel">
    <div class="row">
      <div>网页链接：</div>
      <Input v-model:value="url" placeholder="请输入网页链接" />
      <Button @click="updateURL()">确定</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(useMainStore())

const { addHistorySnapshot } = useHistorySnapshot()

const url = ref('')

const updateURL = () => {
  if (!handleElementId.value) return
  slidesStore.updateElement({ id: handleElementId.value, props: { url: url.value } })
  addHistorySnapshot()
}
</script>
```
```html
<script lang="ts" setup>
import FrameStylePanel from './FrameStylePanel.vue'
  
const panelMap = {
  [ElementTypes.TEXT]: TextStylePanel,
  [ElementTypes.IMAGE]: ImageStylePanel,
  [ElementTypes.SHAPE]: ShapeStylePanel,
  [ElementTypes.LINE]: LineStylePanel,
  [ElementTypes.CHART]: ChartStylePanel,
  [ElementTypes.TABLE]: TableStylePanel,
  [ElementTypes.LATEX]: LatexStylePanel,
  [ElementTypes.VIDEO]: VideoStylePanel,
  [ElementTypes.AUDIO]: AudioStylePanel,
  [ElementTypes.FRAME]: FrameStylePanel, // add
}
</script>
```

### 创建元素
这是自定义一个新元素的最后一步。首先编写一个创建元素的方法：
```typescript
// src\hooks\useCreateElement.ts

const createFrameElement = (url: string) => {
  createElement({
    type: 'frame',
    id: nanoid(10),
    width: 800,
    height: 480,
    rotate: 0,
    left: (VIEWPORT_SIZE - 800) / 2,
    top: (VIEWPORT_SIZE * viewportRatio.value - 480) / 2,
    url,
  })
}
```
然后在插入工具栏中使用：
```html
<!-- src\views\Editor\CanvasTool\index.vue -->

<template>
  <div class="canvas-tool">
    <div class="add-element-handler">
      <!-- add -->
      <span class="handler-item" @click="createFrameElement('https://v3.cn.vuejs.org/')">插入网页</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
  createFrameElement, // add
} = useCreateElement()
</script>
```
点击【插入网页】按钮，你就会看到一个网页元素被添加到画布中了。

### 总结
至此就是自定义一个元素的基本流程了。整个过程比较繁琐，但并不复杂，重点在于元素结构的定义与元素组件的编写，这决定了新元素将具备怎样的能力与外表。而其他的部分仅依葫芦画瓢即可。
除此之外，还有一些非必须的调整：比如你希望导出能够支持新元素，则需要在导出相关的方法中进行扩展；比如你希望主题功能能够应用在新元素上，则需要在主题相关的方法中进行扩展，以此类推。

# PPTist 模板选择功能迁移执行指南

> 本文档用于指导 Codex 在另一个前端项目中，参考 PPTist 的 `Templates.vue` 完成模板选择、模板数据读取、单页插入和整套模板插入功能。
>
> 当前已知前置条件：
> - `template_1.json` 到 `template_8.json` 已复制到目标项目。
> - `template_1.webp` 到 `template_8.webp` 已复制到目标项目。
> - 模板元信息列表已复制到目标项目。
> - 不要求完整复刻 PPTist 的 `Templates.vue`，只要求交互参考、数据一致、能适配目标项目的数据流。

## 迁移目标

在目标前端项目中实现一个“模板选择面板”，功能包含：

1. 展示模板分类列表，例如“山河映红”“都市蓝调”等。
2. 点击模板分类后，读取对应的 `template_x.json`。
3. 展示该模板中的幻灯片页面列表。
4. 支持按页面类型筛选：
   - `all`：全部
   - `cover`：封面
   - `contents`：目录
   - `transition`：过渡
   - `content`：内容
   - `end`：结束
5. 支持“插入单页模板”。
6. 支持“插入全部模板”。
7. 插入目标项目时，保持模板 JSON 数据字段不被破坏。
8. 如果目标项目的页面数据结构与 PPTist 不一致，需要新增 adapter 做转换。

## 源项目关键信息

源组件路径：

```text
src/views/Editor/Thumbnails/Templates.vue
```

源组件只负责：

1. 读取模板元信息列表。
2. 根据模板 `id` 加载 mock JSON。
3. 根据 `slide.type` 过滤模板页。
4. 使用 `ThumbnailSlide` 渲染缩略图。
5. 通过事件向父组件抛出插入行为。

源项目模板元信息结构：

```ts
interface SlideTemplate {
  name: string
  id: string
  cover: string
  origin?: string
}
```

示例：

```ts
[
  { name: '山河映红', id: 'template_1', cover: './imgs/template_1.webp', origin: '官方制作' },
  { name: '都市蓝调', id: 'template_2', cover: './imgs/template_2.webp', origin: '官方制作' },
  { name: '智感几何', id: 'template_3', cover: './imgs/template_3.webp', origin: '官方制作' },
  { name: '柔光莫兰迪', id: 'template_4', cover: './imgs/template_4.webp', origin: '官方制作' },
  { name: '简约绿意', id: 'template_5', cover: './imgs/template_5.webp', origin: '社区贡献+官方深度完善优化' },
  { name: '暖色复古', id: 'template_6', cover: './imgs/template_6.webp', origin: '社区贡献+官方深度完善优化' },
  { name: '深邃沉稳', id: 'template_7', cover: './imgs/template_7.webp', origin: '社区贡献+官方深度完善优化' },
  { name: '浅蓝小清新', id: 'template_8', cover: './imgs/template_8.webp', origin: '社区贡献+官方深度完善优化' },
]
```

模板 JSON 顶层结构：

```ts
interface TemplateJson {
  title?: string
  width?: number
  height?: number
  theme?: Partial<SlideTheme>
  slides: Slide[]
}
```

源项目读取模板 JSON 的方式：

```ts
api.getMockData(templateId)
```

等价于：

```ts
fetch(`/mocks/${templateId}.json`).then(response => response.json())
```

实际路径需要以目标项目静态资源目录为准。

## 必须先确认的目标项目信息

开始编码前，先在目标项目中确认以下内容：

1. 前端框架：
   - 是否为 Vue 3。
   - 是否使用 `<script setup>`。
   - 是否使用 TypeScript。
2. 状态管理：
   - 是否使用 Pinia、Vuex、Zustand、Redux，或普通 composable。
   - 当前幻灯片列表保存在哪里。
   - 当前选中页索引保存在哪里。
   - 主题配置保存在哪里。
3. 页面数据结构：
   - 目标项目是否直接使用 PPTist 的 `Slide` 数据结构。
   - 如果不是，找到目标项目自己的页面类型定义。
   - 明确 PPTist `Slide[]` 转目标项目页面数据的转换规则。
4. 缩略图渲染方式：
   - 目标项目是否已有 PPT 页面缩略图组件。
   - 如果没有，短期可以先显示模板 `cover` 图或简化预览。
   - 如果要渲染每一页真实缩略图，需要确认目标项目是否已经具备 PPTist 元素渲染能力。
5. 静态资源路径：
   - 确认 `template_x.json` 在浏览器中可通过什么 URL 访问。
   - 确认 `template_x.webp` 在浏览器中可通过什么 URL 访问。
6. 插入行为：
   - 单页模板是插入到当前页之后，还是替换当前页。
   - 全部模板是在空文档时覆盖，还是永远追加。
   - 是否需要插入后选中新插入的第一页。
7. 历史记录：
   - 插入模板后是否需要记录 undo/redo 快照。
   - 如果目标项目有快照机制，插入完成后必须调用现有快照入口。

## 推荐实现结构

目标项目中建议新增或改造以下文件，实际路径按目标项目目录调整：

```text
src/components/TemplatesPanel.vue
src/services/templateService.ts
src/adapters/pptistTemplateAdapter.ts
src/constants/templates.ts
```

职责划分：

```text
templates.ts
  保存模板元信息和页面类型筛选项。

templateService.ts
  负责根据 templateId 读取 template_x.json。

pptistTemplateAdapter.ts
  负责把 PPTist 的 Slide/Theme 数据转换成目标项目能使用的数据。

TemplatesPanel.vue
  负责 UI、加载状态、筛选、点击插入，不直接写复杂转换逻辑。
```

如果目标项目已有类似目录，应优先沿用目标项目现有风格，不强行新增这些文件。

## 数据常量建议

模板类型筛选项应保持与 PPTist 一致：

```ts
export const TEMPLATE_SLIDE_TYPES = [
  { label: '全部', value: 'all' },
  { label: '封面', value: 'cover' },
  { label: '目录', value: 'contents' },
  { label: '过渡', value: 'transition' },
  { label: '内容', value: 'content' },
  { label: '结束', value: 'end' },
]
```

注意：

1. `all` 不是模板 JSON 中的真实 `slide.type`，只用于前端筛选。
2. 模板 JSON 中可能存在没有 `type` 的页面，筛选 `all` 时应展示，筛选具体类型时不展示。
3. 如果目标项目需要自定义类型名称，应该只改 UI 文案，不要改 JSON 中的 `type` 原值。

## 模板读取服务

建议封装一个独立函数读取模板 JSON。

示例：

```ts
export async function fetchTemplateData(templateId: string): Promise<TemplateJson> {
  /**
   * templateId 用于拼接静态资源路径，例如 template_1、template_2。
   * 这里必须只接收来自模板元信息列表的 id，不要直接接收用户输入，
   * 避免拼接出不存在路径或产生静态资源越权访问问题。
   */
  const response = await fetch(`/mocks/${templateId}.json`)

  /**
   * response.ok 用于兜底处理 404、500 等异常状态。
   * 如果不做判断，后续 response.json() 可能抛出难以定位的解析错误。
   */
  if (!response.ok) {
    throw new Error(`模板数据加载失败：${templateId}`)
  }

  /**
   * data 是 PPTist 模板 JSON 的原始内容。
   * 注意不要在这里直接改写 slide id 或 element id，
   * ID 重建应该放在插入 adapter 中，避免只预览模板时也改变原始数据。
   */
  const data = await response.json()

  /**
   * slides 是模板功能的核心字段。
   * 如果缺失或不是数组，说明静态资源路径错误、JSON 损坏或数据格式不是 PPTist 模板格式。
   */
  if (!Array.isArray(data.slides)) {
    throw new Error(`模板数据格式异常：${templateId}`)
  }

  return data
}
```

路径注意：

1. Vite `public/mocks/template_1.json` 通常可通过 `/mocks/template_1.json` 访问。
2. 如果目标项目部署在子路径，需要结合 `base` 或项目已有资源路径工具处理。
3. 不要把 `./mocks`、`/mocks`、`import.meta.env.BASE_URL` 混用，先看目标项目已有写法。

## UI 组件迁移策略

不要原样复制源项目的 `Templates.vue`，因为它依赖以下内部能力：

1. `useSlidesStore`
2. `storeToRefs`
3. `api.getMockData`
4. `ThumbnailSlide`
5. `Button`
6. `v-loading`
7. SCSS 变量：`$borderColor`、`$borderRadius`、`$themeColor`、`$transitionDelay`
8. SCSS mixin：`flex-grid-layout`、`absolute-0`

目标项目中应重写成目标项目自己的组件风格。

组件最小状态：

```ts
const activeTemplateId = ref('')
const activeType = ref('all')
const loading = ref(false)
const slides = ref<Slide[]>([])
const theme = ref<Partial<SlideTheme>>({})
```

组件最小事件：

```ts
const emit = defineEmits<{
  (event: 'select', payload: Slide): void
  (event: 'selectAll', payload: { slides: Slide[], theme: Partial<SlideTheme> }): void
}>()
```

如果目标项目不是 Vue，可以保留同样的行为协议：

```text
onSelect(slide)
onSelectAll({ slides, theme })
```

## 切换模板逻辑

模板切换时需要处理加载、异常和滚动复位。

建议行为：

1. 点击模板分类。
2. 设置 `loading = true`。
3. 记录当前模板 ID。
4. 请求对应 JSON。
5. 写入 `slides` 和 `theme`。
6. 请求成功后将列表滚动到顶部。
7. 请求失败时展示错误提示。
8. 无论成功失败，都要结束 loading。

边界条件：

1. 模板 ID 为空时，不应发起请求。
2. 用户快速连续切换模板时，旧请求可能晚于新请求返回。
3. 如果目标项目中会出现快速切换，建议使用请求序号或 AbortController 防止旧响应覆盖新状态。
4. `ret.theme` 可能为空，必须允许 theme 使用 `{}`。
5. `ret.slides` 为空数组时，UI 应展示空状态，而不是报错。

## 筛选逻辑

筛选逻辑保持简单：

```ts
const visibleSlides = computed(() => {
  /**
   * activeType 为 all 时展示全部页面。
   * 这里包含没有 slide.type 的页面，避免模板数据不完整时页面被意外隐藏。
   */
  if (activeType.value === 'all') return slides.value

  /**
   * activeType 为具体类型时，只展示类型完全匹配的页面。
   * 不建议做模糊匹配，避免 contents 和 content 这类相似字符串误判。
   */
  return slides.value.filter(slide => slide.type === activeType.value)
})
```

## 缩略图渲染策略

优先级从高到低：

1. 如果目标项目已经有 PPT 页面缩略图组件，直接使用目标项目组件渲染每个 `slide`。
2. 如果目标项目已经迁移了 PPTist 的元素渲染器，可以参考 `ThumbnailSlide` 渲染。
3. 如果目标项目暂时没有真实缩略图能力，可以先展示模板封面图 `template_x.webp`，但这只能代表模板分类，不能代表每一页。
4. 如果需要每一页都有预览，但目标项目没有渲染器，需要后续补充“将 slide 渲染成图片”的能力。

注意：

1. PPTist 的 `ThumbnailSlide` 不只是一个图片组件，它会渲染 shape、text、image、line、chart、table、latex、video、audio 等元素。
2. 直接复制 `ThumbnailSlide` 会继续牵出大量依赖，不适合作为第一步。
3. 迁移第一阶段可以先完成数据读取和插入，缩略图只要能表达可选项即可。

## 插入适配逻辑

插入前必须确认目标项目是否能直接使用 PPTist 的 `Slide` 数据。

如果目标项目直接使用 PPTist 数据结构：

1. 单页插入：
   - 深拷贝被选中的 slide。
   - 重建 slide id。
   - 重建内部 element id。
   - 插入到当前页之后。
2. 全部插入：
   - 深拷贝 slides。
   - 重建所有 slide id。
   - 重建所有 element id。
   - 空文档时可覆盖当前文档。
   - 非空文档时建议追加到当前页之后或文档末尾，按目标项目交互决定。
   - 同步应用 theme。

如果目标项目不使用 PPTist 数据结构：

1. 新增 `pptistTemplateAdapter.ts`。
2. 在 adapter 中把 PPTist `Slide` 转成目标项目页面模型。
3. 不要在 UI 组件里直接写字段转换。
4. 转换失败时要返回明确错误，提示是哪个 slide 或 element 不支持。

## ID 重建规则

模板 JSON 中的 `slide.id` 和 `element.id` 是固定的。

插入时必须重建 ID，原因：

1. 同一个模板可能被插入多次。
2. 单页模板可能重复插入。
3. 目标项目的选中、编辑、动画、分组、撤销等能力通常都依赖 ID。
4. 不重建 ID 会导致更新一个元素时误伤另一个同 ID 元素。

至少需要重建：

1. `slide.id`
2. `slide.elements[].id`

还需要检查并同步处理：

1. `groupId`
2. `animations[].elId`
3. 任何指向元素 ID 的字段
4. 任何指向页面 ID 的字段

建议做法：

1. 为每个旧 slide id 建立 `oldSlideId -> newSlideId` 映射。
2. 为每个旧 element id 建立 `oldElementId -> newElementId` 映射。
3. 替换元素自身 id。
4. 替换动画绑定的 `elId`。
5. 如果目标项目使用组 ID 且要求组 ID 全局唯一，也要重建 `groupId`。

## 深拷贝规则

插入模板时不要直接把预览列表里的对象写入目标项目状态。

原因：

1. 预览对象来自模板 JSON，可能继续被当前组件使用。
2. 直接引用会导致编辑器修改页面时污染模板预览数据。
3. 再次插入同一模板时，可能拿到已经被改过的数据。

建议：

```ts
const clonedSlides = structuredClone(slides)
```

兼容性要求较高时：

```ts
const clonedSlides = JSON.parse(JSON.stringify(slides))
```

注意：

1. 当前模板 JSON 基本是普通 JSON 数据，使用 JSON 深拷贝通常可行。
2. 如果目标项目后续在 slide 中加入函数、Map、Date 等非 JSON 字段，需要改用更合适的 clone 工具。

## 主题应用规则

模板 JSON 中的 `theme` 应与 slides 一起传递。

插入全部模板时：

1. 空文档覆盖：建议同时应用 `theme`。
2. 非空文档追加：是否应用 `theme` 要看产品预期。
3. 如果追加时应用 `theme`，可能影响已有页面的默认颜色和字体。
4. 如果追加时不应用 `theme`，模板页中的局部样式仍会保留，但新建元素默认样式可能与模板不一致。

建议默认策略：

1. 空文档插入全部：应用模板 `theme`。
2. 非空文档追加全部：只插入 slides，不覆盖全局 theme，除非目标项目明确要求。
3. 单页插入：默认不覆盖全局 theme。

## 父级接入方式

面板组件只抛事件，父级负责真正写入项目状态。

Vue 示例协议：

```vue
<TemplatesPanel
  @select="handleInsertTemplateSlide"
  @selectAll="handleInsertAllTemplateSlides"
/>
```

父级逻辑建议：

```ts
function handleInsertTemplateSlide(slide: Slide) {
  /**
   * slide 是模板面板中的原始页面对象。
   * 插入前必须深拷贝和重建 ID，避免污染模板数据和产生 ID 冲突。
   */
  const nextSlide = prepareTemplateSlideForInsert(slide)

  /**
   * insertSlideAfterCurrent 是目标项目自己的插入入口。
   * 不要在模板面板里直接依赖具体 store，降低迁移耦合。
   */
  insertSlideAfterCurrent(nextSlide)
}

function handleInsertAllTemplateSlides(payload: { slides: Slide[], theme: Partial<SlideTheme> }) {
  /**
   * payload.slides 是模板 JSON 中的页面数组。
   * 全部插入时同样需要深拷贝和批量重建 ID。
   */
  const nextSlides = prepareTemplateSlidesForInsert(payload.slides)

  /**
   * 空文档覆盖和非空文档追加的判断应放在父级或业务 service 中，
   * 因为只有父级知道当前文档状态和产品交互规则。
   */
  if (isEmptyDocument()) {
    replaceSlides(nextSlides)
    applyTheme(payload.theme)
  }
  else {
    appendSlides(nextSlides)
  }
}
```

## 异常和空状态

必须处理：

1. 模板列表为空。
2. 模板 JSON 文件不存在。
3. 模板 JSON 解析失败。
4. 模板 JSON 中没有 `slides`。
5. 当前筛选类型没有任何页面。
6. 插入时目标项目状态未初始化。
7. 插入时 ID 生成函数不可用。

建议 UI 提示：

1. 加载中：`加载中...`
2. 加载失败：`模板加载失败`
3. 空筛选：`暂无该类型页面`
4. 空模板：`暂无模板`

## 验收清单

完成后逐项验证：

1. 8 个模板分类都能显示。
2. 8 个模板 JSON 都能成功加载。
3. 每个模板切换后页面列表会更新。
4. 页面类型筛选正确。
5. `all` 能展示全部页面。
6. `cover` 只展示封面页。
7. `contents` 只展示目录页。
8. `transition` 只展示过渡页。
9. `content` 只展示内容页。
10. `end` 只展示结束页。
11. 单页插入后，目标项目能正常渲染该页。
12. 单页重复插入两次，不出现 ID 冲突。
13. 全部插入后，目标项目页面数量正确。
14. 全部插入后，页面顺序与 JSON 中 `slides` 顺序一致。
15. 空文档插入全部时，theme 应用符合预期。
16. 非空文档插入全部时，是否覆盖 theme 符合预期。
17. 插入后撤销/重做符合目标项目已有规则。
18. 控制台没有资源 404。
19. 控制台没有 Vue key 重复警告或目标框架的重复 key 警告。
20. 部署到非根路径时，JSON 和 webp 路径仍然正确。

## 不建议做的事情

1. 不要完整复制 `Templates.vue` 后再逐个修报错。
2. 不要把 PPTist 的 `ThumbnailSlide` 当成普通图片组件迁移。
3. 不要在模板面板组件里直接写目标项目复杂 store 逻辑。
4. 不要插入模板原对象，必须深拷贝。
5. 不要跳过 ID 重建。
6. 不要为了适配 UI 改写原始 JSON 文件。
7. 不要把 `contents` 错写成 `content`。
8. 不要在读取 JSON 时吞掉异常，否则后续只会表现为空列表，难以定位。

## Codex 执行顺序

在目标项目中执行时，按以下顺序推进：

1. 阅读目标项目的目录结构、状态管理和页面类型定义。
2. 找到当前新增页面、替换页面、追加页面、设置主题的已有入口。
3. 找到或确认静态资源访问路径。
4. 新增模板读取服务。
5. 新增或复用模板元信息常量。
6. 新增模板选择面板组件。
7. 接入父级插入逻辑。
8. 实现深拷贝和 ID 重建。
9. 如数据结构不同，实现 adapter。
10. 运行类型检查和构建。
11. 启动开发服务器，人工验证模板切换和插入。
12. 根据目标项目 UI 风格微调样式。

## 给后续 Codex 的提醒

目标是“用 PPTist 模板数据驱动目标项目的模板插入能力”，不是“把 PPTist 编辑器搬过去”。

优先保证：

1. 数据加载正确。
2. 插入行为正确。
3. ID 不冲突。
4. 目标项目状态不被绕过。
5. UI 符合目标项目现有风格。

如果遇到缩略图渲染成本过高，先使用简化预览完成主链路，再单独处理真实缩略图渲染。

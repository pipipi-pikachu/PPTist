# AIPPT createPPT 调用链说明

本文档沿 `src/views/Editor/AIPPTDialog.vue` 中的 `createPPT()` 方法，整理从“用户确认大纲并点击生成”到“页面写入编辑器”的完整后续调用链。

## 入口位置

- 入口文件：`src/views/Editor/AIPPTDialog.vue`
- 入口方法：`createPPT(template?: { slides: Slide[], theme: SlideTheme })`
- 触发来源：
  - 用户在模板选择步骤点击“生成”按钮。
  - 用户上传 `.pptist` 本地模板后，`uploadLocalTemplate()` 解密模板并调用 `createPPT({ slides, theme })`。

## 总体流程

1. 打开加载状态，并把 AI PPT 弹窗状态置为 `running`。
2. 如果用户勾选“覆盖已有幻灯片”，调用 `resetSlides()` 清空当前文稿。
3. 调用 `api.AIPPT()` 请求后端生成结构化 PPT 数据流。
4. 如果选择测试配图，调用 `api.getMockData('imgs')` 读取模拟图片，并通过 `presetImgPool()` 注入图片池。
5. 读取模板数据：
   - 如果调用方传入本地模板，则直接使用本地模板。
   - 如果没有传入，则通过 `api.getMockData(selectedTemplate.value)` 读取预置模板。
6. 读取后端返回的 `ReadableStream`。
7. 每个流式文本分块按换行拆成 JSONL 行。
8. 每一行交给 `processChunk()` 清理代码块标记、修复 JSON、解析为 `AIPPTSlide`。
9. 调用 `AIPPT(templateSlides, [slide])` 将单页 AI 数据套入模板并写入当前文稿。
10. 流结束后关闭加载状态、关闭消息提示、关闭弹窗，并调用 `slidesStore.setTheme(templateTheme)` 写入模板主题。

## createPPT 内部关键状态

| 状态 | 来源 | 作用 |
| --- | --- | --- |
| `outline.value` | 大纲确认步骤 | 作为后端生成完整 PPT 的内容输入 |
| `language.value` | 设置步骤 | 控制 AI 输出语言 |
| `style.value` | 设置步骤 | 控制 AI 输出风格 |
| `model.value` | 设置步骤 | 控制后端使用的模型 |
| `img.value` | 设置步骤 | 控制是否加载模拟图片池 |
| `overwrite.value` | 设置步骤 | 控制生成前是否清空已有幻灯片 |
| `selectedTemplate.value` | 模板选择步骤 | 控制读取哪套预置模板 |

## 服务层调用

### api.AIPPT()

- 文件：`src/services/index.ts`
- 方法：`AIPPT({ content, language, style, model })`
- 请求地址：`${SERVER_URL}/tools/aippt`
- 请求方式：`POST`
- 请求体：

```json
{
  "content": "用户确认后的大纲内容",
  "language": "中文",
  "model": "glm-4.7-flash",
  "style": "通用",
  "stream": true
}
```

该方法不直接解析 PPT 页面，而是调用 `fetchRequest()` 保留流式响应能力。`createPPT()` 拿到返回值后，会判断是否是后端约定的并发错误对象：

```ts
if (typeof stream === 'object' && stream.state === -1) {
  // 关闭加载态，并提示用户更换模型重试。
}
```

### fetchRequest()

- 文件：`src/services/fetch.ts`
- 方法：`request(url, options)`
- 逻辑：
  - 使用浏览器 `fetch()` 发起请求。
  - 根据响应头 `content-type` 判断是否是流式响应。
  - `text/event-stream` 或 `application/octet-stream` 会返回原始 `Response`。
  - 非流式响应会尝试解析为 JSON。

`createPPT()` 依赖原始 `Response.body.getReader()`，所以后端必须返回可读流，否则后续读取会失败。

### api.getMockData()

- 文件：`src/services/index.ts`
- 方法：`getMockData(filename)`
- 作用：
  - `getMockData('imgs')`：读取测试图片池。
  - `getMockData(selectedTemplate.value)`：读取预置 PPT 模板数据。
- 路径规则：`./mocks/${filename}.json`

## 配图链路

当 `img.value === 'test'` 时，会执行：

```ts
const imgs = await api.getMockData('imgs')
presetImgPool(imgs)
```

### presetImgPool()

- 文件：`src/hooks/useAIPPT.ts`
- 方法：`presetImgPool(imgs)`
- 作用：把图片列表写入 `imgPool`。
- 后续使用点：
  - `AIPPT()` 遇到模板图片元素，且该元素有 `imageType` 标记时，会调用 `getNewImgElement()`。
  - `getNewImgElement()` 会从 `imgPool` 选图，并计算 cover 裁剪范围。
  - 已使用图片会从池中移除，减少重复。

## 模板链路

`createPPT()` 最终需要得到：

```ts
const templateSlides: Slide[] = templateData!.slides
const templateTheme: SlideTheme = templateData!.theme
```

### 本地模板

本地模板来自 `uploadLocalTemplate()`：

1. 创建临时 `<input type="file">`。
2. 限制选择 `.pptist` 文件。
3. 用 `FileReader` 读取文本。
4. 调用 `decrypt()` 解密文件内容。
5. `JSON.parse()` 得到 `{ slides, theme }`。
6. 调用 `createPPT({ slides, theme })`。

### 预置模板

预置模板来自 `api.getMockData(selectedTemplate.value)`，文件一般位于 `public/mocks/template_x.json`。

模板中的页面通过 `slide.type` 分成：

- `cover`：封面页
- `contents`：目录页
- `transition`：章节过渡页
- `content`：正文页
- `end`：结束页

模板中的元素通过 `textType` 或 `shape.text.type` 标记语义占位，例如：

- `title`
- `content`
- `item`
- `itemTitle`
- `itemNumber`
- `partNumber`

## 流式数据解析链路

`createPPT()` 内部通过 `readStream()` 递归读取响应流：

1. `reader.read()` 获取一个分块。
2. `decoder.decode(value, { stream: true })` 把二进制分块转为字符串。
3. `chunk.split(/\n+/)` 按换行拆分 JSONL。
4. 非空行调用 `processChunk(line)`。
5. 当前分块处理完后继续调用 `readStream()`。

### processChunk()

`processChunk(chunk)` 做三件事：

1. 清理模型可能返回的 Markdown 代码块标记：

```ts
chunk
  .replace('```jsonl', '')
  .replace('```json', '')
  .replace('```', '')
  .trim()
```

2. 用 `jsonrepair(text)` 修复轻微非法 JSON。
3. `JSON.parse()` 得到 `AIPPTSlide`，再调用：

```ts
AIPPT(templateSlides, [slide])
```

单行解析失败会被 `try/catch` 捕获，只打印错误，不中断后续流数据处理。

## AIPPT 套版链路

### AIPPT()

- 文件：`src/hooks/useAIPPT.ts`
- 方法：`AIPPT(templateSlides, _AISlides, imgs?)`
- 核心职责：把 AI 返回的结构化页面数据填进模板页，并写入当前文稿。

处理步骤：

1. 将当前页索引切到最后一页，保证追加生成时位置符合预期。
2. 如果调用方传入图片池，则覆盖内部 `imgPool`。
3. 预处理 AI 页面：
   - `content` 页面条目过多时拆成多页。
   - `contents` 页面目录过多时拆成多页。
   - 拆分后的页面会记录 `offset`，用于继续编号。
4. 按 `slide.type` 把模板分成封面、目录、过渡、正文、结束五类模板池。
5. 固定选择一个过渡页模板，保证同一次生成中的章节页风格一致。
6. 遍历 AI 页面，按页面类型套版：
   - 封面页：填充标题、正文、图片。
   - 目录页：选择适合目录项数量的模板，填充目录文本和编号，移除多余占位。
   - 过渡页：填充章节标题、章节说明和章节编号。
   - 正文页：选择适合内容项数量的模板，填充页面标题、条目标题、条目正文和编号。
   - 结束页：主要替换图片占位。
7. 为每个生成页调用 `nanoid(10)` 生成新页面 ID。
8. 根据当前文稿状态写入页面：
   - 空白文稿：`slidesStore.setSlides(slides)`
   - 非空文稿：`addSlidesFromData(slides)`

### getUseableTemplates()

- 文件：`src/hooks/useAIPPT.ts`
- 作用：根据内容条目数量，从模板池里选择最合适的模板。
- 关键规则：
  - 单条正文优先选“标题 + 正文”的模板。
  - 多条内容优先选占位数量大于等于内容数量且最接近的模板。
  - 如果没有模板能容纳全部内容，则选占位数量最多的模板作为降级方案。

### getNewTextElement()

- 文件：`src/hooks/useAIPPT.ts`
- 作用：把 AI 文本写入模板文本占位，并按占位框大小自动调整字号。
- 关键逻辑：
  - 读取模板原始 HTML 内容。
  - 用 `DOMParser` 找到第一个文本节点并替换。
  - 删除后续文本节点，避免模板占位残留。
  - 通过 `getAdaptedFontsize()` 计算不会溢出的字号。
  - 返回新的文本元素或形状文本元素。

### getNewImgElement()

- 文件：`src/hooks/useAIPPT.ts`
- 作用：把图片池里的图片填入模板图片占位。
- 关键逻辑：
  - `getUseableImage()` 根据占位比例优先选择横图、竖图或方图。
  - 根据图片比例和占位比例计算 cover 裁剪范围。
  - 保留模板原有裁剪形状。

## 页面写入链路

### 空白文稿：slidesStore.setSlides()

- 文件：`src/store/slides.ts`
- 方法：`setSlides(slides, themeProps?)`
- 作用：直接用生成页面替换当前页面列表。
- 场景：当前文稿只有一张空白页。
- 注意：如果传入 `themeProps`，会同步调用 `setTheme(themeProps)`。

### 非空文稿：addSlidesFromData()

- 文件：`src/hooks/useAddSlidesOrElements.ts`
- 方法：`addSlidesFromData(slides)`
- 作用：把生成页面追加到当前文稿，同时重建 ID。
- 关键处理：
  - 生成页面 ID 映射，避免与现有页面冲突。
  - 生成元素 ID 和组合 ID 映射。
  - 重写页面跳转链接，如果目标页不在本次新增页面中，则删除该链接。
  - 重建动画 ID，并把动画绑定元素改写为新元素 ID。
  - 调用 `slidesStore.addSlide(newSlides)` 插入页面。
  - 调用 `addHistorySnapshot()` 写入撤销历史。

### slidesStore.addSlide()

- 文件：`src/store/slides.ts`
- 作用：把一个或多个页面插入到当前页之后。
- 注意：
  - 插入前会删除页面上的 `sectionTag`，避免外部页面直接带入章节标记。
  - 插入后 `slideIndex` 会更新为插入起点。

### slidesStore.setTheme()

- 文件：`src/store/slides.ts`
- 调用位置：`createPPT()` 流结束后。
- 作用：把模板主题合并进当前演示文稿主题。
- 注意：该动作发生在页面生成结束后，确保文稿全局主题和模板视觉风格一致。

## 边界与潜在风险

1. `createPPT()` 假设 `stream.body` 一定存在。如果服务端返回普通 JSON 且不是并发错误对象，`stream.body.getReader()` 会失败。
2. `processChunk()` 按换行拆 JSONL。如果单个 JSON 被服务端拆在两个网络分块里，当前实现可能出现单行解析失败，但不会中断整体流程。
3. `templateData!` 使用非空断言。如果模板文件缺失、字段缺失或 mock 数据异常，会在读取 `slides/theme` 时抛错。
4. `AIPPT()` 假设各类型模板池都有可用模板。如果某类模板为空，随机取模板会得到 `undefined` 并导致后续访问失败。
5. 图片池为空时图片占位会保留模板原图，不会阻断 PPT 生成。
6. JSON 修复只适合轻微格式错误，无法保证所有模型输出都可恢复。
7. 本地模板目前只做解密和 JSON 解析，没有完整 schema 校验。

## 调用链速查

```text
AIPPTDialog.createPPT()
  ├─ useSlideHandler.resetSlides()
  │   └─ slidesStore.setSlides([emptySlide])
  ├─ api.AIPPT()
  │   └─ fetchRequest()
  ├─ api.getMockData('imgs')
  │   └─ axios.get('./mocks/imgs.json')
  ├─ useAIPPT.presetImgPool()
  ├─ api.getMockData(selectedTemplate)
  │   └─ axios.get('./mocks/template_x.json')
  ├─ ReadableStreamDefaultReader.read()
  ├─ processChunk()
  │   ├─ jsonrepair()
  │   ├─ JSON.parse()
  │   └─ useAIPPT.AIPPT()
  │       ├─ getUseableTemplates()
  │       ├─ getNewTextElement()
  │       │   ├─ getFontInfo()
  │       │   └─ getAdaptedFontsize()
  │       ├─ getNewImgElement()
  │       │   └─ getUseableImage()
  │       ├─ slidesStore.setSlides()
  │       └─ useAddSlidesOrElements.addSlidesFromData()
  │           └─ slidesStore.addSlide()
  └─ slidesStore.setTheme()
```

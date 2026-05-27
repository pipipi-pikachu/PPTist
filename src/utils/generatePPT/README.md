# generatePPT 使用说明手册

## 1. 模块用途

`generatePPT` 目录提供了一个独立的 AI PPT 生成与上传方法：

```ts
handleGenerateAIPPTSlides(payload)
```

它会完成以下流程：

1. 解析父项目或业务前端传入的 AI 页面内容。
2. 按 `templateId` 读取 `./mocks/${templateId}.json` 模板 JSON。
3. 使用模板 `theme` 和 `payload.theme` 合并后的主题生成 `.pptx` 文件。
4. 使用 `fetch + FormData` 上传生成后的 PPTX 文件。
5. 返回上传后的文件信息和生成页数。

当前实现不依赖 `iframeBridge.ts`，也不依赖 PPTist 的编辑器 store、导出 hook 或其他业务模块。

## 2. 运行依赖

前端项目需要安装：

```bash
pnpm add pptxgenjs@^3.12.0
```

同时运行环境需要支持浏览器标准 API：

- `Blob`
- `File`
- `fetch`
- `FormData`
- `URLSearchParams`

## 3. 模板 JSON 来源

模板文件不需要放在 `generatePPT` 目录里。新项目只要保证以下路径可以被浏览器访问：

```txt
public/mocks/template_1.json
public/mocks/template_2.json
public/mocks/template_8.json
```

调用时：

```ts
templateId: 'template_1'
```

模块会读取：

```txt
./mocks/template_1.json
```

不传 `templateId` 时默认读取：

```txt
./mocks/template_1.json
```

## 4. 快速接入

```ts
import { handleGenerateAIPPTSlides } from '@/utils/generatePPT'

const result = await handleGenerateAIPPTSlides({
  logId: 10001,
  title: '科技创新主题汇报',
  templateId: 'template_1',
  content: [
    {
      type: 'cover',
      data: {
        title: '科技创新主题汇报',
        text: '战略路径、重点方向与落地措施',
      },
    },
    {
      type: 'contents',
      data: {
        items: ['背景分析', '核心方向', '实施路径'],
      },
    },
    {
      type: 'end',
    },
  ],
  uploadUrl: '/api/file/upload',
  token: 'your-token',
})

console.log(result)
```

## 5. 入参说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `logId` | `string \| number` | 是 | 任务唯一标识，返回结果会原样带回。 |
| `content` | `string \| AIPPTSlide[]` | 是 | AI 生成的页面内容。 |
| `templateId` | `string \| number` | 否 | 模板 JSON 文件名，不传时默认读取 `./mocks/template_1.json`。 |
| `templateSlides` | `unknown[]` | 否 | 父项目直接传入的模板页；存在时优先使用它，不再请求模板 JSON。 |
| `title` | `string` | 否 | 生成文件名，不传时使用 `AI生成PPT.pptx`。 |
| `theme` | `GeneratePPTTheme` | 否 | 主题配置，会覆盖模板 JSON 中的同名 theme 字段。 |
| `imgs` | `AIPPTImagePoolItem[]` | 否 | 图片池，用于封面和正文页配图。 |
| `uploadUrl` | `string` | 否 | 上传接口地址，不传时使用默认上传地址。 |
| `token` | `string` | 否 | 上传鉴权 token。 |
| `parentToken` | `string` | 否 | 兼容 iframe 场景的上传鉴权 token。 |

## 6. content 支持格式

支持数组、JSON 数组字符串、连续 JSON 对象字符串。

```txt
{"type":"cover","data":{"title":"标题","text":"副标题"}}

{"type":"contents","data":{"items":["第一部分","第二部分"]}}

{"type":"end"}
```

## 7. 上传接口约定

上传请求使用：

```txt
POST uploadUrl
Content-Type: multipart/form-data
字段名: files
```

如果传入 `token` 或 `parentToken`，请求会自动添加：

```txt
Authorization: Bearer <token>
```

推荐后端返回格式：

```json
{
  "code": 200,
  "data": [
    {
      "attaId": 54531,
      "name": "科技创新主题汇报.pptx",
      "url": "upload/2026/05/26/demo.pptx",
      "path": "upload/2026/05/26/demo.pptx"
    }
  ]
}
```

## 8. 只生成 PPTX 不上传

```ts
import { createAIPPTFile } from '@/utils/generatePPT/pptx'
import { parseAIPPTSlides } from '@/utils/generatePPT/parse'

const aiSlides = parseAIPPTSlides(content)

const { file, slideCount } = await createAIPPTFile(aiSlides, {
  fileName: '测试PPT',
  theme,
  imgs: [],
  templateId: 'template_1',
  templateSlides: [],
})
```

`file` 就是生成好的 `.pptx` 浏览器 `File` 对象。

## 9. 重要限制

- 当前实现会读取模板 JSON 的 `theme` 参与生成。
- 当前还不是完整复刻 PPTist 模板元素套版，页面布局仍由 `pptx.ts` 内置渲染函数生成。
- `templateSlides` 当前会被读取和传递，但还没有完整转换为 pptxgenjs 元素。
- 图片 URL 是否能写入 PPTX 取决于浏览器可访问性、跨域策略和图片格式。

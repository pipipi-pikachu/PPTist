<template>
  <div class="generate-ppt-test">
    <header class="test-header">
      <div>
        <h1>generatePPT 测试页</h1>
        <p>/test</p>
      </div>
      <div class="status" :class="running ? 'running' : 'idle'">
        {{ running ? '运行中' : '空闲' }}
      </div>
    </header>

    <section class="panel">
      <div class="field-row">
        <label>
          <span>模板 ID</span>
          <input v-model="templateId" />
        </label>
        <label>
          <span>文件标题</span>
          <input v-model="title" />
        </label>
      </div>

      <div class="field-row">
        <label>
          <span>上传地址</span>
          <input v-model="uploadUrl" />
        </label>
        <label>
          <span>Token</span>
          <input v-model="token" />
        </label>
      </div>

      <div class="actions">
        <button :disabled="running" @click="handleCreatePPTXOnly">
          生成 PPTX 不上传
        </button>
        <button :disabled="running" @click="handleGenerateAndUpload">
          完整生成并上传
        </button>
        <button :disabled="running" @click="resetLog">
          清空日志
        </button>
      </div>

      <a v-if="downloadUrl" class="download-link" :href="downloadUrl" :download="downloadFileName">
        下载最近生成的 PPTX
      </a>
    </section>

    <section class="panel">
      <h2>测试日志</h2>
      <pre>{{ logText }}</pre>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { handleGenerateAIPPTSlides } from '@/utils/generatePPT'
import { mockArrayContentGeneratePayload } from '@/utils/generatePPT/mockData'
import { parseAIPPTSlides } from '@/utils/generatePPT/parse'
import { createAIPPTFile } from '@/utils/generatePPT/pptx'
import { resolveGeneratePPTTemplate } from '@/utils/generatePPT/template'

/**
 * 测试页单条日志结构。
 *
 * 字段说明：
 * - time：日志产生时间，便于确认异步步骤先后顺序。
 * - message：人类可读的步骤说明。
 * - data：可选的调试数据，通常记录模板页数、文件名、文件大小或接口返回值。
 */
interface TestLogItem {
  time: string
  message: string
  data?: unknown
}

/**
 * running 表示当前是否有生成任务正在执行。
 *
 * 用途说明：
 * - 生成 PPTX 和上传都是异步操作，运行期间禁用按钮，避免重复点击导致多个任务并发。
 * - 该状态只影响测试页，不会写入主编辑器 store。
 */
const running = ref(false)

/**
 * templateId 是本次测试读取的模板 JSON 文件名。
 *
 * 边界说明：
 * - `template_1` 会读取 `./mocks/template_1.json`。
 * - 如果输入不存在的模板 ID，模板读取阶段会抛出 404 错误并写入日志。
 */
const templateId = ref('template_1')

/**
 * title 是生成 PPTX 的文件标题。
 *
 * 说明：
 * - 不需要手写 `.pptx` 后缀，generatePPT 内部会自动补齐。
 * - 当前测试页允许用户直接修改，方便验证文件名处理逻辑。
 */
const title = ref('generatePPT 测试文件')

/**
 * uploadUrl 是完整生成并上传时使用的接口地址。
 *
 * 注意事项：
 * - “生成 PPTX 不上传”按钮不会使用该字段。
 * - 如果本地后端没有启动，点击“完整生成并上传”会在上传阶段报错，这是正常验证结果。
 */
const uploadUrl = ref('https://localhost:8802/iccServer/file/upload')

/**
 * token 是上传鉴权令牌。
 *
 * 边界说明：
 * - 空字符串表示不携带 Authorization 请求头。
 * - 如果输入 Bearer 前缀，upload.ts 会统一去重并重新拼接。
 */
const token = ref('')

/**
 * logs 保存测试页操作日志。
 *
 * 用途说明：
 * - 每个异步步骤都会追加一条日志，便于定位是模板读取、PPTX 生成还是上传阶段出错。
 * - 日志仅存在内存中，刷新页面后会清空。
 */
const logs = ref<TestLogItem[]>([])

/**
 * downloadUrl 保存最近一次“只生成不上传”得到的 Blob URL。
 *
 * 内存说明：
 * - Blob URL 会占用浏览器内存。
 * - 每次生成新文件前和页面卸载时都会 revoke，避免测试多次后泄漏。
 */
const downloadUrl = ref('')

/**
 * downloadFileName 保存最近一次生成的 PPTX 文件名。
 *
 * 说明：
 * - 该值来自 File.name。
 * - 只有成功生成 PPTX 后才会更新。
 */
const downloadFileName = ref('generatePPT-test.pptx')

/**
 * logText 是用于页面展示的日志文本。
 *
 * 设计说明：
 * - 使用 computed 避免每次模板重新渲染时重复手工拼接。
 * - data 使用 JSON.stringify 格式化，便于直接复制日志排查。
 */
const logText = computed(() => {
  /**
   * 空日志兜底：
   * - 初次打开页面时提示用户可点击按钮开始测试。
   * - 该文本只属于测试页，不影响正式业务。
   */
  if (!logs.value.length) return '暂无日志，点击上方按钮开始测试。'

  /**
   * 遍历日志数组并转成多行文本。
   *
   * 循环变量说明：
   * - item 是单条日志。
   * - dataText 是可选数据的 JSON 文本，没有数据时为空字符串。
   */
  return logs.value.map(item => {
    const dataText = item.data === undefined ? '' : `\n${JSON.stringify(item.data, null, 2)}`
    return `[${item.time}] ${item.message}${dataText}`
  }).join('\n\n')
})

/**
 * 追加一条测试日志。
 *
 * @param message - 当前步骤说明。
 * @param data - 可选调试数据。
 */
const appendLog = (message: string, data?: unknown) => {
  /**
   * now 保存日志时间。
   *
   * 说明：
   * - 使用本地时间即可，测试页只需要观察相对顺序。
   * - 不使用 Date 对象直接展示，避免页面出现过长时间字符串。
   */
  const now = new Date().toLocaleTimeString()

  logs.value.unshift({
    time: now,
    message,
    data,
  })
}

/**
 * 读取文件头部字节，用于判断 PPTX 是否像一个有效 ZIP 包。
 *
 * @param file - generatePPT 生成出来的 PPTX File。
 * @returns 文件前 4 个字节的十六进制和 ASCII 展示。
 */
const readFileSignature = async (file: File) => {
  /**
   * buffer 保存文件前 4 个字节。
   *
   * 判断依据：
   * - PPTX 本质是 ZIP 包。
   * - ZIP 文件头通常以 `PK` 开头，对应十六进制 `50 4B`。
   */
  const buffer = await file.slice(0, 4).arrayBuffer()

  /**
   * bytes 是便于遍历和格式化的字节数组。
   *
   * 说明：
   * - Uint8Array 不会复制整个文件，只包装这 4 个字节的 ArrayBuffer。
   * - 只读文件头，避免大文件造成额外内存压力。
   */
  const bytes = Array.from(new Uint8Array(buffer))

  /**
   * hex 是文件头十六进制文本。
   *
   * 用途说明：
   * - 正常 PPTX 应该类似 `50 4b 03 04`。
   * - 如果这里不是 `50 4b` 开头，说明生成或包装环节有问题。
   */
  const hex = bytes.map(byte => byte.toString(16).padStart(2, '0')).join(' ')

  /**
   * ascii 是文件头 ASCII 文本。
   *
   * 用途说明：
   * - 正常 PPTX 开头会显示 `PK`。
   * - 该字段方便不熟悉十六进制时快速判断。
   */
  const ascii = bytes.map(byte => String.fromCharCode(byte)).join('')

  return {
    hex,
    ascii,
    isZipLike: bytes[0] === 0x50 && bytes[1] === 0x4b,
  }
}

/**
 * 释放当前下载链接。
 *
 * 用途说明：
 * - 创建新的 Blob URL 前先释放旧 URL。
 * - 页面卸载时也会调用，避免浏览器继续持有旧文件内存。
 */
const revokeDownloadUrl = () => {
  /**
   * URL 存在性判断：
   * - 空字符串表示当前没有可释放 URL。
   * - revokeObjectURL 只能处理 createObjectURL 创建出的地址。
   */
  if (!downloadUrl.value) return

  URL.revokeObjectURL(downloadUrl.value)
  downloadUrl.value = ''
}

/**
 * 构造当前测试使用的 payload。
 *
 * @returns generatePPT 可直接使用的测试 payload。
 */
const createPayload = () => {
  /**
   * payload 基于 mockArrayContentGeneratePayload 创建浅拷贝。
   *
   * 说明：
   * - mock 中包含完整 content，可以减少测试页重复定义大段 AI 数据。
   * - 页面输入项会覆盖模板 ID、标题、上传地址和 token。
   */
  const payload = {
    ...mockArrayContentGeneratePayload,
    logId: `test-${Date.now()}`,
    title: title.value,
    templateId: templateId.value,
    uploadUrl: uploadUrl.value,
    token: token.value,
  }

  return payload
}

/**
 * 只验证模板读取和 PPTX 生成，不调用上传接口。
 *
 * @returns 无显式返回值。
 */
const handleCreatePPTXOnly = async () => {
  /**
   * 并发保护：
   * - 如果已有任务运行，直接返回。
   * - 按钮正常会被 disabled，这里再防一次键盘或脚本触发。
   */
  if (running.value) return

  running.value = true
  revokeDownloadUrl()

  try {
    /**
     * payload 是本次测试任务入参。
     *
     * 说明：
     * - 包含 mock content。
     * - 包含当前页面选择的 templateId。
     */
    const payload = createPayload()
    appendLog('开始读取模板 JSON', {
      templateId: payload.templateId,
      path: `./mocks/${payload.templateId}.json`,
    })

    /**
     * templateContext 是模板读取结果。
     *
     * 验证点：
     * - 能否成功访问 public/mocks 下的模板 JSON。
     * - 能否拿到 theme 和 slides 数量。
     */
    const templateContext = await resolveGeneratePPTTemplate(payload)
    appendLog('模板读取成功', {
      templateId: templateContext.templateId,
      source: templateContext.source,
      slidesCount: templateContext.slides.length,
      hasTheme: !!templateContext.theme,
    })

    /**
     * aiSlides 是解析后的 AI 页面数组。
     *
     * 说明：
     * - parseAIPPTSlides 会兼容数组、JSON 字符串和连续 JSON 对象字符串。
     * - 当前 mock 使用数组格式。
     */
    const aiSlides = parseAIPPTSlides(payload.content)
    appendLog('AI 页面解析成功', {
      slideCount: aiSlides.length,
    })

    /**
     * generated 是 PPTX 文件生成结果。
     *
     * 注意：
     * - 这里不会上传接口，只生成浏览器 File。
     * - 生成成功后创建 Blob URL，页面提供下载链接。
     */
    const generated = await createAIPPTFile(aiSlides, {
      fileName: payload.title,
      theme: templateContext.theme,
      imgs: payload.imgs,
      templateId: templateContext.templateId,
      templateSlides: templateContext.slides,
      template: templateContext.template,
    })

    downloadFileName.value = generated.file.name
    downloadUrl.value = URL.createObjectURL(generated.file)

    /**
     * signature 是 PPTX 文件头检查结果。
     *
     * 验证目的：
     * - 如果 PowerPoint 打不开文件，可以先看这里是否是 ZIP/PPTX 文件头。
     * - 正常情况下 `isZipLike` 应为 true。
     */
    const signature = await readFileSignature(generated.file)

    appendLog('PPTX 生成成功，可以点击下载链接验证文件', {
      fileName: generated.file.name,
      fileSize: generated.file.size,
      slideCount: generated.slideCount,
      signature,
    })
  }
  catch (error) {
    /**
     * 错误处理：
     * - 捕获模板读取、内容解析或 PPTX 生成任意阶段异常。
     * - 使用 String(error) 保证 Error 对象和普通抛出值都能展示。
     */
    appendLog('生成 PPTX 失败', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
  finally {
    /**
     * finally 恢复运行状态。
     *
     * 说明：
     * - 无论成功还是失败，都允许用户再次点击按钮测试。
     */
    running.value = false
  }
}

/**
 * 验证完整链路：模板读取、PPTX 生成和上传。
 *
 * @returns 无显式返回值。
 */
const handleGenerateAndUpload = async () => {
  /**
   * 并发保护：
   * - 避免重复点击造成多个上传任务。
   * - 上传接口如果不支持并发，同一文件多次提交可能导致后端脏数据。
   */
  if (running.value) return

  running.value = true

  try {
    /**
     * payload 是完整生成并上传链路的入参。
     *
     * 说明：
     * - handleGenerateAIPPTSlides 内部会再次读取模板 JSON。
     * - 上传地址和 token 来自页面输入。
     */
    const payload = createPayload()
    appendLog('开始完整生成并上传', {
      logId: payload.logId,
      templateId: payload.templateId,
      uploadUrl: payload.uploadUrl,
    })

    /**
     * result 是上传成功后的回包。
     *
     * 验证点：
     * - file.id / file.url / fileName 是否符合后端接口预期。
     * - slideCount 是否等于生成页面数量。
     */
    const result = await handleGenerateAIPPTSlides(payload)
    appendLog('完整生成并上传成功', result)
  }
  catch (error) {
    /**
     * 错误处理：
     * - 上传地址不可达、token 失效或后端返回非 200 都会进入这里。
     * - 错误日志保留在页面上，便于直接截图或复制。
     */
    appendLog('完整生成并上传失败', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
  finally {
    running.value = false
  }
}

/**
 * 清空测试日志。
 *
 * @returns 无显式返回值。
 */
const resetLog = () => {
  /**
   * 只清空日志，不释放下载链接。
   *
   * 设计说明：
   * - 用户可能想清理日志后继续下载刚生成的文件。
   * - 下载链接释放由下一次生成或页面卸载负责。
   */
  logs.value = []
}

/**
 * 页面卸载时释放 Blob URL。
 *
 * 说明：
 * - 测试页可能反复进入和离开。
 * - 释放 URL 可以避免较大的 PPTX 文件常驻内存。
 */
onBeforeUnmount(() => {
  revokeDownloadUrl()
})
</script>

<style scoped>
.generate-ppt-test {
  min-height: 100%;
  padding: 32px;
  background: #f6f7f9;
  color: #1f2937;
  font-family: Arial, "Microsoft YaHei", sans-serif;
}

.test-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1080px;
  margin: 0 auto 20px;
}

.test-header h1 {
  margin: 0;
  font-size: 24px;
}

.test-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.status {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
}

.status.idle {
  background: #e7f8ef;
  color: #087443;
}

.status.running {
  background: #fff7e6;
  color: #9a5b00;
}

.panel {
  max-width: 1080px;
  margin: 0 auto 16px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

label span {
  display: block;
  margin-bottom: 6px;
  color: #475569;
  font-size: 13px;
}

input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
}

input:focus {
  border-color: #2563eb;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.download-link {
  display: inline-block;
  margin-top: 14px;
  color: #2563eb;
}

h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

pre {
  min-height: 240px;
  margin: 0;
  padding: 14px;
  overflow: auto;
  border-radius: 6px;
  background: #0f172a;
  color: #dbeafe;
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-wrap;
}

@media (max-width: 720px) {
  .generate-ppt-test {
    padding: 18px;
  }

  .test-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>

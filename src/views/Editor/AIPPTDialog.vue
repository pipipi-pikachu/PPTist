<template>
  <!-- AI PPT 生成弹窗根容器：根据 step 状态在“主题输入 / 大纲确认 / 模板选择”三步之间切换。 -->
  <div class="aippt-dialog">
    <!-- 顶部标题与阶段说明：说明文字会跟随当前生成流程动态变化。 -->
    <div class="header">
      <span class="title">AIPPT</span>
      <span class="subtite" v-if="step === 'template'">从下方挑选合适的模板生成PPT，或<span class="local" v-tooltip="'上传.pptist格式模板文件'" @click="uploadLocalTemplate()">使用本地模板生成</span></span>
      <span class="subtite" v-else-if="step === 'outline'">确认下方内容大纲（点击编辑内容，右键添加/删除大纲项），开始选择模板</span>
      <span class="subtite" v-else>在下方输入您的PPT主题，并适当补充信息，如行业、岗位、学科、用途等</span>
    </div>
    
    <!-- 第一步：输入主题、选择生成配置，并允许在非空演示文稿中选择是否覆盖已有幻灯片。 -->
    <template v-if="step === 'setup'">
      <Input class="input" 
        ref="inputRef"
        v-model:value="keyword" 
        :maxlength="50" 
        placeholder="请输入PPT主题，如：大学生职业生涯规划" 
        @enter="createOutline()"
      >
        <template #suffix>
          <span class="count">{{ keyword.length }} / 50</span>
          <div class="submit" type="primary" @click="createOutline()"><i-icon-park-outline:send class="icon" /> AI 生成</div>
        </template>
      </Input>
      <!-- 推荐主题快捷入口：点击后会写入输入框并重新聚焦，方便用户基于示例继续编辑。 -->
      <div class="recommends">
        <div class="recommend" v-for="(item, index) in recommends" :key="index" @click="setKeyword(item)">{{ item }}</div>
      </div>
      <!-- 基础生成配置：语言、风格、模型和配图策略会作为 AI 生成参数传给后端服务。 -->
      <div class="configs">
        <div class="config-item">
          <div class="label">语言：</div>
          <Select 
            class="config-content"
            style="width: 80px;"
            v-model:value="language"
            :options="[
              { label: '中文', value: '中文' },
              { label: '英文', value: 'English' },
              { label: '日文', value: '日本語' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">风格：</div>
          <Select 
            class="config-content"
            style="width: 80px;"
            v-model:value="style"
            :options="[
              { label: '通用', value: '通用' },
              { label: '学术风', value: '学术风' },
              { label: '职场风', value: '职场风' },
              { label: '教育风', value: '教育风' },
              { label: '营销风', value: '营销风' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">模型：</div>
          <Select 
            class="config-content"
            style="width: 190px;"
            v-model:value="model"
            :options="[
              { label: 'GLM-4.7-Flash', value: 'glm-4.7-flash' },
              { label: 'Doubao-Seed-1.6-Flash', value: 'doubao-seed-1.6-flash' },
            ]"
          />
        </div>
        <div class="config-item">
          <div class="label">配图：</div>
          <Select 
            class="config-content"
            style="width: 100px;"
            v-model:value="img"
            :options="[
              { label: '无', value: '' },
              { label: '模拟测试', value: 'test' },
              { label: 'AI搜图', value: 'ai-search', disabled: true },
              { label: 'AI生图', value: 'ai-create', disabled: true },
            ]"
          />
        </div>
      </div>
      <div class="configs" v-if="!isEmptySlide">
        <div class="config-item">
          <Checkbox v-model:value="overwrite">覆盖已有幻灯片</Checkbox>
        </div>
      </div>
    </template>
    <!-- 第二步：展示 AI 生成的大纲；生成中用 pre 实时滚动展示，完成后切换为可编辑大纲组件。 -->
    <div class="preview" v-if="step === 'outline'">
      <pre ref="outlineRef" v-if="outlineCreating">{{ outline }}</pre>
       <div class="outline-view" v-else>
         <OutlineEditor v-model:value="outline" />
       </div>
      <div class="btns" v-if="!outlineCreating">
        <Button class="btn" type="primary" @click="step = 'template'">选择模板</Button>
        <Button class="btn" @click="outline = ''; step = 'setup'">返回重新生成</Button>
      </div>
    </div>
    <!-- 第三步：选择模板封面并触发最终 PPT 生成；也支持返回上一阶段继续调整大纲。 -->
    <div class="select-template" v-if="step === 'template'">
      <div class="templates">
        <div class="template" 
          :class="{ 'selected': selectedTemplate === template.id }" 
          v-for="template in templates" 
          :key="template.id" 
          @click="selectedTemplate = template.id"
        >
          <img :src="template.cover" :alt="template.name">
        </div>
      </div>
      <div class="btns">
        <Button class="btn" type="primary" @click="createPPT()">生成</Button>
        <Button class="btn" @click="step = 'outline'">返回大纲</Button>
      </div>
    </div>

    <!-- 全屏加载层：覆盖大纲和 PPT 生成期间的等待状态，避免用户重复触发。 -->
    <FullscreenSpin :loading="loading" tip="AI生成中，请耐心等待 ..." />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { jsonrepair } from 'jsonrepair'
import api from '@/services'
import useAIPPT from '@/hooks/useAIPPT'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { AIPPTSlide } from '@/types/AIPPT'
import type { Slide, SlideTheme } from '@/types/slides'
import message from '@/utils/message'
import { decrypt } from '@/utils/crypto'
import { useMainStore, useSlidesStore } from '@/store'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import OutlineEditor from '@/components/OutlineEditor.vue'
import Checkbox from '@/components/Checkbox.vue'

/**
 * AI PPT 生成弹窗调试日志前缀。
 *
 * 功能描述：
 * - 统一 AIPPTDialog 内大纲生成、模板选择、流式生成和页面解析日志。
 * - 方便验证从用户点击生成到实际写入 slides 的完整流程。
 *
 * 入参：
 * - 常量没有入参。
 *
 * 返回值：
 * - 常量没有返回值。
 *
 * 异常：
 * - 常量定义不会抛出异常。
 *
 * 注意事项：
 * - 日志只打印内容长度和结构摘要，不打印完整大纲或完整 AI 输出。
 */
const AIPPT_DIALOG_DEBUG_PREFIX = '[PPTist AIPPTDialog]'

/**
 * AIPPTDialog 组件负责串联 AI 生成 PPT 的完整交互流程。
 *
 * 功能描述：
 * - 第一步收集用户主题、语言、风格、模型和配图配置。
 * - 第二步通过流式接口生成 Markdown 大纲，并允许用户二次编辑。
 * - 第三步选择预置模板或本地模板，并根据 AI 返回的 JSONL 数据逐页生成幻灯片。
 *
 * 入参：
 * - 本组件为 `<script setup>` 单文件组件，没有显式 props 入参。
 *
 * 返回值：
 * - Vue SFC 组件实例由编译器隐式生成，无显式函数返回值。
 *
 * 异常：
 * - 接口并发异常会通过 `stream.state === -1` 分支提示用户。
 * - AI 返回内容 JSON 修复或解析失败时，会打印错误并继续等待下一段流数据。
 * - 本地模板解密或 JSON 解析失败时，会提示用户模板文件异常。
 *
 * 注意事项：
 * - `ReadableStream` 的读取是递归异步过程，必须在 `done` 后恢复 UI 状态。
 * - `inputRef.value!` 依赖输入组件已挂载，当前通过 `onMounted + setTimeout` 延迟聚焦。
 * - 该组件只负责生成流程编排，具体幻灯片落版逻辑由 `useAIPPT()` 提供。
 */

/** 主应用状态仓库：用于控制 AIPPT 弹窗整体状态，例如运行中、关闭或恢复打开。 */
const mainStore = useMainStore()
/** 幻灯片状态仓库：用于读取模板列表，并在生成完成后写入主题配置。 */
const slidesStore = useSlidesStore()
/** 模板列表响应式引用：保持与 Pinia store 内模板数据同步，供模板选择区渲染。 */
const { templates } = storeToRefs(slidesStore)

/** 幻灯片处理工具：`resetSlides` 用于覆盖生成前清空页面，`isEmptySlide` 用于判断是否展示覆盖选项。 */
const { resetSlides, isEmptySlide } = useSlideHandler()
/** AI PPT 生成工具：负责套用模板、预置图片池，以及从模型输出中提取 Markdown 正文。 */
const { AIPPT, presetImgPool, getMdContent } = useAIPPT()

/** 输出语言配置：默认中文，会传递给大纲生成和 PPT 内容生成接口。 */
const language = ref('中文')
/** PPT 内容风格配置：默认通用，用于影响最终页面文案和表达方式。 */
const style = ref('通用')
/** 配图模式配置：空字符串表示不主动配置图片，`test` 表示使用模拟图片池。 */
const img = ref('')
/** 用户输入的 PPT 主题关键词：作为大纲生成接口的核心输入内容。 */
const keyword = ref('')
/** AI 生成或用户编辑后的大纲内容：作为最终 PPT 生成接口的核心输入内容。 */
const outline = ref('')
/** 当前选中的模板 ID：默认使用第一套预置模板，点击模板卡片时更新。 */
const selectedTemplate = ref('template_1')
/** 全局加载状态：控制全屏加载遮罩展示，防止生成期间重复操作。 */
const loading = ref(false)
/** 大纲生成状态：为 true 时表示仍在接收流式 Markdown，大纲区域展示只读预览。 */
const outlineCreating = ref(false)
/** 覆盖已有幻灯片开关：为 true 时生成前会清空当前演示文稿。 */
const overwrite = ref(true)
/** 当前步骤状态：严格限制在主题设置、大纲确认、模板选择三个阶段之间流转。 */
const step = ref<'setup' | 'outline' | 'template'>('setup')
/** AI 模型配置：默认选择 GLM Flash 模型，并在接口请求中传给后端。 */
const model = ref('glm-4.7-flash')
/** 大纲预览 DOM 引用：用于流式输出时自动滚动到最新内容。 */
const outlineRef = useTemplateRef<HTMLElement>('outlineRef')
/** 输入框组件引用：用于弹窗打开后自动聚焦，以及点击推荐主题后恢复输入焦点。 */
const inputRef = useTemplateRef<InstanceType<typeof Input>>('inputRef')

/** 推荐主题列表：提供高频 PPT 主题示例，降低用户初次使用时的输入成本。 */
const recommends = ref([
  '2025科技前沿动态',
  '大数据如何改变世界',
  '餐饮市场调查与研究',
  'AIGC在教育领域的应用',
  '社交媒体与品牌营销',
  '5G技术如何改变我们的生活',
  '年度工作总结与展望',
  '区块链技术及其应用',
  '大学生职业生涯规划',
  '公司年会策划方案',
]) 

/**
 * 组件挂载后自动聚焦主题输入框。
 *
 * 功能描述：
 * - 延迟 500ms 聚焦，给弹窗过渡动画、子组件挂载和输入组件内部初始化留出时间。
 *
 * 入参：
 * - 无。
 *
 * 返回值：
 * - 无。
 *
 * 异常：
 * - 当前实现使用非空断言 `inputRef.value!`，如果输入组件未成功挂载会抛出运行时错误。
 *
 * 注意事项：
 * - 延迟聚焦是为了减少弹窗刚打开时 ref 尚未稳定导致的焦点失败问题。
 */
onMounted(() => {
  // 打印弹窗挂载状态，便于确认 AI PPT 入口是否成功打开。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'mounted', {
    // 当前步骤。
    step: step.value,
    // 默认模型。
    model: model.value,
    // 默认语言。
    language: language.value,
    // 默认风格。
    style: style.value,
  })
  // 使用定时器等待弹窗内容和 Input 子组件完成渲染，避免立即 focus 时 DOM 尚不可用。
  setTimeout(() => {
    // 聚焦主题输入框，让用户打开弹窗后可以直接输入或继续编辑推荐主题。
    inputRef.value!.focus()
  }, 500)
})

/**
 * 将推荐主题写入输入框并恢复焦点。
 *
 * @param value - 用户点击的推荐主题文本，会直接覆盖当前 `keyword` 内容。
 * @returns 无返回值；函数通过响应式状态更新输入框显示。
 * @throws 当 `inputRef.value` 不存在且调用 `focus()` 时，可能抛出运行时错误。
 * @remarks 该方法只改变输入框内容，不会自动触发 AI 生成，用户仍可继续编辑主题。
 */
const setKeyword = (value: string) => {
  // 将推荐项内容写入主题关键词，确保输入框和响应式状态保持一致。
  keyword.value = value
  // 打印推荐主题点击行为，帮助验证 UI 操作是否触发。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'setKeyword()', {
    // 推荐主题长度。
    keywordLength: value.length,
    // 推荐主题文本本身属于用户可见示例，这里保留用于调试。
    keyword: value,
  })
  // 点击推荐项后重新聚焦输入框，方便用户在推荐主题基础上继续补充细节。
  inputRef.value!.focus()
}

/**
 * 调用 AI 大纲接口并以流式方式写入大纲内容。
 *
 * 功能描述：
 * - 校验用户是否输入主题。
 * - 请求后端大纲生成接口。
 * - 持续读取 `ReadableStream`，把模型返回的文本片段追加到 `outline`。
 * - 流结束后提取 Markdown 正文、移除 HTML 注释，并切换到可编辑大纲状态。
 *
 * 入参：
 * - 无；函数直接读取 `keyword`、`language`、`model` 等响应式状态。
 *
 * 返回值：
 * - `Promise<void>`；异步流程完成后没有显式返回数据。
 *
 * 异常：
 * - 当模型接口返回并发限制状态时，会关闭加载态并提示用户更换模型。
 * - 当前函数没有捕获网络异常，调用方若需要统一兜底需在外层补充错误处理。
 *
 * 注意事项：
 * - `stream.body.getReader()` 假设接口返回值一定包含可读流；如果服务端协议变化会导致运行时错误。
 * - 递归读取流时必须在 `done` 分支 return，防止继续读取已经关闭的流。
 */
const createOutline = async () => {
  // 主题为空时直接阻断请求，避免向后端发送无意义的大纲生成任务。
  if (!keyword.value) return message.error('请先输入PPT主题')
  // 打印大纲生成开始，确认第一阶段 AI 接口链路是否触发。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createOutline:start', {
    // 主题长度。
    keywordLength: keyword.value.length,
    // 输出语言。
    language: language.value,
    // 模型。
    model: model.value,
  })

  // 打开全屏加载层，提示用户当前正在发起 AI 生成请求。
  loading.value = true
  // 标记大纲处于生成中，模板会使用 pre 实时展示流式文本。
  outlineCreating.value = true
  
  // 请求大纲生成接口；content 是主题，language 和 model 用于控制输出语言与模型供应方。
  const stream = await api.AIPPT_Outline({
    content: keyword.value,
    language: language.value,
    model: model.value,
  })
  // 后端用 `state === -1` 表示当前模型接口并发过高，此时没有可读流可继续处理。
  if (typeof stream === 'object' && stream.state === -1) {
    // 打印后端并发限制响应，方便区分网络失败和业务限流。
    console.warn(AIPPT_DIALOG_DEBUG_PREFIX, 'createOutline:concurrency limited', stream)
    // 关闭全屏加载层，避免错误提示出现后界面仍被遮罩阻塞。
    loading.value = false
    // 给用户明确的恢复动作：切换模型后重试。
    return message.error('该模型API的并发数过高，请更换其他模型重试')
  }

  // 请求已建立后关闭初始加载层，后续改由大纲区域展示流式输出。
  loading.value = false
  // 切换到大纲步骤，让用户能看到实时生成过程。
  step.value = 'outline'
  // 打印流式响应建立成功。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createOutline:stream opened', {
    // 是否存在响应体。
    hasBody: !!stream.body,
    // 当前步骤。
    step: step.value,
  })

  // 获取流式响应读取器，用于逐块读取后端返回的 UTF-8 字节数据。
  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  // 创建 UTF-8 解码器，将二进制流块转换为可拼接的文本片段。
  const decoder = new TextDecoder('utf-8')
  
  /**
   * 递归读取大纲响应流。
   *
   * @returns 无返回值；每次读取结果都会直接追加到 `outline`。
   * @throws 当前内部未捕获 `reader.read()` 异常，网络中断时可能进入未处理 Promise 拒绝。
   * @remarks 使用递归而不是循环，是为了在每个异步读取完成后再继续拉取下一段数据。
   */
  const readStream = () => {
    // 从响应流中读取下一段数据；`done` 表示服务端已经关闭本次大纲输出。
    reader.read().then(({ done, value }) => {
      // 流读取完成后，整理最终大纲文本并退出递归。
      if (done) {
        // 从模型可能返回的包裹内容中提取 Markdown 正文，减少后续编辑器解析噪音。
        outline.value = getMdContent(outline.value)
        // 移除模型输出中可能残留的 HTML 注释，避免展示给用户或影响最终生成内容。
        outline.value = outline.value.replace(/<!--[\s\S]*?-->/g, '')
        // 标记大纲生成结束，界面会从只读预览切换为可编辑的 OutlineEditor。
        outlineCreating.value = false
        // 打印大纲生成完成摘要。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createOutline:done', {
          // 最终大纲长度。
          outlineLength: outline.value.length,
          // 大纲行数。
          outlineLines: outline.value.split('\n').filter(Boolean).length,
        })
        return
      }
  
      // 将当前二进制分块按 UTF-8 解码；stream 模式可正确处理跨分块字符。
      const chunk = decoder.decode(value, { stream: true })
      // 追加最新文本片段到大纲内容，保持用户看到的预览与流式输出同步增长。
      outline.value += chunk
      // 打印大纲流式分块摘要。
      console.debug(AIPPT_DIALOG_DEBUG_PREFIX, 'createOutline:chunk', {
        // 当前分块长度。
        chunkLength: chunk.length,
        // 累计大纲长度。
        outlineLength: outline.value.length,
      })

      // 如果预览 DOM 已经渲染，则自动滚动到底部，确保最新生成内容始终可见。
      if (outlineRef.value) {
        // 额外增加 20px 偏移，避免最后一行贴底导致阅读不舒服。
        outlineRef.value.scrollTop = outlineRef.value.scrollHeight + 20
      }

      // 继续读取下一段流数据，直到服务端返回 done。
      readStream()
    })
  }
  // 启动第一次流读取，后续由 `readStream()` 自身递归推进。
  readStream()
}

/**
 * 根据大纲和模板生成完整 PPT。
 *
 * @param template - 可选的本地模板数据；包含幻灯片数组和主题配置。未传入时会读取当前选中的预置模板。
 * @returns `Promise<void>`；生成过程会直接写入幻灯片 store，不返回额外数据。
 * @throws 当前函数未统一捕获网络异常；模板数据为空或流协议异常时可能抛出运行时错误。
 * @remarks
 * - 当 `overwrite` 为 true 时会先清空已有幻灯片。
 * - 接口返回的是 JSONL 风格流数据，每一行代表一页或一段可解析的 AI PPT 页面数据。
 * - 单段 JSON 解析失败只会记录错误，不会中断整个流式生成流程。
 */
const createPPT = async (template?: { slides: Slide[], theme: SlideTheme }) => {
  // 打印最终 PPT 生成开始，确认点击模板页“生成”后进入核心流程。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:start', {
    // 当前大纲长度。
    outlineLength: outline.value.length,
    // 当前语言。
    language: language.value,
    // 当前风格。
    style: style.value,
    // 当前模型。
    model: model.value,
    // 配图模式。
    imgMode: img.value || 'none',
    // 是否覆盖已有幻灯片。
    overwrite: overwrite.value,
    // 是否传入本地模板。
    hasLocalTemplate: !!template,
    // 当前选中的预置模板 ID。
    selectedTemplate: selectedTemplate.value,
  })
  // 打开全屏加载层，阻止用户在生成过程中重复点击生成按钮。
  loading.value = true
  // 将弹窗状态标记为运行中，便于外层编辑器感知 AI 生成过程。
  mainStore.setAIPPTDialogState('running')
  // 展示全局 loading 消息；duration 为 0 表示需要手动关闭。
  message.loading('演示文稿生成中，请稍等 ...', { duration: 0 })

  // 如果用户选择覆盖生成，则先清空当前演示文稿，避免新旧页面混杂。
  if (overwrite.value) resetSlides()
  // 打印是否执行了覆盖清空。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:overwrite handled', {
    // 是否覆盖。
    overwrite: overwrite.value,
  })

  // 请求最终 PPT 内容生成接口；content 使用用户确认后的大纲而不是原始主题。
  const stream = await api.AIPPT({
    content: outline.value,
    language: language.value,
    style: style.value,
    model: model.value,
  })
  // 后端用 `state === -1` 表示模型接口并发过高，此时不能继续读取生成流。
  if (typeof stream === 'object' && stream.state === -1) {
    // 打印并发限制响应。
    console.warn(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:concurrency limited', stream)
    // 关闭全屏加载层，恢复用户可操作状态。
    loading.value = false
    // 关闭所有全局消息，避免并发错误后仍残留“生成中”提示。
    message.closeAll()
    // 将弹窗恢复为打开状态，让用户可以直接切换模型后再次生成。
    mainStore.setAIPPTDialogState(true)
    // 提示用户错误原因和可执行的解决方案。
    return message.error('该模型API的并发数过高，请更换其他模型重试')
  }

  // 测试配图模式下读取模拟图片数据，供后续 AIPPT 落版时从图片池中取图。
  if (img.value === 'test') {
    // 获取本地或 mock 服务中的图片列表，避免调用真实搜图或生图服务。
    const imgs = await api.getMockData('imgs')
    // 将图片列表预置到 AI PPT 生成工具中，后续页面生成可复用该图片池。
    presetImgPool(imgs)
    // 打印测试图片池数量。
    console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:test image pool loaded', {
      // 图片数量。
      imgsCount: Array.isArray(imgs) ? imgs.length : undefined,
    })
  }

  // 优先使用用户上传并解密得到的本地模板；没有传入时再读取预置模板。
  let templateData = template
  // 根据当前选中的模板 ID 获取 mock 模板数据，包含页面结构和主题样式。
  if (!templateData) templateData = await api.getMockData(selectedTemplate.value)
  // 模板幻灯片数组：作为 AI 内容落版时的版式参考。
  const templateSlides: Slide[] = templateData!.slides
  // 模板主题配置：生成完成后写入 slidesStore，保证颜色、字体等主题信息同步。
  const templateTheme: SlideTheme = templateData!.theme
  // 打印模板加载结果。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:template ready', {
    // 模板来源。
    templateSource: template ? 'local' : selectedTemplate.value,
    // 模板页数量。
    templateSlidesCount: templateSlides.length,
    // 模板主题字段。
    themeKeys: templateTheme ? Object.keys(templateTheme) : [],
  })

  // 获取 PPT 生成接口的流读取器，逐段接收模型输出的 JSONL 内容。
  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  // 使用 UTF-8 解码器把二进制响应分块转换为字符串。
  const decoder = new TextDecoder('utf-8')
  
  /**
   * 递归读取 PPT 页面生成流。
   *
   * @returns 无返回值；读取到的每行 JSON 会被立即转换并写入幻灯片。
   * @throws 当前内部未捕获 `reader.read()` 异常，网络断开时可能产生未处理 Promise 拒绝。
   * @remarks 流结束后会关闭加载态、关闭全局消息、关闭弹窗并设置模板主题。
   */
  const readStream = () => {
    // 读取下一段流数据；`done` 为 true 表示服务端已经输出完所有页面数据。
    reader.read().then(({ done, value }) => {
      // 流结束时执行收尾逻辑，恢复 UI 并应用模板主题。
      if (done) {
        // 关闭全屏加载层，允许用户继续编辑生成后的演示文稿。
        loading.value = false
        // 关闭“生成中”消息，避免结束后仍显示等待提示。
        message.closeAll()
        // 关闭 AI PPT 弹窗，回到编辑器主界面查看生成结果。
        mainStore.setAIPPTDialogState(false)
        // 将模板主题写入当前演示文稿，确保生成页面使用对应视觉风格。
        slidesStore.setTheme(templateTheme)
        // 打印 PPT 生成结束。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:done', {
          // 当前 store 页面数量。
          slidesCount: slidesStore.slides.length,
        })
        return
      }
  
      // 解码当前响应分块；stream 模式可处理中文等多字节字符跨块情况。
      const chunk = decoder.decode(value, { stream: true })
      // 打印最终 PPT 流式分块摘要。
      console.debug(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:chunk', {
        // 分块字符长度。
        chunkLength: chunk.length,
        // 分块按换行切分后的候选行数量。
        lineCount: chunk.split(/\n+/).filter(Boolean).length,
      })
      // JSONL 数据通常按换行分隔；这里用一个或多个换行切分，兼容空行。
      const lines = chunk.split(/\n+/)

      // 遍历每一行候选 JSON 文本，逐行解析并生成幻灯片。
      for (const line of lines) {
        // 跳过空行，避免对空字符串执行 JSON 修复和解析。
        if (line) processChunk(line)
      }

      // 当前分块处理完毕后继续读取下一段，直到 done。
      readStream()
    })
  }

  /**
   * 解析单段 AI PPT JSON 文本并写入幻灯片。
   *
   * @param chunk - 从流式响应中按换行切分得到的单段文本，可能带有 Markdown 代码块标记。
   * @returns 无返回值；解析成功后会调用 `AIPPT()` 直接生成页面。
   * @throws 函数内部捕获 JSON 解析异常，因此不会向外抛出错误。
   * @remarks
   * - 模型可能返回 ```json 或 ```jsonl 代码块包裹，因此解析前需要先清理。
   * - `jsonrepair` 用于容错修复轻微格式问题，降低模型输出不规范导致的失败率。
   * - 单段失败不会中断整体生成，后续分块仍会继续处理。
   */
  const processChunk = (chunk: string) => {
    // 使用 try/catch 包裹单段处理，避免某一页 JSON 异常影响整份 PPT 继续生成。
    try {
      // 清理模型可能附加的 Markdown 代码块围栏，并去掉首尾空白字符。
      const text = chunk.replace('```jsonl', '').replace('```json', '').replace('```', '').trim()
      // 文本为空时直接跳过，避免 JSON.parse 解析空字符串导致异常。
      if (text) {
        // 先用 jsonrepair 修复轻微非法 JSON，再解析成 AIPPT 约定的单页数据结构。
        const slide: AIPPTSlide = JSON.parse(jsonrepair(text))
        // 打印单页解析成功摘要。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:slide parsed', {
          // AI 页面类型。
          type: slide.type,
          // 页面标题。
          title: 'data' in slide && 'title' in slide.data ? slide.data.title : '',
          // 内容项数量。
          itemsCount: Array.isArray((slide as any).items) ? (slide as any).items.length : undefined,
          // 文本长度。
          textLength: text.length,
        })
        // 将解析出的单页 AI 数据套入模板幻灯片，生成并写入实际页面。
        AIPPT(templateSlides, [slide])
        // 打印写入后页面数量，验证真正进入 PPT 页面生成逻辑。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:slide generated', {
          // 当前 store 页面数量。
          slidesCount: slidesStore.slides.length,
        })
      }
    }
    catch (err) {
      // 仅记录当前分块错误，保留后续流数据继续处理的机会。
      // eslint-disable-next-line
      console.error(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPT:chunk parse failed', {
        // 原始错误。
        error: err,
        // 分块长度。
        chunkLength: chunk.length,
        // 分块前 200 个字符，便于判断后端返回格式；避免完整大段输出刷屏。
        chunkPreview: chunk.slice(0, 200),
      })
    }
  }
  // 启动 PPT 生成流读取，后续由 `readStream()` 递归推进。
  readStream()
}

/**
 * 根据 user-ai.ts 风格的 SSE 流式协议生成完整 PPT。
 *
 * @param template - 可选的本地模板数据；包含幻灯片数组和主题配置。未传入时会读取当前选中的预置模板。
 * @returns `Promise<void>`；生成过程会直接写入幻灯片 store，不返回额外数据。
 * @throws 当前函数内部会捕获读取和解析阶段的异常，并通过消息提示恢复 UI 状态。
 * @remarks
 * - 该方法是为兼容 `doc/refrence/ai/user-ai.ts` 中的 `text/event-stream + data:` 协议新增的实验方法。
 * - 该方法不修改 `user-ai.ts`，只在 PPTist 侧把 SSE 中的 `message.answer` 增量重新拼成 AIPPT JSON/JSONL。
 * - 后端仍建议最终输出一行一个 `AIPPTSlide`，否则前端需要依赖 JSON 完整性判断做增量拼接。
 */
const createPPTNew = async (template?: { slides: Slide[], theme: SlideTheme }) => {
  // 打印 SSE 兼容生成流程开始，方便和旧 createPPT() 区分。
  console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:start', {
    // 大纲长度。
    outlineLength: outline.value.length,
    // 当前语言。
    language: language.value,
    // 当前风格。
    style: style.value,
    // 当前模型。
    model: model.value,
    // 配图模式。
    imgMode: img.value || 'none',
    // 是否覆盖。
    overwrite: overwrite.value,
    // 是否本地模板。
    hasLocalTemplate: !!template,
    // 选中模板。
    selectedTemplate: selectedTemplate.value,
  })
  // 打开全屏加载层，避免 SSE 流式生成期间用户重复点击生成按钮。
  loading.value = true
  // 将弹窗状态标记为运行中，保持与旧 createPPT() 一致的外层 UI 行为。
  mainStore.setAIPPTDialogState('running')
  // 展示全局 loading 消息；结束、失败或中断时必须手动关闭。
  message.loading('演示文稿生成中，请稍等 ...', { duration: 0 })

  // 用户选择覆盖生成时，先清空当前演示文稿，避免新旧页面混排。
  if (overwrite.value) resetSlides()

  try {
    // 先请求当前项目已有的 PPT 生成接口；如果你在目标项目中接入 user-ai.ts 风格后端，可替换这里的 api.AIPPT()。
    const stream = await api.AIPPT({
      content: outline.value,
      language: language.value,
      style: style.value,
      model: model.value,
    })
    // 兼容当前服务端并发错误约定；该错误对象不是可读流，不能继续 getReader()。
    if (typeof stream === 'object' && stream.state === -1) {
      // 打印并发限制响应。
      console.warn(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:concurrency limited', stream)
      // 关闭全屏加载层，恢复可操作状态。
      loading.value = false
      // 关闭全局 loading 消息。
      message.closeAll()
      // 恢复弹窗打开状态，方便用户换模型重试。
      mainStore.setAIPPTDialogState(true)
      // 提示用户切换模型。
      return message.error('该模型API的并发数过高，请更换其他模型重试')
    }

    // 如果使用测试图片模式，则沿用旧逻辑先预置模拟图片池。
    if (img.value === 'test') {
      // 从 mock 数据中读取图片列表。
      const imgs = await api.getMockData('imgs')
      // 注入图片池，后续模板图片占位会从这里取图。
      presetImgPool(imgs)
      // 打印测试图片池加载结果。
      console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:test image pool loaded', {
        // 图片数量。
        imgsCount: Array.isArray(imgs) ? imgs.length : undefined,
      })
    }

    // 优先使用调用方传入的本地模板；没有传入时读取当前选中的预置模板。
    let templateData = template
    // 从 public/mocks 读取预置模板数据。
    if (!templateData) templateData = await api.getMockData(selectedTemplate.value)
    // 模板页面列表，用于 AIPPT() 做页面套版。
    const templateSlides: Slide[] = templateData!.slides
    // 模板主题配置，流结束后写入当前演示文稿。
    const templateTheme: SlideTheme = templateData!.theme
    // 打印模板准备结果。
    console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:template ready', {
      // 模板来源。
      templateSource: template ? 'local' : selectedTemplate.value,
      // 模板页数量。
      templateSlidesCount: templateSlides.length,
      // 主题字段。
      themeKeys: templateTheme ? Object.keys(templateTheme) : [],
    })

    // 防御性检查响应体，避免普通 JSON 错误响应进入 getReader() 后抛出难懂错误。
    if (!stream.body) throw new Error('当前响应不是可读取的流式响应')

    // 获取流式读取器；user-ai.ts 同样依赖 response.body.getReader()。
    const reader: ReadableStreamDefaultReader = stream.body.getReader()
    // 创建 UTF-8 解码器，用于处理中文跨分块等多字节字符场景。
    const decoder = new TextDecoder('utf-8')
    // SSE 事件缓冲区：保存尚未凑齐 `\n\n` 分隔符的半截事件。
    let sseBuffer = ''
    // AIPPT JSON 缓冲区：保存 `message.answer` 中尚未形成完整 JSON 的文本。
    let aipptJsonBuffer = ''
    // 上一次收到的 answer 快照：用于兼容 user-ai.ts 的 updateContent 这种“累计全文”输出形态。
    let lastAnswerSnapshot = ''
    // 已解析并生成的页面数量，用于没有页面时给出更明确的错误。
    let parsedSlideCount = 0

    /**
     * 判断文本是否是一个括号和字符串状态都闭合的完整 JSON 对象。
     *
     * @param text - 待检查的 JSON 候选字符串。
     * @returns 完整 JSON 对象返回 true，否则返回 false。
     * @throws 当前函数不主动抛错。
     * @remarks
     * - 该逻辑参考 `user-ai.ts` 的 `isCompleteJson()`，用于解决网络分块切开 JSON 的问题。
     * - 这里只判断对象完整性，不保证字段符合 `AIPPTSlide` schema。
     */
    const isCompleteJson = (text: string) => {
      // 空文本不可能是完整 JSON。
      if (!text) return false
      // 如果多个 JSON 对象粘连，交给后续 JSONL 拆分逻辑处理，这里先判定为不完整单对象。
      if (text.includes('}{')) return false

      // 花括号计数器，归零表示对象外层括号闭合。
      let braceCount = 0
      // 当前扫描位置是否处于 JSON 字符串内部。
      let inString = false
      // 当前字符是否被反斜杠转义。
      let escapeNext = false

      // 按字符扫描，避免字符串里的大括号干扰完整性判断。
      for (let i = 0; i < text.length; i++) {
        // 当前字符。
        const char = text[i]
        // 不在字符串内部时，大括号参与结构计数。
        if (!inString) {
          // 左大括号增加对象层级。
          if (char === '{') braceCount++
          // 右大括号减少对象层级。
          if (char === '}') braceCount--
          // 未转义双引号表示进入字符串。
          if (char === '"' && !escapeNext) inString = true
        }
        // 在字符串内部时，只处理引号和转义状态。
        else {
          // 未转义双引号表示离开字符串。
          if (char === '"' && !escapeNext) inString = false
          // 反斜杠会切换下一字符转义状态。
          if (char === '\\') escapeNext = !escapeNext
          // 普通字符会清除转义状态。
          else escapeNext = false
        }
      }

      // 大括号归零且不在字符串内部，说明对象结构完整。
      return braceCount === 0 && !inString
    }

    /**
     * 清理模型输出中常见的代码块包裹。
     *
     * @param text - 模型返回的原始文本片段。
     * @returns 去掉 Markdown 代码围栏后的文本。
     * @throws 当前函数不主动抛错。
     * @remarks 兼容 ```json、```jsonl 和裸 ``` 三种常见包裹。
     */
    const cleanJsonText = (text: string) => {
      // 连续 replace 保持与旧 createPPT() 的清理策略一致。
      return text.replace('```jsonl', '').replace('```json', '').replace('```', '').trim()
    }

    /**
     * 将完整 JSON 文本解析为 AIPPTSlide 并写入幻灯片。
     *
     * @param jsonText - 完整的单页 AIPPT JSON 文本。
     * @returns 解析并写入成功返回 true，否则返回 false。
     * @throws 函数内部捕获解析异常，不向外抛出。
     * @remarks 单页解析失败不影响后续 SSE 事件继续处理。
     */
    const consumeSlideJson = (jsonText: string) => {
      // 清理代码块围栏和空白字符。
      const text = cleanJsonText(jsonText)
      // 空文本无需解析。
      if (!text) return false

      // 单页解析失败只记录错误，避免中断整份 PPT 流式生成。
      try {
        // jsonrepair 用于修复模型输出中缺逗号、尾逗号等轻微格式问题。
        const slide: AIPPTSlide = JSON.parse(jsonrepair(text))
        // 打印 SSE 单页解析成功摘要。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:slide parsed', {
          // AI 页面类型。
          type: slide.type,
          // 页面标题。
          title: 'data' in slide && 'title' in slide.data ? slide.data.title : '',
          // 内容项数量。
          itemsCount: Array.isArray((slide as any).items) ? (slide as any).items.length : undefined,
          // JSON 文本长度。
          textLength: text.length,
        })
        // 把单页 AI 数据套入模板并写入当前文稿。
        AIPPT(templateSlides, [slide])
        // 记录成功生成页数，便于结束时判断是否拿到了有效输出。
        parsedSlideCount++
        // 打印写入后的页面数量。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:slide generated', {
          // 已解析页面数。
          parsedSlideCount,
          // 当前 store 页面数量。
          slidesCount: slidesStore.slides.length,
        })
        return true
      }
      catch (err) {
        // 打印原始文本和异常，方便你在目标项目里观察后端真实返回格式。
        // eslint-disable-next-line
        console.error('AIPPT SSE JSON parsing failed:', err, text)
        return false
      }
    }

    /**
     * 尝试从 AIPPT JSON 缓冲区中消费完整页面。
     *
     * @param force - 是否强制处理剩余缓冲；流结束时传 true。
     * @returns 无返回值；解析成功会调用 AIPPT() 写入页面。
     * @throws 当前函数不主动抛错。
     * @remarks
     * - 优先按 JSONL 的换行边界消费，适合后端一行一个 `AIPPTSlide`。
     * - 没有换行时再用完整 JSON 判断，适合后端把单个 JSON 对象拆在多个 SSE message 中。
     */
    const drainAIPPTJsonBuffer = (force = false) => {
      // 清理代码块围栏，避免围栏跨事件时阻塞 JSON 识别。
      aipptJsonBuffer = cleanJsonText(aipptJsonBuffer)
      // 缓冲区为空时无需处理。
      if (!aipptJsonBuffer) return

      // 按换行切分，优先兼容 JSONL。
      const lines = aipptJsonBuffer.split(/\n+/)
      // 如果存在多个换行片段，则除最后一段外都视作完整候选行。
      if (lines.length > 1) {
        // 保留最后一段作为可能未完整的 JSON 片段。
        const rest = lines.pop() || ''
        // 遍历已完成的候选行。
        for (const line of lines) {
          // 清理候选行。
          const text = cleanJsonText(line)
          // 只有非空行才尝试解析。
          if (text) consumeSlideJson(text)
        }
        // 将最后一段放回缓冲区，等待后续分块补齐。
        aipptJsonBuffer = rest
      }

      // 清理剩余缓冲，准备按单对象完整性判断。
      const restText = cleanJsonText(aipptJsonBuffer)
      // 剩余内容为空则清空缓冲区。
      if (!restText) {
        aipptJsonBuffer = ''
        return
      }

      // 对完整单对象或流结束时的剩余对象做最后解析尝试。
      if (isCompleteJson(restText) || force) {
        // 解析成功或强制尝试后都清空缓冲，避免重复生成。
        consumeSlideJson(restText)
        aipptJsonBuffer = ''
      }
      // 未完整时保留原内容等待下一次 SSE message 增量。
      else aipptJsonBuffer = restText
    }

    /**
     * 处理单个 SSE 事件文本。
     *
     * @param rawEvent - 已经按 `\n\n` 切出的 SSE 事件文本。
     * @returns 无返回值；message 事件中的 answer 会进入 AIPPT JSON 缓冲区。
     * @throws 当前函数不主动抛错，事件 JSON 解析失败只打印日志。
     * @remarks
     * - user-ai.ts 的主要数据行形如 `data: {"event":"message","answer":"..."}`。
     * - 该方法只消费 `message.answer`，其他事件用于结束、错误或忽略。
     */
    const processSSEEvent = (rawEvent: string) => {
      // 去掉事件首尾空白，避免空事件进入解析流程。
      const eventText = rawEvent.trim()
      // 空事件直接跳过。
      if (!eventText) return

      // SSE 可能包含多行，这里只收集 data: 行，并拼成一个 JSON 字符串。
      const dataText = eventText
        .split('\n')
        // 只处理 data 字段，忽略 event/id/retry 等其他 SSE 字段。
        .filter(line => line.startsWith('data:'))
        // 去掉 data: 前缀。
        .map(line => line.substring(5).trim())
        // 多行 data 合并，兼容服务端分多行输出同一个 JSON。
        .join('\n')

      // 空 data 或结束标记直接跳过。
      if (!dataText || dataText === '[DONE]') return

      // 解析后的 SSE 业务事件对象。
      let data: any
      // 单个 SSE 事件 JSON 解析失败不影响后续事件。
      try {
        // 解析 user-ai.ts 风格事件对象。
        data = JSON.parse(dataText)
      }
      catch (err) {
        // 打印 SSE 事件解析错误，方便你观察目标后端真实 data 格式。
        // eslint-disable-next-line
        console.error('SSE event parsing failed:', err, dataText)
        return
      }

      // error 事件直接抛给外层 catch，由外层统一恢复 UI。
      if (data.event === 'error') throw new Error(JSON.stringify(data.message || data))
      // message 事件承载模型增量文本，answer 里应逐步拼出 AIPPT JSON/JSONL。
      if (data.event === 'message' && data.answer) {
        // 当前 answer 文本；某些封装会返回增量，某些 UI 回调会返回从开头到当前的累计全文。
        const answer = data.answer as string
        // 如果当前 answer 以前一次 answer 为前缀，说明它是累计快照，只消费新增部分。
        const answerDelta = lastAnswerSnapshot && answer.startsWith(lastAnswerSnapshot) ? answer.slice(lastAnswerSnapshot.length) : answer
        // 打印 SSE message 增量摘要。
        console.debug(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:sse message', {
          // 当前 answer 是增量还是累计快照。
          isSnapshot: !!lastAnswerSnapshot && answer.startsWith(lastAnswerSnapshot),
          // answer 总长度。
          answerLength: answer.length,
          // 本次实际追加长度。
          answerDeltaLength: answerDelta.length,
          // 当前业务事件。
          event: data.event,
        })
        // 当前 answer 是累计快照时更新快照；普通增量时不要误把快照改成短片段。
        if (!lastAnswerSnapshot || answer.startsWith(lastAnswerSnapshot)) lastAnswerSnapshot = answer
        // 追加 answer 新增部分到 AIPPT JSON 缓冲区。
        aipptJsonBuffer += answerDelta
        // 尝试消费已经完整的 JSON 页面。
        drainAIPPTJsonBuffer()
      }
      // workflow_finished 或 message_end 本身不一定代表 reader done，这里只尝试刷新已有缓冲。
      else if (data.event === 'workflow_finished' || data.event === 'message_end') {
        // 打印 SSE 结束类事件。
        console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:sse finish event', {
          // 事件类型。
          event: data.event,
          // 当前已解析页数。
          parsedSlideCount,
        })
        // 结束类事件到达时尝试处理当前已完整的页面，但不强制消费半截 JSON。
        drainAIPPTJsonBuffer()
      }
    }

    // 持续读取 SSE 流，直到服务端关闭响应体。
    while (true) {
      // 主动从流里读取下一段二进制数据。
      const { done, value } = await reader.read()
      // done 表示服务端已经结束本次流式响应。
      if (done) {
        // 流结束时，如果还有未按 \n\n 分隔出来的事件，最后处理一次。
        if (sseBuffer.trim()) processSSEEvent(sseBuffer)
        // 强制尝试消费剩余 AIPPT JSON 缓冲，避免最后一页没有换行导致丢失。
        drainAIPPTJsonBuffer(true)
        // 没有成功解析任何页面时给出提示，通常意味着后端 answer 不是 AIPPT JSON 格式。
        if (!parsedSlideCount) message.warning('未解析到有效的PPT页面数据，请检查后端流式输出格式')
        // 结束循环，进入 finally 收尾。
        break
      }

      // 解码当前流分块；stream 模式可正确处理中文等跨分块字符。
      const chunk = decoder.decode(value, { stream: true })
      // 打印 SSE 原始分块摘要。
      console.debug(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:chunk', {
        // 分块长度。
        chunkLength: chunk.length,
        // 当前 SSE 缓冲长度。
        sseBufferLength: sseBuffer.length,
      })
      // 累积 SSE 事件缓冲，解决单个 data 事件被网络分块切开的情况。
      sseBuffer += chunk
      // 按 SSE 标准的空行分隔事件；兼容 \n\n 和 \r\n\r\n。
      const events = sseBuffer.split(/\r?\n\r?\n/)
      // 最后一段可能是不完整事件，放回缓冲区等待下一次读取补齐。
      sseBuffer = events.pop() || ''
      // 处理已经完整的 SSE 事件。
      for (const event of events) processSSEEvent(event)
    }

    // 流正常结束后写入模板主题。
    slidesStore.setTheme(templateTheme)
    // 关闭 AI PPT 弹窗，回到编辑器主界面查看生成结果。
    mainStore.setAIPPTDialogState(false)
    // 打印 SSE 兼容生成流程完成。
    console.info(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:done', {
      // 成功解析页数。
      parsedSlideCount,
      // 当前 store 页面数量。
      slidesCount: slidesStore.slides.length,
    })
  }
  catch (err) {
    // 读取流、解析流或请求阶段任意异常都在这里统一恢复 UI。
    // eslint-disable-next-line
    console.error(AIPPT_DIALOG_DEBUG_PREFIX, 'createPPTNew:failed', err)
    // 异常时保持弹窗打开，方便用户调整配置后重试。
    mainStore.setAIPPTDialogState(true)
    // 给出统一错误提示。
    message.error('演示文稿生成失败，请检查后端流式输出格式或网络连接')
  }
  finally {
    // 无论成功失败都关闭全屏加载层。
    loading.value = false
    // 无论成功失败都关闭全局 loading 消息。
    message.closeAll()
  }
}

// 暴露实验方法，方便父组件或调试环境通过组件实例调用；模板按钮仍默认使用稳定的 createPPT()。
defineExpose({ createPPTNew })

/**
 * 上传并使用本地 `.pptist` 模板生成 PPT。
 *
 * 功能描述：
 * - 动态创建文件选择框。
 * - 限制用户选择 `.pptist` 模板文件。
 * - 读取文件文本内容并解密。
 * - 从解密结果中解析 `slides` 和 `theme`，再复用 `createPPT()` 生成流程。
 *
 * 入参：
 * - 无；文件对象来自浏览器文件选择事件。
 *
 * 返回值：
 * - 无返回值；成功时会触发异步 PPT 生成流程。
 *
 * 异常：
 * - 解密失败、JSON 解析失败、模板字段缺失等情况会进入 catch 并提示用户模板异常。
 *
 * 注意事项：
 * - `input.click()` 必须由用户交互触发，否则部分浏览器可能阻止文件选择窗口。
 * - 当前只校验文件扩展名和解析流程，没有额外校验模板 schema 完整性。
 */
const uploadLocalTemplate = () => {
  // 创建临时文件输入框，用于打开系统文件选择窗口。
  const input = document.createElement('input')
  // 指定输入框类型为文件选择，浏览器会展示本地文件选择器。
  input.type = 'file'
  // 限制可选择文件扩展名为 .pptist，降低用户上传错误文件的概率。
  input.accept = '.pptist'
  // 主动触发文件选择窗口；该调用来自点击“使用本地模板生成”的用户手势。
  input.click()
  // 监听文件选择变化事件，用户确认文件后开始读取模板内容。
  input.addEventListener('change', e => {
    // 从事件目标中读取第一个文件；未选择文件或取消窗口时结果为 undefined。
    const file = (e.target as HTMLInputElement).files?.[0]
    // 只有实际选择了文件才继续读取，避免取消选择时触发空文件异常。
    if (file) {
      // 创建 FileReader 读取 .pptist 文件文本内容。
      const reader = new FileReader()
      // 文件读取完成后尝试解密和解析模板数据。
      reader.addEventListener('load', () => {
        // 模板解析属于不可信输入处理，必须用 try/catch 兜底。
        try {
          // .pptist 文件内容为加密字符串，解密后应得到包含 slides 和 theme 的 JSON。
          const { slides, theme } = JSON.parse(decrypt(reader.result as string))
          // 复用最终生成流程，并把本地模板数据作为模板来源传入。
          createPPT({ slides, theme })
        }
        catch {
          // 解密或解析失败时提示用户重新上传，避免后续生成流程拿到无效模板。
          message.error('上传的模板文件数据异常，请重新上传或使用预置模板')
        }
      })
      // 按文本读取模板文件；读取完成后会触发上面的 load 事件。
      reader.readAsText(file)
    }
  })
}
</script>

<style lang="scss" scoped>
.aippt-dialog {
  margin: -20px;
  padding: 30px;
}
.header {
  margin-bottom: 12px;

  .title {
    font-weight: 700;
    font-size: 20px;
    margin-right: 8px;
    background: linear-gradient(270deg, #d897fd, #33bcfc);
    background-clip: text;
    color: transparent;
    vertical-align: text-bottom;
    line-height: 1.1;
  }
  .subtite {
    color: #888;
    font-size: 12px;

    .local {
      color: $themeColor;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.preview {
  pre {
    max-height: 450px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: #f1f1f1;
    overflow: auto;
  }
  .outline-view {
    max-height: 450px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: #f1f1f1;
    overflow: auto;
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 120px;
      margin: 0 5px;
    }
  }
}
.select-template {
  .templates {
    max-height: 450px;
    overflow: auto;
    display: flex;
    margin-bottom: 10px;
    padding-right: 5px;
    @include flex-grid-layout();
  
    .template {
      border: 2px solid $borderColor;
      border-radius: $borderRadius;
      @include flex-grid-layout-children(2, 49%);

      &.selected {
        border-color: $themeColor;
      }
  
      img {
        width: 100%;
        min-height: 175px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      width: 120px;
      margin: 0 5px;
    }
  }
}
.recommends {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  .recommend {
    font-size: 12px;
    background-color: #f1f1f1;
    border-radius: $borderRadius;
    padding: 3px 5px;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }
}
.configs {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  .config-item {
    font-size: 13px;
    display: flex;
    align-items: center;
  }
}
.count {
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}
.submit {
  height: 20px;
  font-size: 12px;
  background-color: $themeColor;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 8px 0 6px;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $themeHoverColor;
  }

  .icon {
    font-size: 15px;
    margin-right: 3px;
  }
}

@media screen and (width <= 800px) {
  .configs {
    margin-top: 15px;
    display: flex;
    flex-direction: column;

    .config-item {
      margin-top: 8px;

      .label {
        flex-shrink: 0;
      }

      .config-content {
        width: 100% !important;
      }
    }
  }
  .select-template {
    .templates {
      padding-right: 0;
  
      .template {
        img {
          min-height: 60px;
        }
      }
    }
  }
}

@media screen and (width <= 380px) {
  .preview {
    pre {
      max-height: 400px;
    }
    .outline-view {
      max-height: 400px;
    }
  }
  .select-template {
    .templates {
      max-height: 400px;
    }
  }
}
</style>

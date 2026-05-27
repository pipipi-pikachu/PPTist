import moment, { now } from "moment";
import { userCommonStoreHook } from '@/stores/modules/common'
import ChartsComponent from './static.vue'
import { debounce, getFileType } from '@/utils/utils'
import {h, render} from 'vue'
import { getConfig } from './config'
import { useRoute } from 'vue-router'
import { rpaStop } from "@/apis/ai"
import { aiModelAddLog } from "@/apis/system"
import { getToken } from '@/utils/cookie'
import { queryModelConfigList } from '@/apis/model'
// 智能体接口配置
const baseUrl = window.location.origin + "/aiServer";
const baseAgent = window.location.origin + "/aiServer/v1"; // 'http://172.16.102.154/v1'
const { BASE_URL } = import.meta.env
const aiServer = '/aiServer/'
let streamModelOptionsCache: any[] | null = null

const getStreamModelOptions = async () => {
  if (streamModelOptionsCache) return streamModelOptionsCache
  try {
    const res: any = await queryModelConfigList({
      model: '',
      modelType: 'LLM'
    })
    const data = res?.data?.data || res?.data?.rows || res?.data || res?.rows || []
    streamModelOptionsCache = (Array.isArray(data) ? data : [])
      .map((item: any) => {
        const modelName = item?.model || item?.modelName || item?.name || ''
        const providerName = item?.providerName || item?.providerLabel || item?.provider || ''
        return {
          modelName,
          providerName
        }
      })
      .filter((item: any) => item.modelName && item.providerName)
  } catch (error) {
    console.error('获取流式接口模型列表失败:', error)
    streamModelOptionsCache = []
  }
  return streamModelOptionsCache
}

/**
 * 工具方法，判断是否完整的json
 * @param str 
 * @returns 
 */
export function isCompleteJson(str: any) {
  // 检查是否包含多个 JSON 对象
  if (typeof str === 'string' && str.includes('}{"')) {
    return false; // 包含粘连的 JSON 对象
  }
  let braceCount = 0; // 跟踪 { 和 } 的数量
  let inString = false; // 是否在字符串中
  let escapeNext = false; // 是否在转义字符后

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (!inString) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
      if (char === '"' && !escapeNext) inString = true;
    } else {
      if (char === '"' && !escapeNext) inString = false;
      if (char === "\\") escapeNext = !escapeNext;
      else escapeNext = false;
    }
  }
  return braceCount === 0 && !inString;
}

// 全局变量：当前请求在 lastStreamOutputs 中的索引
let currentRequestIndex: number = -1;

/**
 * 记录请求开始（将请求体作为第一条记录）
 * @param {any} body - 请求体
 */
function recordRequestStart(body: any) {
  const lastStreamOutputs = window.lastStreamOutputs || [];
  
  // 创建新请求记录数组，第一条是请求体
  const newRequestRecord = [
    {
      type: 'request',
      timestamp: Date.now(),
      body: { ...body } // 保存请求体的副本
    }
  ];
  
  // 添加到数组开头
  lastStreamOutputs.unshift(newRequestRecord);
  
  // 只保留最后5个请求（第一维最多5个）
  if (lastStreamOutputs.length > 5) {
    lastStreamOutputs.splice(5);
  }
  
  // 设置当前请求索引（总是第一个，因为刚 unshift）
  currentRequestIndex = 0;
  
  // 更新 window 对象
  window.lastStreamOutputs = lastStreamOutputs;
}

/**
 * 记录流式输出数据到当前请求的历史记录
 * @param {any} data - 流式输出数据
 * @param {number} botMessageIndex - 消息索引
 * @param {any} conversationId - 会话ID
 * @param {any} taskId - 任务ID
 */
function recordStreamOutput(data: any, botMessageIndex: number, conversationId?: any, taskId?: any) {
  const lastStreamOutputs = window.lastStreamOutputs || [];
  
  // 如果没有当前请求索引，说明请求还没开始记录，直接返回
  if (currentRequestIndex === -1 || !lastStreamOutputs[currentRequestIndex]) {
    return;
  }
  
  const record = {
    timestamp: Date.now(),
    messageIndex: botMessageIndex,
    event: data.event,
    answer: data.answer || '',
    conversationId: data.conversation_id || conversationId,
    messageId: data.message_id || data.messageId,
    taskId: data.task_id || taskId,
    data: { ...data } // 保存完整数据副本
  };
  
  // 追加到当前请求的数组中（第二维，没有限制）
  lastStreamOutputs[currentRequestIndex].push(record);
  
  // 更新 window 对象
  window.lastStreamOutputs = lastStreamOutputs;
}

/**
 * 记录请求异常结束（中断、网络错误、catch 等），便于排查请求中途断掉的情况
 * @param options.endType - 结束类型：'aborted' | 'error' | 'catch' | 'network'
 * @param options.errorMsg - 错误信息
 * @param options.messageIndex - 消息索引（可选）
 */
function recordRequestEnd(options: { endType: 'aborted' | 'error' | 'catch' | 'network'; errorMsg?: string; messageIndex?: number }) {
  try {
    const lastStreamOutputs = window.lastStreamOutputs || [];
    if (currentRequestIndex === -1 || !lastStreamOutputs[currentRequestIndex]) {
      return;
    }
    const record = {
      type: 'stream_end',
      timestamp: Date.now(),
      messageIndex: options.messageIndex,
      endType: options.endType,
      errorMsg: options.errorMsg || '',
      data: { ...options }
    };
    lastStreamOutputs[currentRequestIndex].push(record);
    window.lastStreamOutputs = lastStreamOutputs;
  } catch (_) {
    // 仅做日志记录，任何异常都不影响主流程
  }
}

/**
 * ai配置相关
 */
const config: any = getConfig()
const SMOOTH_OUTPUT_SYS_PARAM_KEY = 'chat_smooth_output_speed'


class UserAi {
  callback: any = Function; // 回调函数 — 非常关键，是aiFn的回调函数
  commonHook: any
  route: any

  reader: any = null; // 流式读取器
  buffer: string = ""; // 缓冲区
  taskId: any = null; // 任务ID  开始时存储，结束时清空
  taskType: any = null; // 任务类型 目前只有agent和stream
  currentBotMessage: any = null; // 当前的机器人消息
  isInThought: any = false; // 是否在思考中
  thoughtContent: any = ""; // 思考内容
  thoughtOpen: boolean = false; // 思考内容是否展开
  conversationId: any; // 会话 ID TODO疑问 跟任务id有啥区别？
  currentIndex:any = -1; // 当前机器人消息的索引
  smoothOutputBuffer: string = ""; // 假流式缓冲区
  smoothOutputTimer: ReturnType<typeof setInterval> | null = null; // 假流式定时器
  smoothOutputIndex: number = -1; // 当前缓冲绑定的消息索引
  smoothOutputEnabled: boolean = false; // 假流式总开关
  smoothOutputIntervalMs: number = 20; // 每次输出时间间隔
  smoothOutputFixedStep: number = 0; // 固定每次输出字符数，0 表示动态
  smoothOutputMinStep: number = 1; // 动态步长最小值
  smoothOutputMaxStep: number = 12; // 动态步长最大值

  // 新增属性
  abortController: AbortController | null = null; // 用于中断请求
  isNetworkOnline: boolean = true; // 网络状态
  isRequestAborted: boolean = false; // 请求是否被中断
  isNeedScroll: boolean = false; // 是否需要滚动 如果需要则会调用scrollToBottom方法
  streamEndState: any = null; // 流式结束态缓存，用于兼容 message_end / workflow_finished 顺序变化与缺失
  constructor(func: any, isNeedScroll: boolean = false) {
    this.isNeedScroll = isNeedScroll
    this.reset()
    this.callback = func
    this.commonHook = userCommonStoreHook()
    this.route = useRoute()
    // 初始化 window 上的流式输出历史记录（二维数组）
    if (!window.lastStreamOutputs) {
      window.lastStreamOutputs = [];
    }
    // 监听网络状态变化
    this.setupNetworkListener();
  }

  // 设置网络监听器
  setupNetworkListener() {
    const handleOnline = () => {
      this.isNetworkOnline = true;
      console.log('网络已连接');
    };

    const handleOffline = () => {
      this.isNetworkOnline = false;
      console.log('网络已断开');
      // 网络断开时中断当前请求
      this.abortCurrentRequest();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始化网络状态
    this.isNetworkOnline = navigator.onLine;
  }

  // 中断当前请求
  abortCurrentRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.isRequestAborted = true;
      console.log('SSE/流式请求已中断');
      // 异常结束由 streamApi 的 catch 统一记录（endType: 'aborted'），避免重复
      // 通知UI更新状态
      this.callback('loading', false);
      this.callback('loadError', {
        status: 'aborted',
        errorType: 'network',
        content: "网络连接已断开，请求已中断",
        index: this.currentIndex || -1, // 或者传入当前消息索引
        errorMsg:'网络连接已断开，请求已中断'
      });
    }
  }


  requestTask (taskId: any = '', taskType: any = ''){
    this.taskId = taskId
    this.taskType = taskType
  }

  /**
   * 裁剪流式接口的自定义入参。
   *
   * @param inputs 输入表单收集到的完整值，文件字段里可能包含 name、sizeText 等历史回显字段。
   * @returns 可直接放入流式接口 body.inputs 的入参对象。
   * @remarks
   * - extField2 需要完整文件信息用于历史回显；
   * - 流式接口只需要 transfer_method、type、url 三个字段，所以请求前单独裁剪；
   * - 递归处理数组和对象，兼容 file / file-list 以及嵌套结构。
   */
  normalizeStreamInputs(inputs: Record<string, any>) {
    const normalizeValue = (value: any): any => {
      if (Array.isArray(value)) {
        return value.map(normalizeValue);
      }
      if (value && typeof value === 'object') {
        const fileUrl = value.url || value.remote_url;
        if (value.transfer_method && value.type && fileUrl) {
          return {
            transfer_method: 'remote_url',
            type: value.type,
            url: fileUrl
          };
        }
        return Object.keys(value).reduce((result: Record<string, any>, key: string) => {
          result[key] = normalizeValue(value[key]);
          return result;
        }, {});
      }
      return value;
    };
    return Object.keys(inputs || {}).reduce((result: Record<string, any>, key: string) => {
      result[key] = normalizeValue(inputs[key]);
      return result;
    }, {});
  }

  /**
   * 裁剪流式接口模型参数。
   *
   * @param model 页面侧传入的模型对象或历史 JSON 字符串。
   * @returns 后端 chatMessages 接口需要的最小模型对象；无有效模型时返回 undefined。
   * @remarks
   * - 页面侧模型对象会保留图标、类型等字段用于展示和匹配；
   * - `/aiExt/aiQA/query/chatMessages` 只需要 name 和 provider，发请求前统一裁剪，避免冗余字段透传。
   */
  async normalizeStreamModel(model: any, modelName?: any): Promise<{ name: string; provider: string } | undefined> {
    let parsedModel = model;
    if (typeof model === 'string') {
      try {
        parsedModel = JSON.parse(model);
      } catch (error) {
        parsedModel = model;
      }
    }
    const name = typeof parsedModel === 'object'
      ? parsedModel?.name || parsedModel?.model || parsedModel?.modelName || ''
      : parsedModel || '';
    const provider = typeof parsedModel === 'object'
      ? parsedModel?.provider || parsedModel?.providerName || parsedModel?.providerId || ''
      : '';
    if (name && provider) return { name, provider };

    const legacyModelName = name || modelName || '';
    if (!legacyModelName) return undefined;
    const options = await getStreamModelOptions();
    const option = options.find((item: any) => item.modelName === legacyModelName) || options[0];
    if (!option) return undefined;
    return {
      name: option.modelName,
      provider: option.providerName
    };
  }
  
  reset() {
    this.stopSmoothOutput();
    this.reader = null;
    this.buffer = "";
    this.requestTask()
    this.currentBotMessage = ''
    this.currentIndex = -1
    this.resetStreamEndState()
    // 重置时不清空历史记录，保持最后5条数据
  }
  clearConversationId () {
    this.conversationId = ''
  }
  /**
   * 重置结束态缓存。
   * 用于兼容以下情况：
   * 1. message_end 和 workflow_finished 返回顺序变化；
   * 2. 只返回 workflow_finished；
   * 3. RPA 场景只返回 message_end。
   */
  resetStreamEndState() {
    this.streamEndState = {
      hasMessageEnd: false,
      hasWorkflowFinished: false,
      isClosed: false,
      lastEventData: {},
      workflowNode: null
    }
  }
  /**
   * 缓存结束事件相关字段，避免 message_end 缺失时页面层拿不到会话信息。
   */
  cacheStreamEndData(data: any = {}) {
    if (!this.streamEndState) {
      this.resetStreamEndState()
    }
    const lastEventData = this.streamEndState.lastEventData || {}
    const conversationId = data.conversation_id || data.conversationId || lastEventData.conversationId || this.conversationId || ''
    const messageId = data.message_id || data.messageId || data.id || lastEventData.messageId || ''
    const files = Array.isArray(data?.files) ? data.files : (lastEventData.files || [])
    const chatResult = data?.chatResult || lastEventData.chatResult || {}
    this.streamEndState.lastEventData = {
      conversationId,
      messageId,
      files,
      chatResult
    }
    if (conversationId) {
      this.conversationId = conversationId
    }
  }
  /**
   * 统一触发 messageEnd，确保一条流式请求最多只触发一次。
   */
  emitMessageEnd(botMessageIndex: any, searchEnabled?: any, data: any = {}, extraData: any = {}) {
    if (this.streamEndState?.hasMessageEnd) {
      return
    }
    this.cacheStreamEndData(data)
    const lastEventData = this.streamEndState?.lastEventData || {}
    this.streamEndState.hasMessageEnd = true
    this.callback('messageEnd', {
      index: botMessageIndex,
      conversationId: lastEventData.conversationId || this.conversationId,
      messageId: lastEventData.messageId,
      searchEnabled,
      files: (lastEventData.files ?? []).map((its: any) => {
        return {
          id: its.id || its.related_id,
          name: its.filename,
          size: its.size,
          url: its.url?.replace(/\/files\/tools\//g, `${aiServer}files/tools/`) || its.url
        }
      }),
      chatResult: lastEventData.chatResult || {},
      ...extraData
    })
  }
  /**
   * 统一触发 workflowFinished，确保一条流式请求最多只触发一次。
   */
  emitWorkflowFinished(botMessageIndex: any, node?: any) {
    if (this.streamEndState?.hasWorkflowFinished) {
      return
    }
    if (!this.streamEndState) {
      this.resetStreamEndState()
    }
    this.streamEndState.hasWorkflowFinished = true
    if (node) {
      this.streamEndState.workflowNode = node
    }
    this.callback('workflowFinished', {
      index: botMessageIndex,
      node: node || this.streamEndState.workflowNode
    })
  }
  /**
   * 判断工作流结束事件是否为失败状态。
   * Dify 工作流失败时通常不会再单独推送 error 事件，而是在 workflow_finished.data.status 中标记 failed。
   */
  isWorkflowFinishedFailed(data: any = {}) {
    return data?.event === 'workflow_finished' && data?.data?.status === 'failed'
  }
  /**
   * 提取工作流失败原因，优先使用后端返回的 data.error。
   * 如果错误字段缺失，则回退到完整事件内容，方便排查不同网关/插件返回格式。
   */
  getWorkflowFinishedErrorMsg(data: any = {}) {
    const errorMsg = data?.data?.error || data?.error || data?.message
    if (typeof errorMsg === 'string' && errorMsg.trim()) {
      return errorMsg
    }
    return JSON.stringify(data || {})
  }
  /**
   * 处理 workflow_finished 返回 failed 的场景。
   * 该场景属于服务端正常结束 SSE，但业务执行失败，因此需要主动关闭 loading 并抛给页面 loadError。
   */
  handleWorkflowFinishedFailed(data: any = {}, botMessageIndex: any, searchEnabled?: any, agentId?: any) {
    const errorMsg = this.getWorkflowFinishedErrorMsg(data)
    this.flushSmoothOutput(botMessageIndex)
    recordRequestEnd({
      endType: 'error',
      errorMsg,
      messageIndex: botMessageIndex
    });
    this.emitWorkflowFinished(botMessageIndex, data?.data)
    this.callback('loading', false)
    this.callback('loadError', {
      index: botMessageIndex,
      errorType: 'workflow_failed',
      searchEnabled,
      errorMsg,
      messageId: data?.message_id || data?.messageId || data?.id,
      agentId
    })
    this.requestTask();
    this.reset();
  }
  /**
   * 在流真正结束时统一补齐缺失事件，并完成 reset/loading 收尾。
   * 这样可以避免 workflow_finished 先到时过早 reset，导致后续 message_end 丢失。
   */
  finalizeStreamCompletion(botMessageIndex: any, searchEnabled?: any) {
    if (!this.streamEndState || this.streamEndState.isClosed) {
      return
    }
    this.streamEndState.isClosed = true
    if (!this.streamEndState.hasWorkflowFinished) {
      this.emitWorkflowFinished(botMessageIndex, this.streamEndState.workflowNode)
    }
    if (!this.streamEndState.hasMessageEnd) {
      this.emitMessageEnd(botMessageIndex, searchEnabled, this.streamEndState.lastEventData)
    }
    this.requestTask()
    this.reset()
    this.callback('loading', false)
  }
  /**
   * 读取并标准化假流式配置。
   */
  applySmoothOutputConfig(rawConfig: any = {}) {
    const config = rawConfig || {};
    this.smoothOutputEnabled = typeof config.enabled === 'boolean' ? config.enabled : false;
    this.smoothOutputIntervalMs = Math.max(5, Number(config.intervalMs ?? 20) || 20);
    this.smoothOutputFixedStep = Math.max(0, Number(config.step ?? 0) || 0);
    this.smoothOutputMinStep = Math.max(1, Number(config.minStep ?? 1) || 1);
    this.smoothOutputMaxStep = Math.max(this.smoothOutputMinStep, Number(config.maxStep ?? 12) || 12);
  }
  /**
   * 从系统参数生成假流式配置。
   * 规则：参数为空/0/非数字 => 关闭假流式；参数>0 => 开启，且值越小越慢。
   */
  getSmoothOutputConfigFromSysParam() {
    const rawValue = this.commonHook?.getSysParam?.(SMOOTH_OUTPUT_SYS_PARAM_KEY);
    const parsed = Number(rawValue);
    if (!rawValue || Number.isNaN(parsed) || parsed <= 0) {
      return {
        enabled: false,
        intervalMs: 80,
        step: 0,
        minStep: 1,
        maxStep: 6,
        rawValue
      };
    }
    const speedLevel = Math.max(1, Math.floor(parsed));
    return {
      enabled: true,
      intervalMs: 80,
      step: 0,
      minStep: 1,
      maxStep: Math.min(12, speedLevel),
      rawValue
    };
  }
  /**
   * 停止假流式输出并清空临时缓冲状态。
   */
  stopSmoothOutput() {
    if (this.smoothOutputTimer) {
      clearInterval(this.smoothOutputTimer);
      this.smoothOutputTimer = null;
    }
    this.smoothOutputBuffer = "";
    this.smoothOutputIndex = -1;
  }
  /**
   * 将 currentBotMessage 渲染到 UI。
   */
  renderCurrentMessage(botMessageIndex: any) {
    this.currentBotMessage = this.currentBotMessage.replace(
      /<think>([\s\S]*?)<\/think>/gi,
      ""
    );
    if (this.currentBotMessage.indexOf('](/files/tools/') > -1) {
      this.currentBotMessage = this.currentBotMessage.replace(/\]\(\/files\/tools\//g, `](${aiServer}files/tools/`)
    }
    this.callback('updateContent', {
      index: botMessageIndex,
      content: this.currentBotMessage
    })
    if(this.isNeedScroll) {
      this.callback('scrollToBottom', false)
    }
  }
  /**
   * 启动假流式定时输出。
   */
  startSmoothOutput(botMessageIndex: any) {
    if (this.smoothOutputTimer) return;
    this.smoothOutputIndex = botMessageIndex;
    this.smoothOutputTimer = setInterval(() => {
      if (!this.smoothOutputBuffer) {
        this.stopSmoothOutput();
        return;
      }
      const dynamicStep = Math.min(
        this.smoothOutputMaxStep,
        Math.max(this.smoothOutputMinStep, Math.ceil(this.smoothOutputBuffer.length / 20))
      );
      const outputStep = this.smoothOutputFixedStep > 0 ? this.smoothOutputFixedStep : dynamicStep;
      const part = this.smoothOutputBuffer.slice(0, outputStep);
      this.smoothOutputBuffer = this.smoothOutputBuffer.slice(outputStep);
      this.currentBotMessage += part;
      this.renderCurrentMessage(botMessageIndex);
    }, this.smoothOutputIntervalMs);
  }
  /**
   * 写入待输出内容。
   */
  enqueueSmoothOutput(answer: string, botMessageIndex: any) {
    if (!answer) return;
    if (!this.smoothOutputEnabled) {
      this.currentBotMessage += answer;
      this.renderCurrentMessage(botMessageIndex);
      return;
    }
    if (this.smoothOutputIndex !== -1 && this.smoothOutputIndex !== botMessageIndex) {
      this.flushSmoothOutput(this.smoothOutputIndex);
    }
    this.smoothOutputBuffer += answer;
    this.startSmoothOutput(botMessageIndex);
  }
  /**
   * 立即输出剩余缓冲并停止定时器。
   */
  flushSmoothOutput(botMessageIndex: any) {
    if (this.smoothOutputTimer) {
      clearInterval(this.smoothOutputTimer);
      this.smoothOutputTimer = null;
    }
    if (this.smoothOutputBuffer) {
      this.currentBotMessage += this.smoothOutputBuffer;
      this.smoothOutputBuffer = "";
      this.renderCurrentMessage(botMessageIndex);
    }
    this.smoothOutputIndex = -1;
  }
  // 指令API - 实例上调用  agentApi目前已弃用
  async agentApi(text: any, botMessageIndex: number, params?: any,otherParams?:any) {
    config.nowToken = otherParams?.apiToken ?? ''
    // 获取请求地址
    const url = config.agentUrl;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${otherParams?.apiToken}`, // API 认证
    };
    // 拼装请求体
    const body = {
      query: text,
      conversation_id: "", // 会话id
      inputs: {
        ...params,
        query: text,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      response_mode: "streaming", // 流式响应模式
      user: this.commonHook.userBaseInfo.userName, // 用户名,
      files: [], // 可能后续需要传附件
    };
    // 发送请求前，记录请求体到 lastStreamOutputs
    recordRequestStart(body);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!response || response.status != 200) {
        throw new Error("server error");
      }
      if (!response.body) throw new Error("Stream not supported!");
      this.reader = response.body.getReader(); // 获取流式 reader
      console.log('reader', this.reader)
      const decoder = new TextDecoder("utf-8");
      while (true) {
        // 读取是一个主动的过程，可以结合websocket比较其中的差异
        const { value, done } = await this.reader.read();
        if (done) {
          break;
        }
        // 解码后拼装
        const chunk = decoder.decode(value, { stream: true });
        this.buffer += chunk; // 累积数据
        let lines = this.buffer.split("\n\n"); // ?? 
        let completeLines = [];
        let tempBuffer = "";

        // 分割并检查完整 JSON
        for (let i = 0; i < lines.length; i++) {
          tempBuffer += (tempBuffer ? "\n\n" : "") + lines[i];
          if (tempBuffer.startsWith("data:")) {
            const jsonString = tempBuffer.substring(5).trim();
            if (
              jsonString &&
              jsonString !== "[DONE]" &&
              isCompleteJson(jsonString)
            ) {
              completeLines.push(tempBuffer);
              tempBuffer = "";
            }
          } else {
            // 如果不是data:开头，则直接拼装, 认为其是一个json
            completeLines.push(tempBuffer);
            tempBuffer = "";
          }
        }
        this.buffer = tempBuffer;

        // 处理完整的 JSON 数据
        for (const line of completeLines) {
          if (line.startsWith("data:")) {
            const jsonString = line.substring(5).trim();
            if (!jsonString || jsonString === "[DONE]") continue;
                try {
                  const data = JSON.parse(jsonString);
                  this.cacheStreamEndData(data)
                  // 记录流式输出数据（在解析后立即记录）
                  recordStreamOutput(data, botMessageIndex, this.conversationId, this.taskId);
              // TODO ？？？
              if (data.event === "workflow_finished") {
                if (this.isWorkflowFinishedFailed(data)) {
                  this.handleWorkflowFinishedFailed(data, botMessageIndex, params?.searchEnabled)
                  return;
                }
                this.requestTask();
                // this.handleEvent(data.data.outputs, botMessageIndex);
                this.callback('handleEvent', {
                  outputs: data.data.outputs,
                  index: botMessageIndex
                })
                this.callback('workflowFinished', {
                  index: botMessageIndex
                })
              } else if (data.event == "workflow_started") {
                this.requestTask(data.task_id, "agent");
              }
            } catch (error) {
              // 后续如果JSON解析失败，则控制台打开错误日志
              console.error(
                "JSON parsing failed:",
                error,
                "Line:",
                jsonString
              );
            }
          }
        }
      }
    } catch (er) {
      console.log('er', er)
      recordRequestEnd({
        endType: 'catch',
        errorMsg: JSON.stringify(er),
        messageIndex: botMessageIndex
      });
      this.callback('loading', false)
      this.callback('loadError', {
        status: 'finished',
        errorType: 'catch',
        content: "系统繁忙，请稍后再试",
        searchEnabled: params?.searchEnabled,
        index: botMessageIndex,
        errorMsg:JSON.stringify(er)
      })
      setTimeout(() => {
        this.reset();
      });

      }
  }
  // 获取 AI 信息
  async agentInfo(text: any, params?: any, dObj?: any) {
     const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config[dObj['apiKey']]}`, // API 认证
    };
    const body = {
      query: text,
      conversation_id: "", // 会话id
      inputs: {
        ...params,
        query: text,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      response_mode: "blocking", // 流式响应模式
      user: this.commonHook.userBaseInfo.userName, // 用户名,
      files: [],
    };
    const url = config.agentUrl;
    try {
      const response: any = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }).then(res => res.json())

      dObj.callback('data', response?.data?.outputs)
    }catch (error) { 
    }
  }
  // 流式对话
  async streamApi (text: any, botMessageIndex: any, params?: any, otherParams?: any) {
    console.log("otherParams",otherParams)
    const smoothOutputConfig = this.getSmoothOutputConfigFromSysParam();
    this.applySmoothOutputConfig(smoothOutputConfig);
    console.log("[smoothOutput] sysParam:", {
      key: SMOOTH_OUTPUT_SYS_PARAM_KEY,
      value: smoothOutputConfig.rawValue
    });
    console.log("[smoothOutput] active config:", {
      enabled: this.smoothOutputEnabled,
      intervalMs: this.smoothOutputIntervalMs,
      step: this.smoothOutputFixedStep,
      minStep: this.smoothOutputMinStep,
      maxStep: this.smoothOutputMaxStep
    });

    // 检查网络状态
    if (!this.isNetworkOnline) {
      this.callback('loading', false);
      this.callback('loadError', {
        index: botMessageIndex,
        errorType: 'network',
        searchEnabled: params?.searchEnabled,
        content: "网络连接已断开，请检查网络设置",
        errorMsg:"网络连接已断开，请检查网络设置",
        agentId:otherParams?.agentId
      });
      return;
    }

    // 创建新的 AbortController
    this.abortController = new AbortController();
    this.isRequestAborted = false;
    this.currentIndex = botMessageIndex;
    this.resetStreamEndState()

    // 获取请求地址
    // let url = config.dialogUrl; // API 地址
    let url = config.newDialogUrl
    if (otherParams?.isRPA) { 
      url = config.rpaUrl
    }
    let logArr = []
    // let headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${otherParams?.apiToken}`, // API 认证
    // }
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, // API 认证
    }
    let nowToken = otherParams?.apiToken ?? '';
    if(otherParams?.conversationId != null){
      this.conversationId = otherParams?.conversationId ?? '';
    }
    // 当前菜单配置了apitoken
    // if(this.route.meta?.apiToken) {
    //   nowToken = this.route?.meta?.apiToken
    // }
    // headers.Authorization = `Bearer ${nowToken}`
    config.nowToken = nowToken
    // 有附件去掉上下文，防止有影响
    let isFileCanFlag = !otherParams || !otherParams.isFileCan
    if (isFileCanFlag && (params?.fileList?.length > 0 || otherParams?.newConversationId)) {
      this.conversationId = ''
    }
    // 拼装请求体
    let files = (params?.files ?? params?.fileList ?? []).map((file: any) => {
      return {
        transfer_method: "remote_url",
        type: file.type,
        url: file.url,
      };
    }).filter((file: any) => getFileType(file.url) !== 'ofd');
    const customInputs =
      params?.inputs && typeof params.inputs === 'object' ? this.normalizeStreamInputs(params.inputs) : {};
    const normalizedModel = await this.normalizeStreamModel(params?.model, params?.modelName);
    const { inputs: _ignoredInputs, model: _ignoredModel, modelName: _ignoredModelName, ...streamParams } = params || {};
    const normalizedStreamParams = normalizedModel
      ? { ...streamParams, model: normalizedModel }
      : streamParams;
    let body: any = {
      agentId:otherParams?.agentId,
      query: text,
      conversation_id: this.conversationId, // 会话id
      hotWordReplace: params?.hotWordReplace,
      inputs: {
        // 合并顺序很重要：系统参数先写入，用户自定义入参最后覆盖。
        // 如果用户自定义变量名与系统字段重名，按需求优先使用用户填写的值。
        ...normalizedStreamParams,
        fileList: files,
        baseUrl: window.location.origin,
        token: `Bearer ${getToken()}`,
        // ip: import.meta.env.MODE === 'development' ? 'https://ai.gdghg.com' : window.location.origin, // 如果是开发环境，则使用172.16.1.220:8086，如果是生产环境，则使用import.meta.env.VITE_IP
        // ip: import.meta.env.MODE === 'development' ? 'https://10.130.237.128:8086' : window.location.origin, // 如果是开发环境，则使用172.16.1.220:8086，如果是生产环境，则使用import.meta.env.VITE_IP
        ip: import.meta.env.MODE === 'development' ? 'https://172.16.1.220:8086' : window.location.origin, // 如果是开发环境，则使用172.16.1.220:8086，如果是生产环境，则使用import.meta.env.VITE_IP
        correspondingGroupName: this.commonHook.userBaseInfo.correspondingGroupName || '', // 登录人职级
        postName: this.commonHook.userBaseInfo.postName || '', // 登录人职位
        deptName: this.commonHook.userBaseInfo?.companyDept?.deptName || '', // 登录人所在企业
        deptId: this.commonHook.userBaseInfo?.companyDept?.deptId, // 企业Id
        currentDeptName: this.commonHook.userBaseInfo?.deptName || '', // 当前登录人所在部门
        userName: this.commonHook.userBaseInfo.userName, // 登录人账户
        ...customInputs
      },
      response_mode: "streaming", // 流式响应模式
      user: this.commonHook.userBaseInfo.userName,
      files: files
    };

    // rpa
    if (otherParams?.isRPA) { 
      body = {
        query: text,
        agentId: otherParams?.agentId,
        conversation_id: otherParams?.conversationId,
        ...normalizedStreamParams,
        fileList: files,
      }
    }
    // 发送请求前，记录请求体到 lastStreamOutputs
    recordRequestStart(body);
    
    // 发送请求
    try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: this.abortController.signal // 添加信号控制
          });
          if (!response || response.status != 200) {
            throw new Error("server error");
          }
          if (!response.body) throw new Error("Stream not supported!");

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('text/event-stream')) {
            // 不是 SSE，可能是错误信息或普通 JSON
            const fallbackData = await response.text();
            console.warn('Not an event stream, got:', fallbackData);
            let msg = ''
            try {
              const json = JSON.parse(fallbackData);
              // 处理错误，比如显示提示
              msg = json.msg
            } catch (e) {
            }
            throw new Error(msg || '服务异常');
          }
          this.reader = response.body.getReader(); // 获取流式 reader
          const decoder = new TextDecoder("utf-8");
          this.isInThought = false;
          this.thoughtContent = "";
          
          // 流式读取器
          while (true) {
            // console.log("this.reader",this.reader)
            const { value, done } = await this.reader.read();
            if (done) {
              // 处理剩余缓冲区；若其中包含 workflow failed，则错误流程已经完成收尾，直接结束读取。
              const hasHandledBufferError = this.buffer ? this.processBuffer(botMessageIndex, params.searchEnabled, otherParams?.agentId) : false;
              if (hasHandledBufferError) {
                logArr = []
                break;
              }
              // 如果正在思考，则保存并折叠思考过程
              if (this.isInThought && this.thoughtContent) {
                this.updateThoughts(botMessageIndex, this.thoughtContent, true); // 保存并折叠思考过程
                this.thoughtContent = "";
                this.isInThought = false;
              }
              this.callback('thoughtFinished', {
                index: botMessageIndex
              })
              this.finalizeStreamCompletion(botMessageIndex, params.searchEnabled)
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            this.buffer += chunk; // 累积数据
            let lines = this.buffer.split("\n\n");
            // console.log('lines', lines, this.buffer)
            let completeLines = [];
            let tempBuffer = "";
  
            // 分割并检查完整 JSON
            for (let i = 0; i < lines.length; i++) {
              tempBuffer += (tempBuffer ? "\n\n" : "") + lines[i];
              if (tempBuffer.startsWith("data:")) {
                const jsonString = tempBuffer.substring(5).trim();
                if (
                  jsonString &&
                  jsonString !== "[DONE]" &&
                  isCompleteJson(jsonString)
                ) {
                  completeLines.push(tempBuffer);
                  tempBuffer = "";
                }
              } else {
                completeLines.push(tempBuffer);
                tempBuffer = "";
              }
            }
            // 此处赋值是将剩余的不完整数据，留到下一次循环处理
            this.buffer = tempBuffer;
            
            // console.log('completeLines', completeLines)
            // 处理完整的 JSON 数据
            for (const line of completeLines) {
              if (line.startsWith("data:")) {
                const jsonString = line.substring(5).trim();
                if (!jsonString || jsonString === "[DONE]") continue;
                try {
                  const data = JSON.parse(jsonString);
                  this.cacheStreamEndData(data)
                  // 记录流式输出数据（在解析后立即记录，记录所有事件类型）
                  recordStreamOutput(data, botMessageIndex, this.conversationId, this.taskId);
                  // console.log('long消息节点', data)
                  // 处理工作流相关事件
                  if(data.event === 'node_started') {
                    // 某个工作流节点开始执行
                    // 例如：对话节点、知识库检索节点、代码执行节点等
                    if (!data.data.iteration_id && !data.data.loop_id ) {
                      this.callback('nodeStarted', {
                        index: botMessageIndex,
                        node: data.data
                      })
                    }
                  } else if(data.event === 'node_finished') {
                    // 某个工作流节点执行完成
                    // 获取该节点的输出结果
                    if (!data.data.iteration_id && !data.data.loop_id ) {
                      this.callback('nodeFinished', {
                        index: botMessageIndex,
                        node: data.data
                      })
                    }
                  } else if (data.event === 'iteration_started') {
                    // 某个迭代开始执行
                    // 例如：循环节点、批量处理节点等
                    this.callback('iterationStarted', {
                        index: botMessageIndex,
                        node: data.data
                      })
                  } else if (data.event === 'iteration_completed') {
                    // 某个迭代执行完成
                    // 获取该节点的输出结果
                    this.callback('iterationFinished', {
                        index: botMessageIndex,
                        node: data.data
                      })
                  } else if (data.event === 'loop_started') {
                    // 某个循环开始执行
                    // 例如：循环节点、批量处理节点等
                    this.callback('loopStarted', {
                        index: botMessageIndex,
                        node: data.data
                      })
                  } else if (data.event === 'loop_completed') {
                    // 某个循环执行完成
                    // 获取该节点的输出结果
                    this.callback('loopFinished', {
                        index: botMessageIndex,
                        node: data.data
                      })
                  }
                  // 代码节点
                  if (data.event === "node_finished" && data?.data?.node_type == 'code') {
                     this.callback('code', {
                      index: botMessageIndex,
                      outputs: data?.data?.outputs || {}
                     })
                  }
                  // 工具节点
                  if(data.event === "node_finished" && data?.data?.node_type == 'tool'){
                     this.callback('tool', {
                      index: botMessageIndex,
                      outputs: data?.data?.outputs || {}
                     })
                  }
                  if (data.event === "node_finished" && (data?.data?.node_type == 'llm' || data?.data?.node_type == 'question-classifier')) {
                    // 大模型 token 
                    logArr.push({
                      type: 0, // 0 正确  1错误 
                      dataType:"1", //数据类型 1-token用量，2-调用记录
                      agentId: otherParams?.agentId,
                      tokenNum: data?.data?.process_data?.usage?.total_tokens,//token用量 ，数量类型为token用量时必传
                      modelName: data?.data?.process_data?.model_name // 模型名称
                    })
                  }
                  if (data.thinkType) {
                    // this.conversationId = data.conversation_id;
                    this.callback('thinkType',  {
                      index: botMessageIndex,
                      data
                    })
                    if (data.thinkType === 'start') {
                      this.requestTask(data.taskId, "rpa");
                    }
                  } else if(data.taskId && data.answer === '请求已手动终止'){
                    const stopNode = {
                      status: 'stopped'
                    }
                    this.flushSmoothOutput(botMessageIndex);
                    aiModelAddLog(logArr)
                    recordRequestEnd({
                      endType: 'error',
                      errorMsg: '请求已手动终止',
                      messageIndex: botMessageIndex
                    });
                    this.callback('loading', false)
                    // 手动终止时先抛 loadError，让页面先同步写入“已停止内容生成”和 error 状态。
                    // 随后的 messageEnd 仍可执行页面收尾逻辑，但不会再把空 content 按 finished 保存。
                    const stopErrorResult = this.callback('loadError', {
                      index: botMessageIndex,
                      errorType: 'stop',
                      searchEnabled: params.searchEnabled,
                      errorMsg:'请求已手动终止',
                      messageId: data.messageId || data.message_id || data.id,
                      agentId:otherParams?.agentId
                    })
                    if (stopErrorResult && typeof stopErrorResult.then === 'function') {
                      await stopErrorResult
                    }
                    // 手动停止也需要触发 messageEnd，保证页面层仍然能执行单据卡片等收尾逻辑。
                    // 这里额外透出 stopped 状态，兼容已有页面里对 node.status 的判断。
                    this.emitMessageEnd(botMessageIndex, params.searchEnabled, data, {
                      node: stopNode,
                      isStopped: true
                    })
                    this.emitWorkflowFinished(botMessageIndex, stopNode)
                    this.requestTask();
                    this.reset();
                    logArr = []
                    return;
                    // {
                    //   "answer": "请求已手动终止",
                    //   "created_at": 1764834090914,
                    //   "event": "message",
                    //   "id": "c19a62fc-901b-4400-9b17-ca7252078f42",
                    //   "messageId": "c19a62fc-901b-4400-9b17-ca7252078f42",
                    //   "taskId": "836d3e20-d72a-41b5-8b41-386ee87e1ef2"
                    // }
                  }

                  // 消息节点
                  if (data.event === "message") {
                    this.handleMessageEvent(data, botMessageIndex);
                  } else if (data.event === "node_finished") {
                    let _dd = []
                    if(data?.data?.node_type == 'code' && data?.data?.outputs?.metadata){
                      _dd = JSON.parse(data?.data?.outputs?.metadata)
                    }else if(data?.data?.node_type == 'knowledge-retrieval' && data?.data?.outputs?.result){
                      _dd = data?.data?.outputs?.result
                    }
                    if(_dd.length){
                      try {
                        this.callback('metadata', {
                          index: botMessageIndex,
                          metadata: _dd.map((itts: any) => {
                            return {
                              content:itts.content_with_weight,
                              score:itts.similarity,
                              document_name: itts.docnm_kwd || itts.document_name || itts.title,
                              ...itts,
                              ...itts.metadata
                            }
                          })
                        })
                      } catch (error) {
                        console.error('元数据处理失败', error)
                      }
                    } 
                  }else if (data.event === "message_end") {
                    this.flushSmoothOutput(botMessageIndex);
                    // token 增量
                    aiModelAddLog(logArr) 
                    this.emitMessageEnd(botMessageIndex, params.searchEnabled, data)
                    // setTimeout(() => {
                    //   window.tempEchartsData = {}
                    // }, 200)
                    logArr = []
                  } else if (data.event === "error") {
                    this.flushSmoothOutput(botMessageIndex);
                    recordRequestEnd({
                      endType: 'error',
                      errorMsg: JSON.stringify(data.message || data),
                      messageIndex: botMessageIndex
                    });
                    this.callback('loading', false)
                    this.callback('loadError', {
                      index: botMessageIndex,
                      errorType: 'error',
                      searchEnabled: params.searchEnabled,
                      errorMsg:JSON.stringify(data.message || data),
                       messageId:data.messageId,
                      agentId:otherParams?.agentId
                    })
                    setTimeout(() => {
                      this.reset();
                    });
                    logArr = []
                  } else if (data.event == "workflow_started") {
                    this.requestTask(data.task_id, "stream");
                    this.callback('workflowStarted', {
                      index: botMessageIndex,
                      node: data.data
                    })
                  } else if (data.event === "workflow_finished") {
                    if (this.isWorkflowFinishedFailed(data)) {
                      this.handleWorkflowFinishedFailed(data, botMessageIndex, params.searchEnabled, otherParams?.agentId)
                      logArr = []
                      return;
                    }
                    this.emitWorkflowFinished(botMessageIndex, data.data)
                  }
                } catch (error) {
                  console.error(
                    "JSON parsing failed:",
                    error,
                    "Line:",
                    jsonString
                  );
                  logArr = []
                }
              }
            }
          }
        } catch (er) {
          this.flushSmoothOutput(botMessageIndex);
          console.error("error",er)
          recordRequestEnd({
            endType: this.isRequestAborted ? 'aborted' : 'catch',
            errorMsg: JSON.stringify(er),
            messageIndex: botMessageIndex
          });
          this.callback('loading', false)
          this.callback('loadError', {
            index: botMessageIndex,
            errorType: 'catch',
            searchEnabled: params.searchEnabled,
            errorMsg:JSON.stringify(er),
            agentId:otherParams?.agentId
          })
          setTimeout(() => {
            this.reset();
          });
        }
        // this.callback('loading', false)
  }

  
  // 下载
  async downloadFile(fileId: any, modelType: string="dialog") {
    let token = config.dialogToken
    // 当前菜单配置了apitoken
    if(this.route.meta?.apiToken) {
      token = this.route?.meta?.apiToken
    }
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // API 认证
    }

    await fetch(config.getDownloadUrl(fileId), {
      method: "get",
      headers
    });
  }
  /**
   * 处理缓冲区中剩余的数据
   * @param {number} botMessageIndex - bot 消息索引
   */
  /**
   * 处理缓冲区中剩余的数据
   * @param {number} botMessageIndex - bot 消息索引
   */
  processBuffer(botMessageIndex: any, searchEnabled?: any, agentId?: any) {
    if (!this.buffer) return false;
    const lines = this.buffer.split("\n\n");
    this.buffer = "";
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const jsonString = line.substring(5).trim();
        
        // 添加检查，确保不是 [DONE](file:///D:/Netinfo/netinfo_ai/web/pc/src/views/agent/ai/user-ai.ts#L48-L48) 标记且是完整的 [JSON](file:///D:/Netinfo/netinfo_ai/web/pc/src/views/agent/ai/user-ai.ts#L706-L740)
        if (!jsonString || jsonString === "[DONE]") continue;
        
        // 先检查是否是完整的 [JSON](file:///D:/Netinfo/netinfo_ai/web/pc/src/views/agent/ai/user-ai.ts#L706-L740) 再尝试解析
        if (isCompleteJson(jsonString)) {
          try {
            const data = JSON.parse(jsonString);
            this.cacheStreamEndData(data)
            // 记录流式输出数据
            recordStreamOutput(data, botMessageIndex, this.conversationId, this.taskId);
            if (data.event === "message") {
              this.handleMessageEvent(data, botMessageIndex);
            } else if (data.event === "message_end") {
              this.flushSmoothOutput(botMessageIndex);
              this.emitMessageEnd(botMessageIndex, searchEnabled, data)
            } else if (data.event === "workflow_finished") {
              if (this.isWorkflowFinishedFailed(data)) {
                this.handleWorkflowFinishedFailed(data, botMessageIndex, searchEnabled, agentId)
                return true;
              }
              this.emitWorkflowFinished(botMessageIndex, data.data)
            } else if (data.event === "error") {
              this.flushSmoothOutput(botMessageIndex);
              console.error("Error:", data);
              recordRequestEnd({
                endType: 'error',
                errorMsg: JSON.stringify(data.message || data),
                messageIndex: botMessageIndex
              });
              this.callback('loading', false)
              this.callback('loadError', {
                index: botMessageIndex,
                errorType: 'error',
                searchEnabled: searchEnabled,
                errorMsg: JSON.stringify(data.message || data),
                messageId: data.messageId
              })
            }
          } catch (error) {
            // 这里仍然保留捕获，以防 [isCompleteJson](file:///D:/Netinfo/netinfo_ai/web/pc/src/views/agent/ai/user-ai.ts#L24-L51) 判断失误
            console.error("Final buffer JSON parsing failed:", error, "Line:", jsonString);
            recordRequestEnd({
              endType: 'catch',
              errorMsg: `Final buffer JSON parsing failed: ${error}`,
              messageIndex: botMessageIndex
            });
            this.callback('loading', false)
            this.callback('loadError', {
              index: botMessageIndex,
              errorType: 'catch',
              searchEnabled: searchEnabled,
              errorMsg: `Final buffer JSON parsing failed: ${error}`
            })
          }
        } else {
          // 如果 [JSON](file:///D:/Netinfo/netinfo_ai/web/pc/src/views/agent/ai/user-ai.ts#L706-L740) 不完整，跳过这条数据
          console.warn("Skipping incomplete JSON in buffer:", jsonString);
          continue;
        }
      }
    }
    return false;
  }

  /**
   * 处理流式 API 的 message 事件
   * @param {Object} data - 解析后的 JSON 数据
   * @param {number} botMessageIndex - bot 消息索引
   */
  handleMessageEvent(data: any, botMessageIndex: any) {
    const answer = data.answer || "";
    // console.log('消息answer', answer)
    // 可能有多个消息
    const startThing = answer.indexOf("<think>") > -1 || data.thinkType === 'start';
    const endThing = answer.indexOf("</think>") > -1 || data.thinkType === 'end';

    if (startThing && !endThing) {
      // 有开始 没有结束
      this.handleThoughtStart(answer, botMessageIndex, data); // 开始思考过程
    } else if (!startThing && endThing) {
      // 没有开始 有结束
      this.handleThoughtEnd(answer, botMessageIndex, data); // 结束思考过程
    } else if (this.isInThought) {
      // 在思考中
      this.handleThoughtUpdate(answer, botMessageIndex, data); // 更新思考过程
    } else {
      // 没有思考
      this.handleNormalMessage(answer, botMessageIndex); // 处理普通消息
      this.callback('thoughtFinished', {
        index: botMessageIndex
      })
    }

    setTimeout(() => {
      // 智能滚动
      if(this.isNeedScroll) {
        this.callback('scrollToBottom', false)
      }
    })
  }

  /**
   * 更新并渲染思考过程
   * @param {number} botMessageIndex - bot 消息索引
   * @param {string} content - 思考过程内容
   * @param {boolean} shouldCollapse - 是否折叠 
   */
  updateThoughts(botMessageIndex: any, content: any, shouldCollapse: any) {
    this.callback('updateThoughts', {
      index: botMessageIndex,
      thoughts: content.replace(/\n/g, '') ? content : '',
      thoughtsOpen: !shouldCollapse // 如果当前是正在思考，则显示思考的内容，如果当前已经思考完成，则不显示思考内容，转而显示最终的回复
    })
  }
  // rpa特殊处理
  thoughtRpaDeal (type: string, content: any) {
    let nowThought = this.thoughtContent
    if (nowThought.startsWith('{') && nowThought.endsWith('}')) {
      nowThought = JSON.parse(nowThought)
      nowThought[type] = content
      this.thoughtContent = JSON.stringify(nowThought)
    } else {
       this.thoughtContent = JSON.stringify({
        [type]: content
       })
    }
  }
  /**
   * 处理思考过程开始
   * @param {string} answer - 当前数据片段
   * @param {number} botMessageIndex - bot 消息索引
   */
  handleThoughtStart(answer: any, botMessageIndex: any, data?: any) {
    // 设置思考状态
    this.isInThought = true;
    const startIndex = answer.indexOf("<think>") + 7;
    let thoughtPart = answer.substring(startIndex);
    if (data?.thinkType) {
      // ask_user 类型不需要更新思考内容，由 rpaThink 方法处理
      if (data.thinkType !== 'ask_user') {
        this.thoughtRpaDeal(data.thinkType, data.thinkTitle || '')
      }
    } else {
      // 设置思考内容
      this.thoughtContent = thoughtPart;
    }
    // console.log('思考过程', this.thoughtContent)
    // 更新思考过程
    this.updateThoughts(botMessageIndex, this.thoughtContent, false); // 显示思考过程
  }

  /**
   * 更新思考过程内容
   * @param {string} answer - 当前数据片段
   * @param {number} botMessageIndex - bot 消息索引
   */
  handleThoughtUpdate(answer: any, botMessageIndex: any, data?: any) {
    // console.log('思考过程更新', answer)
    // 设置思考内容 累加
   
    if (data?.thinkType) {
      // stepInfo 需要更新思考内容
      if (['stepInfo'].includes(data?.thinkType)) {
        this.thoughtRpaDeal(data.thinkType, data.think || '')
      }
    } else {
       this.thoughtContent += answer;
    }
    // 更新思考过程
    this.updateThoughts(botMessageIndex, this.thoughtContent, false); // 实时更新
  }

  /**
   * 处理思考过程结束
   * @param {string} answer - 当前数据片段
   * @param {number} botMessageIndex - bot 消息索引
   */
  handleThoughtEnd(answer: any, botMessageIndex: any, data?: any) {
    // 思考过程结束
    this.callback('thoughtFinished', {
      index: botMessageIndex
    })

    // 设置思考状态
    this.isInThought = false;
    // 获取思考过程结束的索引
    const endIndex = answer.indexOf("</think>");
    const thoughtPart = answer.substring(0, endIndex);
    if (data?.thinkType) {
      // thoughtPart = this.thoughtContent
    } else {
      this.thoughtContent += thoughtPart;
    }
    // console.log('思考过程结束', thoughtPart) 
    // 累加思考过程
    // 更新思考过程 保存并折叠
    this.thoughtContent && this.updateThoughts(botMessageIndex, this.thoughtContent, true); // 保存并折叠
    // 清空思考过程
    this.thoughtContent = "";
    // 处理思考后的内容
    const remainingPart = answer.substring(endIndex + 8);
    if (remainingPart) {
      this.enqueueSmoothOutput(remainingPart, botMessageIndex);
    }
  }

  /**
   * 处理普通消息内容
   * @param {string} answer - 当前数据片段
   * @param {number} botMessageIndex - bot 消息索引
   */
  handleNormalMessage(answer: any, botMessageIndex: any) {
    this.enqueueSmoothOutput(answer, botMessageIndex);
  }

  // 停止对话
  // TODO疑问: 调用接口后，流式消息会如何，是停止推送还是直接推送结束？
  async stopApi(agentId?:any, sessionId?:any) {
    if(!this.taskId) return
    if (this.taskType === "agent") {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.nowToken}`, // API 认证
      }
      return fetch(config.agentStop(this.taskId), {
        method: 'POST', headers, body: JSON.stringify({
          user: this.commonHook.userBaseInfo.userName, // 用户名,
        })
      })
    } else if (this.taskType === "rpa") {
      return rpaStop(this.taskId, {
          user: this.commonHook.userBaseInfo.userName, // 用户名,
          agentId,
          taskId: this.taskId
        })
    } else {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`, // API 认证
      }
      return fetch(config.dialogStop(this.taskId), {
        method: 'POST', headers, body: JSON.stringify({
          // user: this.commonHook.userBaseInfo.userName, // 用户名,
          agentId,
          taskId: this.taskId
        })
      })
    }

  }
}

/**
 * 挂载调试导出方法到 window。
 * 用法：window.loadError() 或 window.loadError('自定义文件名')
 */
(() => {
  const loadError = (fileName?: string) => {
    try {
      const outputs = (window as any).lastStreamOutputs || [];
      const exportAt = moment().format('YYYY-MM-DD HH:mm:ss');
      const defaultFileName = `lastStreamOutputs_${moment().format('YYYYMMDD_HHmmss')}.txt`;
      const rawName = fileName?.trim() || defaultFileName;
      const finalFileName = rawName.endsWith('.txt') ? rawName : `${rawName}.txt`;
      const content = [
        `导出时间：${exportAt}`,
        `记录条数：${Array.isArray(outputs) ? outputs.length : 0}`,
        '',
        JSON.stringify(outputs, null, 2)
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = finalFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      console.log('[window.loadError] 导出成功：', finalFileName);
    } catch (error) {
      console.error('[window.loadError] 导出失败：', error);
    }
  };

  (window as any).loadError = loadError;
})();

export default UserAi

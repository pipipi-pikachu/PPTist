import { $message } from '@/plugins/element'
import { getToken } from '@/utils/cookie'

export class TTS {
  private mediaSource: MediaSource | null = null
  private sourceBuffer: SourceBuffer | null = null
  private audioChunks: ArrayBuffer[] = []
  private allAudioChunks: ArrayBuffer[] = []
  private isAppending: boolean = false
  private audioPlayer: HTMLAudioElement
  private initFlag: boolean = false
  private audioUrl: string = ''
  private callback:any = Function
  private isPaused: boolean = false
  private abortController: AbortController | null = null

  constructor(audioPlayer: HTMLAudioElement,callBack:any) {

    this.audioPlayer = audioPlayer
    this.callback = callBack
    this.audioPlayer.addEventListener('pause', () => {
      this.isPaused = true
    })
    this.audioPlayer.addEventListener('play', () => {
      this.isPaused = false
    })
  }

  // 清理 MediaSource 相关资源
  private clearMediaSource(): void {
    console.log("this.audioPlayer",this.audioPlayer)
    if (this.audioPlayer) {
      this.audioPlayer.pause()
      this.audioPlayer.src = '' // 清空 src 避免残留
    }
    // 中止正在进行的请求
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    // 清理 MediaSource 相关资源
    if (this.mediaSource) {
      if (this.mediaSource.readyState === 'open') {
        this.mediaSource.endOfStream()
      }
      URL.revokeObjectURL(this.mediaSource.url)
      this.mediaSource = null
    }

    // 清理之前的音频 URL
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = ''
    }

    this.sourceBuffer = null
    this.audioChunks = []
    this.allAudioChunks = []
    this.isAppending = false
    this.isPaused = false
  }

  // 初始化 MediaSource
  private initMediaSource(): void {
    if (!window.MediaSource) {
      $message('当前浏览器不支持 MediaSource', 'error')
      return
    }

    this.mediaSource = new window.MediaSource()

    const url = URL.createObjectURL(this.mediaSource)
    this.audioPlayer.src = url

    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen.bind(this), { once: true })
  }

  // 处理 MediaSource 打开事件
  private handleSourceOpen(): void {
    const mimeCodec = 'audio/mpeg' // MP3 格式
    this.sourceBuffer = this.mediaSource!.addSourceBuffer(mimeCodec)

    this.sourceBuffer.addEventListener('updateend', () => {
      this.isAppending = false
      this.processQueue() // 继续处理队列
    })

    this.processQueue() // 开始处理音频块队列
  }

  // 处理音频块队列
  private processQueue(): void {
    if (!this.sourceBuffer || !this.audioChunks.length || this.isAppending || this.isPaused) return

    const chunk = this.audioChunks.shift()
    try {
      this.isAppending = true
      this.sourceBuffer.appendBuffer(chunk)
    } catch (e) {
      console.error("无法追加音频块", e)
      this.isAppending = false
    }
  }

  // 检查是否是完整的 JSON 字符串
  private isCompleteJson(str: string): boolean {
    let braceCount = 0 // 跟踪 { 和 } 的数量
    let inString = false // 是否在字符串中
    let escapeNext = false // 是否在转义字符后

    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (!inString) {
        if (char === '{') braceCount++
        if (char === '}') braceCount--
        if (char === '"' && !escapeNext) inString = true
      } else {
        if (char === '"' && !escapeNext) inString = false
        if (char === '\\') escapeNext = !escapeNext
        else escapeNext = false
      }
    }
    return braceCount === 0 && !inString
  }

  // 将 HEX 字符串转为 Uint8Array
  private hexToUint8Array(hex: string): Uint8Array {
    hex = hex.replace(/^0x/, '') // 去掉前缀（如果有的话）
    const length = hex.length / 2
    const uint8 = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
      const hexByte = hex.substr(i * 2, 2)
      uint8[i] = parseInt(hexByte, 16)
    }
    return uint8
  }

  // 追加音频块
  private appendAudioChunk(arrayBuffer: ArrayBuffer): void {
    this.audioChunks.push(arrayBuffer)
    this.allAudioChunks.push(arrayBuffer)

    // 创建并推送最新的音频 URL
    this.updateAudioUrl()

    if (!this.mediaSource) {
      this.initMediaSource()
    } else if (!this.isAppending && this.sourceBuffer && !this.sourceBuffer.updating && !this.isPaused) {
      this.processQueue()
    }
  }

  // 更新音频 URL 并通知所有回调
  private updateAudioUrl(): void {
    // 清理之前的 URL
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
    }

    // 创建新的 URL
    this.audioUrl = this.createAudioUrl()
    this.callback(this.audioUrl)
  }

  // 合并所有音频块并创建 Blob URL
  private createAudioUrl(): string {
    if (this.allAudioChunks.length === 0) {
      return ''
    }

    // 计算总长度
    let totalLength = 0
    for (const chunk of this.allAudioChunks) {
      totalLength += chunk.byteLength
    }

    // 创建一个新的 Uint8Array 来容纳所有数据
    const combinedArray = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of this.allAudioChunks) {
      const uint8Chunk = new Uint8Array(chunk)
      combinedArray.set(uint8Chunk, offset)
      offset += chunk.byteLength
    }

    // 创建 Blob 并生成 URL
    const blob = new Blob([combinedArray], { type: 'audio/mpeg' })
    return URL.createObjectURL(blob)
  }

  // 处理流式 API 请求
  private async handleStreamApi(params: any = {}): Promise<string> {
    this.initFlag = false
    this.isPaused = false
    
    // 创建新的 AbortController 实例
    this.abortController = new AbortController()
    const signal = this.abortController.signal 

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    }
    
    try {
      const response = await fetch('/iccServer/outEsb/voiceApi/synthesize', {
        method: 'post',
        headers,
        body: JSON.stringify(params)
      })
      if (!response || response.status !== 200) {
        throw new Error('server error')
      }
      if (!response.body) throw new Error('Stream not supported!')
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      while (true) {
        // 如果暂停了，就等待恢复播放
        while (this.isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100))
         if (signal.aborted) {
            throw new Error('Request aborted')
          }
        }
        
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk // 累积数据
        
        let lines = buffer.split("\n\n")
        let completeLines: string[] = []
        let tempBuffer = ''
        
        // 分割并检查完整 JSON
        for (let i = 0; i < lines.length; i++) {
          tempBuffer += (tempBuffer ? "\n\n" : "") + lines[i]
          if (tempBuffer.startsWith("data:")) {
            const jsonString = tempBuffer.substring(5).trim()
            if (
              jsonString &&
              jsonString !== "[DONE]" &&
              this.isCompleteJson(jsonString)
            ) {
              completeLines.push(tempBuffer)
              tempBuffer = ""
            }
          } else {
            completeLines.push(tempBuffer)
            tempBuffer = ""
          }
        }
        buffer = tempBuffer
        
        // 处理完整的 JSON 数据
        for (const line of completeLines) {
          if (line.startsWith("data:")) {
            const jsonString = line.substring(5).trim()
            if (!jsonString || jsonString === "[DONE]") continue
            try {
              const data = JSON.parse(jsonString)
              if (+data.data.status === 2) {
                setTimeout(() => {
                  if (this.mediaSource && this.mediaSource.readyState === 'open') {
                    // $message('生成音频成功', 'success')
                    this.mediaSource.endOfStream()
                    // 确保最后更新一次 URL
                    this.updateAudioUrl()
                  }
                }, 300)
              } else if (+data.data.status === 1 && data.data.audio) {
                const hexData = data.data.audio // 接收到的HEX字符串
                const arrayBuffer = this.hexToUint8Array(hexData).buffer
                
                // 如果是第一个 chunk，则开始播放
                if (!this.mediaSource || this.initFlag === false) {
                  this.appendAudioChunk(arrayBuffer)
                  this.initFlag = true
                  // 只有在没有暂停的情况下才自动播放
                  if (!this.isPaused) {
                    this.audioPlayer.play() // 自动播放
                  }
                } else {
                  this.appendAudioChunk(arrayBuffer)
                }
              }
            } catch (error) {
              console.error(
                "JSON parsing failed:",
                error,
                "Line:",
                jsonString
              )
            }
          }
          // 检查请求是否被中止
        if (signal.aborted) {
          throw new Error('Request aborted')
        }
        }
      }
    } catch (err) {
      // 忽略中止请求产生的错误
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('Audio request aborted')
        return this.audioUrl
      }
      console.error(err)
    }

    // 返回最终的音频 URL
    return this.audioUrl
  }

  // 生成并播放音频的公共方法，返回实时更新的 URL
  public async generateAudio(text: string): Promise<string> {
    this.clearMediaSource()
    this.initMediaSource()
    return this.handleStreamApi({
      text,
      model: "Vox2",
      stream: true,
      outputFormat: "url",
      voiceSetting: {
        speed: 1,
        voice: "1001",
        voiceType: 1,
        dialect: "PUTON"
      },
      audioSetting: {
        format: "mp3"
      }
    })
  }
  // 重置
  public reset():void{
    this.clearMediaSource()
  }
  // 暂停播放
  public pause(): void {
    this.isPaused = true
    if (this.audioPlayer) {
      this.audioPlayer.pause()
    }
  }

  // 恢复播放
  public resume(): void {
    this.isPaused = false
    console.log("this.audioPlayer",this.audioPlayer,this.audioPlayer.paused)
    if (this.audioPlayer && this.audioPlayer.paused) {
      // 如果音频已经暂停但状态没同步，尝试恢复播放
      try {
        this.audioPlayer.play()
      } catch (e) {
        console.error("播放恢复失败", e)
      }
    }
    // 继续处理队列
    this.processQueue()
  }

  // 获取当前音频 URL
  public getAudioUrl(): string {
    return this.audioUrl
  }

}
<template>
  <div class="writing-board" ref="writingBoardRef">
    <div class="blackboard" v-if="blackboard"></div>

    <canvas class="canvas" ref="canvasRef"
      :style="{
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
      }"
      @mousedown="$event => handleMousedown($event)"
      @mousemove="$event => handleMousemove($event)"
      @mouseup="handleMouseup()"
      @touchstart="$event => handleMousedown($event)"
      @touchmove="$event => handleMousemove($event)"
      @touchend="handleMouseup(); mouseInCanvas = false"
      @mouseleave="handleMouseup(); mouseInCanvas = false"
      @mouseenter="mouseInCanvas = true"
    ></canvas>

    <template v-if="mouseInCanvas">
      <div 
        class="eraser"
        :style="{
          left: mouse.x - rubberSize / 2 + 'px',
          top: mouse.y - rubberSize / 2 + 'px',
          width: rubberSize + 'px',
          height: rubberSize + 'px',
        }"
        v-if="model === 'eraser'"
      ></div>
      <div 
        class="pen"
        :style="{
          left: mouse.x - penSize / 2 + 'px',
          top: mouse.y - penSize * 6 + penSize / 2 + 'px',
          color: color,
        }"
        v-if="model === 'pen'"
      >
        <IconWrite class="icon" :size="penSize * 6" v-if="model === 'pen'" />
      </div>
      <div 
        class="pen"
        :style="{
          left: mouse.x - markSize / 2 + 'px',
          top: mouse.y + 'px',
          color: color,
        }"
        v-if="model === 'mark'"
      >
        <IconHighLight class="icon" :size="markSize * 1.5" v-if="model === 'mark'" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  model?: 'pen' | 'eraser' | 'mark'
  blackboard?: boolean
  penSize?: number
  markSize?: number
  rubberSize?: number
}>(), {
  color: '#ffcc00',
  model: 'pen',
  blackboard: false,
  penSize: 6,
  markSize: 24,
  rubberSize: 80,
})

const emit = defineEmits<{
  (event: 'end'): void
}>()

let ctx: CanvasRenderingContext2D | null = null
const writingBoardRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

let lastPos = {
  x: 0,
  y: 0,
}
let isMouseDown = false
let lastTime = 0
let lastLineWidth = -1

// 鼠标位置坐标：用于画笔或橡皮位置跟随
const mouse = ref({
  x: 0,
  y: 0,
})

// 鼠标是否处在画布范围内：处在范围内才会显示画笔或橡皮
const mouseInCanvas = ref(false)

// 监听更新canvas尺寸
const canvasWidth = ref(0)
const canvasHeight = ref(0)

const widthScale = computed(() => canvasRef.value ? canvasWidth.value / canvasRef.value.width : 1)
const heightScale = computed(() => canvasRef.value ? canvasHeight.value / canvasRef.value.height : 1)

const updateCanvasSize = () => {
  if (!writingBoardRef.value) return
  canvasWidth.value = writingBoardRef.value.clientWidth
  canvasHeight.value = writingBoardRef.value.clientHeight
}
const resizeObserver = new ResizeObserver(updateCanvasSize)
onMounted(() => {
  if (writingBoardRef.value) resizeObserver.observe(writingBoardRef.value)
})
onUnmounted(() => {
  if (writingBoardRef.value) resizeObserver.unobserve(writingBoardRef.value)
})

// 初始化画布
const initCanvas = () => {
  if (!canvasRef.value || !writingBoardRef.value) return

  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  canvasRef.value.width = writingBoardRef.value.clientWidth
  canvasRef.value.height = writingBoardRef.value.clientHeight

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}
onMounted(initCanvas)

// 切换画笔模式时，更新 canvas ctx 配置
const updateCtx = () => {
  if (!ctx) return
  if (props.model === 'mark') {
    ctx.globalCompositeOperation = 'xor'
    ctx.globalAlpha = 0.5
  }
  else if (props.model === 'pen') {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }
}
watch(() => props.model, updateCtx)

// 绘制画笔墨迹方法
const draw = (posX: number, posY: number, lineWidth: number) => {
  if (!ctx) return

  const lastPosX = lastPos.x
  const lastPosY = lastPos.y

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = props.color
  ctx.beginPath()
  ctx.moveTo(lastPosX, lastPosY)
  ctx.lineTo(posX, posY)
  ctx.stroke()
  ctx.closePath()
}

// 擦除墨迹方法
const erase = (posX: number, posY: number) => {
  if (!ctx || !canvasRef.value) return
  const lastPosX = lastPos.x
  const lastPosY = lastPos.y

  const radius = props.rubberSize / 2

  const sinRadius = radius * Math.sin(Math.atan((posY - lastPosY) / (posX - lastPosX)))
  const cosRadius = radius * Math.cos(Math.atan((posY - lastPosY) / (posX - lastPosX)))
  const rectPoint1: [number, number] = [lastPosX + sinRadius, lastPosY - cosRadius]
  const rectPoint2: [number, number] = [lastPosX - sinRadius, lastPosY + cosRadius]
  const rectPoint3: [number, number] = [posX + sinRadius, posY - cosRadius]
  const rectPoint4: [number, number] = [posX - sinRadius, posY + cosRadius]

  ctx.save()
  ctx.beginPath()
  ctx.arc(posX, posY, radius, 0, Math.PI * 2)
  ctx.clip()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(...rectPoint1)
  ctx.lineTo(...rectPoint3)
  ctx.lineTo(...rectPoint4)
  ctx.lineTo(...rectPoint2)
  ctx.closePath()
  ctx.clip()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.restore()
}

// 计算鼠标两次移动之间的距离
const getDistance = (posX: number, posY: number) => {
  const lastPosX = lastPos.x
  const lastPosY = lastPos.y
  return Math.sqrt((posX - lastPosX) * (posX - lastPosX) + (posY - lastPosY) * (posY - lastPosY))
}

// 根据鼠标两次移动之间的距离s和时间t计算绘制速度，速度越快，墨迹越细
const getLineWidth = (s: number, t: number) => {
  const maxV = 10
  const minV = 0.1
  const maxWidth = props.penSize
  const minWidth = 3
  const v = s / t
  let lineWidth

  if (v <= minV) lineWidth = maxWidth
  else if (v >= maxV) lineWidth = minWidth
  else lineWidth = maxWidth - v / maxV * maxWidth

  if (lastLineWidth === -1) return lineWidth
  return lineWidth * 1 / 3 + lastLineWidth * 2 / 3
}

// 路径操作
const handleMove = (x: number, y: number) => {
  const time = new Date().getTime()

  if (props.model === 'pen') {
    const s = getDistance(x, y)
    const t = time - lastTime
    const lineWidth = getLineWidth(s, t)

    draw(x, y, lineWidth)
    lastLineWidth = lineWidth
  }
  else if (props.model === 'mark') draw(x, y, props.markSize)
  else erase(x, y)

  lastPos = { x, y }
  lastTime = new Date().getTime()
}

// 获取鼠标在canvas中的相对位置
const getMouseOffsetPosition = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return [0, 0]
  const event = e instanceof MouseEvent ? e : e.changedTouches[0]
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const x = event.pageX - canvasRect.x
  const y = event.pageY - canvasRect.y
  return [x, y]
}

// 处理鼠标（触摸）事件
// 准备开始绘制/擦除墨迹（落笔）
const handleMousedown = (e: MouseEvent | TouchEvent) => {
  const [mouseX, mouseY] = getMouseOffsetPosition(e)
  const x = mouseX / widthScale.value
  const y = mouseY / heightScale.value

  isMouseDown = true
  lastPos = { x, y }
  lastTime = new Date().getTime()

  if (!(e instanceof MouseEvent)) {
    mouse.value = { x: mouseX, y: mouseY }
    mouseInCanvas.value = true
  }
}

// 开始绘制/擦除墨迹（移动）
const handleMousemove = (e: MouseEvent | TouchEvent) => {
  const [mouseX, mouseY] = getMouseOffsetPosition(e)
  const x = mouseX / widthScale.value
  const y = mouseY / heightScale.value

  mouse.value = { x: mouseX, y: mouseY }

  if (isMouseDown) handleMove(x, y)
}

// 结束绘制/擦除墨迹（停笔）
const handleMouseup = () => {
  if (!isMouseDown) return
  isMouseDown = false
  emit('end')
}

// 清空画布
const clearCanvas = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  emit('end')
}

// 获取 DataURL
const getImageDataURL = () => {
  return canvasRef.value?.toDataURL()
}

// 设置 DataURL（绘制图片到 canvas）
const setImageDataURL = (imageDataURL: string) => {
  if (!ctx || !canvasRef.value) return
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  if (imageDataURL) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1

    const img = new Image()
    img.src = imageDataURL
    img.onload = () => {
      ctx!.drawImage(img, 0, 0)
      updateCtx()
    }
  }
}

defineExpose({
  clearCanvas,
  getImageDataURL,
  setImageDataURL,
})
</script>

<style lang="scss" scoped>
.writing-board {
  z-index: 8;
  cursor: none;
  @include absolute-0();
}
.blackboard {
  width: 100%;
  height: 100%;
  background-color: #0f392b;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.eraser, .pen {
  pointer-events: none;
  position: absolute;
  z-index: 9;

  .icon {
    filter: drop-shadow(2px 2px 2px #555);
  }
}
.eraser {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 4px solid rgba($color: #555, $alpha: .15);
  color: rgba($color: #555, $alpha: .75);
}
</style>
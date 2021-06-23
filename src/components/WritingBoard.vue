<template>
  <div class="writing-board" ref="writingBoardRef">
    <div class="blackboard" v-if="blackboard"></div>

    <canvas class="canvas" ref="canvasRef"
      @mousedown="$event => handleMousedown($event)"
      @mousemove="$event => handleMousemove($event)"
      @mouseup="handleMouseup()"
      @touchstart="$event => handleMousedown($event)"
      @touchmove="$event => handleMousemove($event)"
      @touchend="handleMouseup(); mouseInCanvas = false"
      @mouseleave="handleMouseup(); mouseInCanvas = false"
      @mouseenter="mouseInCanvas = true"
    ></canvas>

    <div 
      class="pen"
      :style="{
        left: mouse.x - penSize / 2 + 'px',
        top: mouse.y - 36 + penSize / 2 + 'px',
        color: color,
      }"
      v-if="mouseInCanvas && model === 'pen'"
    ><IconWrite class="icon" size="36" /></div>
    
    <div 
      class="eraser"
      :style="{
        left: mouse.x - rubberSize / 2 + 'px',
        top: mouse.y - rubberSize / 2 + 'px',
        width: rubberSize + 'px',
        height: rubberSize + 'px',
      }"
      v-if="mouseInCanvas && model === 'eraser'"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue'

const penSize = 6
const rubberSize = 80

export default defineComponent({
  name: 'writing-board',
  props: {
    color: {
      type: String,
      default: '#ffcc00',
    },
    model: {
      type: String as PropType<'pen' | 'eraser'>,
      default: 'pen',
    },
    blackboard: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
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
    const mouse = reactive({
      x: 0,
      y: 0,
    })

    // 更新鼠标位置坐标
    const updateMousePosition = (x: number, y: number) => {
      mouse.x = x
      mouse.y = y
    }
    
    // 鼠标是否处在画布范围内：处在范围内才会显示画笔或橡皮
    const mouseInCanvas = ref(false)


    // 初始化画布
    const initCanvas = () => {
      if (!canvasRef.value || !writingBoardRef.value) return

      ctx = canvasRef.value.getContext('2d')
      if (!ctx) return

      canvasRef.value.width = writingBoardRef.value.clientWidth
      canvasRef.value.height = writingBoardRef.value.clientHeight

      canvasRef.value.style.width = writingBoardRef.value.clientWidth + 'px'
      canvasRef.value.style.height = writingBoardRef.value.clientHeight + 'px'

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
    onMounted(initCanvas)

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

      const radius = rubberSize / 2

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
      const maxWidth = penSize
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
      else erase(x, y)

      lastPos = {x, y}
      lastTime = new Date().getTime()
    }

    // 处理鼠标（触摸）事件
    // 准备开始绘制/擦除墨迹（落笔）
    const handleMousedown = (e: MouseEvent | TouchEvent) => {
      const x = e instanceof MouseEvent ? e.offsetX : e.changedTouches[0].pageX
      const y = e instanceof MouseEvent ? e.offsetY : e.changedTouches[0].pageY

      isMouseDown = true
      lastPos = { x, y }
      lastTime = new Date().getTime()

      if (e instanceof TouchEvent) {
        updateMousePosition(x, y)
        mouseInCanvas.value = true
      }
    }

    // 开始绘制/擦除墨迹（移动）
    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      const x = e instanceof MouseEvent ? e.offsetX : e.changedTouches[0].pageX
      const y = e instanceof MouseEvent ? e.offsetY : e.changedTouches[0].pageY

      updateMousePosition(x, y)

      if (isMouseDown) handleMove(x, y)
    }

    // 结束绘制/擦除墨迹（停笔）
    const handleMouseup = () => {
      if (!isMouseDown) return
      isMouseDown = false
    }

    // 清空画布
    const clearCanvas = () => {
      if (!ctx || !canvasRef.value) return
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }

    return {
      mouse,
      mouseInCanvas,
      penSize,
      rubberSize,
      writingBoardRef,
      canvasRef,
      handleMousedown,
      handleMousemove,
      handleMouseup,
      clearCanvas,
    }
  },
})
</script>

<style lang="scss" scoped>
.writing-board {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 8;
  cursor: none;
}
.blackboard {
  width: 100%;
  height: 100%;
  background-color: #0f392b;
}
.canvas {
  @include absolute-0();
}
.eraser, .pen {
  pointer-events: none;
  position: fixed;
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
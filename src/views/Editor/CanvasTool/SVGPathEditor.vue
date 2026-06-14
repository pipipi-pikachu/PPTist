<template>
  <div class="svg-path-editor">
    <div class="container">
      <div
        class="svg-canvas"
        v-contextmenu="contextmenus"
        @contextmenu.capture="prepareContextmenu"
      >
        <svg
          ref="svgRef"
          class="svg-grid"
          :viewBox="`${CANVAS_MIN} ${CANVAS_MIN} ${CANVAS_SIZE} ${CANVAS_SIZE}`"
          @dblclick="appendLineByDoubleClick"
        >
          <rect class="canvas-background" :x="CANVAS_MIN" :y="CANVAS_MIN" :width="CANVAS_SIZE" :height="CANVAS_SIZE"></rect>
          <rect class="grid-background" :width="GRID_SIZE" :height="GRID_SIZE"></rect>
          <g class="grid-lines">
            <line
              v-for="line in gridLines"
              :key="line.key"
              :x1="line.x1"
              :y1="line.y1"
              :x2="line.x2"
              :y2="line.y2"
            ></line>
          </g>
          <path
            class="path-preview"
            :d="path"
            :fill="closePath ? 'rgba(209, 68, 36, 0.05)' : 'none'"
          ></path>

          <g v-for="(point, index) in points" :key="index">
            <template v-if="index > 0 && point.q">
              <line class="anchor-line" :x1="points[index - 1].x" :y1="points[index - 1].y" :x2="point.q.x" :y2="point.q.y"></line>
              <line class="anchor-line" :x1="point.q.x" :y1="point.q.y" :x2="point.x" :y2="point.y"></line>
              <circle
                class="anchor-point"
                :cx="point.q.x"
                :cy="point.q.y"
                r="6"
                @mousedown.left.stop="e => startDraggingQuadratic(e, index)"
              ></circle>
            </template>

            <template v-if="index > 0 && point.c">
              <line class="anchor-line" :x1="points[index - 1].x" :y1="points[index - 1].y" :x2="point.c[0].x" :y2="point.c[0].y"></line>
              <line class="anchor-line" :x1="point.x" :y1="point.y" :x2="point.c[1].x" :y2="point.c[1].y"></line>
              <circle
                class="anchor-point"
                :cx="point.c[0].x"
                :cy="point.c[0].y"
                r="6"
                @mousedown.left.stop="e => startDraggingCubic(e, index, 0)"
              ></circle>
              <circle
                class="anchor-point"
                :cx="point.c[1].x"
                :cy="point.c[1].y"
                r="6"
                @mousedown.left.stop="e => startDraggingCubic(e, index, 1)"
              ></circle>
            </template>

            <circle
              class="path-point"
              :class="{
                'start': index === 0,
                'active': index === activePointIndex,
              }"
              :data-point-index="index"
              :cx="point.x"
              :cy="point.y"
              :r="index === 0 ? 6 : 7"
              @mousedown.left.stop="e => startDraggingPoint(e, index)"
            ></circle>
          </g>
        </svg>
      </div>

      <div class="svg-panel">
        <div class="panel-section">
          <RadioGroup
            class="segment-type"
            :class="{ 'disabled': activePointIndex === 0 }"
            :value="activeSegmentType"
            @update:value="updateSegmentType"
          >
            <RadioButton value="L" :disabled="activePointIndex === 0">直线</RadioButton>
            <RadioButton value="Q" :disabled="activePointIndex === 0">曲线Q</RadioButton>
            <RadioButton value="C" :disabled="activePointIndex === 0">曲线C</RadioButton>
            <RadioButton value="A" :disabled="activePointIndex === 0">圆弧</RadioButton>
          </RadioGroup>
        </div>

        <Divider :margin="20" />

        <div class="panel-section">
          <div class="section-title">坐标：</div>
          <div class="input-row">
            <NumberInput
              class="number-input"
              :min="CANVAS_MIN"
              :max="CANVAS_MAX"
              :step="1"
              :value="activePoint.x"
              @update:value="value => updatePointPosition('x', value)"
            >
              <template #prefix>水平：</template>
            </NumberInput>
            <NumberInput
              class="number-input"
              :min="CANVAS_MIN"
              :max="CANVAS_MAX"
              :step="1"
              :value="activePoint.y"
              @update:value="value => updatePointPosition('y', value)"
            >
              <template #prefix>垂直：</template>
            </NumberInput>
          </div>
        </div>

        <template v-if="activePoint.q">
          <Divider :margin="20" />
          <div class="panel-section">
            <div class="section-title">控制点：</div>
            <div class="input-row">
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.q.x"
                @update:value="value => updateQuadraticPosition('x', value)"
              >
                <template #prefix>水平：</template>
              </NumberInput>
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.q.y"
                @update:value="value => updateQuadraticPosition('y', value)"
              >
                <template #prefix>垂直：</template>
              </NumberInput>
            </div>
          </div>
        </template>

        <template v-if="activePoint.c">
          <Divider :margin="20" />
          <div class="panel-section">
            <div class="section-title">控制点：</div>
            <div class="input-row">
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.c[0].x"
                @update:value="value => updateCubicPosition('x', value, 0)"
              >
                <template #prefix>1-水平：</template>
              </NumberInput>
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.c[0].y"
                @update:value="value => updateCubicPosition('y', value, 0)"
              >
                <template #prefix>1-垂直：</template>
              </NumberInput>
            </div>
            <div class="input-row">
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.c[1].x"
                @update:value="value => updateCubicPosition('x', value, 1)"
              >
                <template #prefix>2-水平：</template>
              </NumberInput>
              <NumberInput
                class="number-input"
                :min="CANVAS_MIN"
                :max="CANVAS_MAX"
                :step="1"
                :value="activePoint.c[1].y"
                @update:value="value => updateCubicPosition('y', value, 1)"
              >
                <template #prefix>2-垂直：</template>
              </NumberInput>
            </div>
          </div>
        </template>

        <template v-if="activePoint.a">
          <Divider :margin="20" />
          <div class="panel-section">
            <div class="section-title">圆弧：</div>
            <div class="input-row">
              <NumberInput
                class="number-input"
                :min="0"
                :max="1000"
                :step="1"
                :value="activePoint.a.rx"
                @update:value="value => updateArcParam('rx', value)"
              >
                <template #prefix>水平半径：</template>
              </NumberInput>
              <NumberInput
                class="number-input"
                :min="0"
                :max="1000"
                :step="1"
                :value="activePoint.a.ry"
                @update:value="value => updateArcParam('ry', value)"
              >
                <template #prefix>垂直半径：</template>
              </NumberInput>
            </div>
            <div class="input-row">
              <NumberInput
                class="number-input"
                :min="0"
                :max="360"
                :step="1"
                :value="activePoint.a.rot"
                @update:value="value => updateArcParam('rot', value)"
              >
                <template #prefix>旋转：</template>
              </NumberInput>
            </div>
            <div class="checkbox-row">
              <Checkbox :value="activePoint.a.laf === 1" @update:value="value => updateArcParam('laf', value ? 1 : 0)">大弧</Checkbox>
              <Checkbox :value="activePoint.a.sf === 1" @update:value="value => updateArcParam('sf', value ? 1 : 0)">顺时针</Checkbox>
            </div>
          </div>
        </template>

        <Divider :margin="20" />

        <div class="panel-section">
          <Checkbox :value="closePath" @update:value="value => closePath = value">闭合路径</Checkbox>
        </div>

        <Divider :margin="20" />

        <div class="panel-section">
          <div class="path-content">{{ path }}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="tooltips">Tips: 双击追加直线，右键追加线段或删除点；拖动端点和控制点调整路径。</div>
      <div class="footer-actions">
        <Button @click="emit('close')">关闭</Button>
        <Button type="primary" :disabled="!canInsert" @click="insert()">确认</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, useTemplateRef } from 'vue'
import type { ContextmenuItem } from '@/components/Contextmenu/types'

import Button from '@/components/Button.vue'
import Checkbox from '@/components/Checkbox.vue'
import Divider from '@/components/Divider.vue'
import NumberInput from '@/components/NumberInput.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'

type SegmentType = 'L' | 'Q' | 'C' | 'A'
type PointAxis = 'x' | 'y'
type ArcParamKey = 'rx' | 'ry' | 'rot' | 'laf' | 'sf'

interface PointPosition {
  x: number
  y: number
}

interface ArcParams {
  rx: number
  ry: number
  rot: number
  laf: 0 | 1
  sf: 0 | 1
}

interface PathPoint extends PointPosition {
  type?: SegmentType
  q?: PointPosition
  c?: [PointPosition, PointPosition]
  a?: ArcParams
}

interface GridLine {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

type DraggingState =
  | { type: 'point'; index: number }
  | { type: 'quadratic'; index: number }
  | { type: 'cubic'; index: number; anchor: 0 | 1 }

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'insert', path: string): void
}>()

const GRID_SIZE = 400
const GRID_GAP = 20
const CANVAS_PADDING = 50
const CANVAS_SIZE = GRID_SIZE + CANVAS_PADDING * 2
const CANVAS_MIN = -CANVAS_PADDING
const CANVAS_MAX = GRID_SIZE + CANVAS_PADDING

const svgRef = useTemplateRef<SVGSVGElement>('svgRef')
const points = ref<PathPoint[]>([{ x: 0, y: 0 }])
const activePointIndex = ref(0)
const closePath = ref(false)
const contextPoint = ref<PointPosition>({ x: 280, y: 200 })
const dragging = ref<DraggingState | null>(null)

const gridLines = computed<GridLine[]>(() => {
  const lines: GridLine[] = []
  for (let x = 0; x <= GRID_SIZE; x += GRID_GAP) {
    lines.push({ key: `x-${x}`, x1: x, y1: 0, x2: x, y2: GRID_SIZE })
  }
  for (let y = 0; y <= GRID_SIZE; y += GRID_GAP) {
    lines.push({ key: `y-${y}`, x1: 0, y1: y, x2: GRID_SIZE, y2: y })
  }
  return lines
})

const activePoint = computed(() => points.value[activePointIndex.value] || points.value[0])

const activeSegmentType = computed(() => {
  if (activePointIndex.value === 0) return 'L'
  const point = activePoint.value
  if (point.q) return 'Q'
  if (point.c) return 'C'
  if (point.a) return 'A'
  return 'L'
})

const path = computed(() => {
  let d = ''
  for (let i = 0; i < points.value.length; i++) {
    const point = points.value[i]
    if (i === 0) d += `M ${point.x} ${point.y} `
    else if (point.q) d += `Q ${point.q.x} ${point.q.y} ${point.x} ${point.y} `
    else if (point.c) d += `C ${point.c[0].x} ${point.c[0].y} ${point.c[1].x} ${point.c[1].y} ${point.x} ${point.y} `
    else if (point.a) d += `A ${point.a.rx} ${point.a.ry} ${point.a.rot} ${point.a.laf} ${point.a.sf} ${point.x} ${point.y} `
    else d += `L ${point.x} ${point.y} `
  }
  if (closePath.value) d += 'Z'
  return d.trim()
})

const canInsert = computed(() => points.value.length >= 2)

const snap = (value: number) => {
  return Math.round(value / GRID_GAP) * GRID_GAP
}

const clamp = (value: number) => {
  return Math.min(Math.max(value, CANVAS_MIN), CANVAS_MAX)
}

const getSvgPoint = (e: MouseEvent): PointPosition => {
  if (!svgRef.value) return { x: 0, y: 0 }

  const rect = svgRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) * CANVAS_SIZE / rect.width + CANVAS_MIN
  const y = (e.clientY - rect.top) * CANVAS_SIZE / rect.height + CANVAS_MIN

  return {
    x: clamp(snap(Math.round(x))),
    y: clamp(snap(Math.round(y))),
  }
}

const createPoint = (type: SegmentType, position: PointPosition, prevPoint: PathPoint): PathPoint => {
  if (type === 'Q') {
    return {
      ...position,
      type,
      q: {
        x: (position.x + prevPoint.x) / 2,
        y: (position.y + prevPoint.y) / 2,
      },
    }
  }
  if (type === 'C') {
    return {
      ...position,
      type,
      c: [
        {
          x: (position.x + prevPoint.x - 50) / 2,
          y: (position.y + prevPoint.y) / 2,
        },
        {
          x: (position.x + prevPoint.x + 50) / 2,
          y: (position.y + prevPoint.y) / 2,
        },
      ],
    }
  }
  if (type === 'A') {
    return {
      ...position,
      type,
      a: {
        rx: 50,
        ry: 50,
        rot: 0,
        laf: 1,
        sf: 1,
      },
    }
  }
  return {
    ...position,
    type: 'L',
  }
}

const setPoint = (index: number, point: PathPoint) => {
  const newPoints = [...points.value]
  newPoints[index] = point
  points.value = newPoints
}

const updateSegmentType = (type: string) => {
  if (activePointIndex.value === 0) return

  const index = activePointIndex.value
  const point = activePoint.value
  const prevPoint = points.value[index - 1]
  setPoint(index, createPoint(type as SegmentType, { x: point.x, y: point.y }, prevPoint))
}

const updatePointPosition = (axis: PointAxis, value: number) => {
  const point = activePoint.value
  const newPoint = {
    ...point,
    [axis]: value,
  }
  setPoint(activePointIndex.value, newPoint)
}

const updateQuadraticPosition = (axis: PointAxis, value: number) => {
  const point = activePoint.value
  if (!point.q) return

  const q = {
    ...point.q,
    [axis]: value,
  }
  setPoint(activePointIndex.value, { ...point, q })
}

const updateCubicPosition = (axis: PointAxis, value: number, anchor: 0 | 1) => {
  const point = activePoint.value
  if (!point.c) return

  const c: [PointPosition, PointPosition] = [{ ...point.c[0] }, { ...point.c[1] }]
  c[anchor] = {
    ...c[anchor],
    [axis]: value,
  }
  setPoint(activePointIndex.value, { ...point, c })
}

const updateArcParam = (key: ArcParamKey, value: number) => {
  const point = activePoint.value
  if (!point.a) return

  const a: ArcParams = {
    ...point.a,
  }
  if (key === 'laf' || key === 'sf') a[key] = value ? 1 : 0
  else a[key] = value
  setPoint(activePointIndex.value, { ...point, a })
}

const addPoint = (type: SegmentType) => {
  const prevPoint = activePoint.value
  const newPoint = createPoint(type, contextPoint.value, prevPoint)
  const newPoints = [...points.value]
  const isRepeat = prevPoint.x === newPoint.x && prevPoint.y === newPoint.y
  const insertIndex = isRepeat ? newPoints.length : activePointIndex.value + 1

  if (isRepeat) newPoints.push(newPoint)
  else newPoints.splice(insertIndex, 0, newPoint)

  points.value = newPoints
  activePointIndex.value = insertIndex
}

const appendLineByDoubleClick = (e: MouseEvent) => {
  contextPoint.value = getSvgPoint(e)
  addPoint('L')
}

const removeActivePoint = () => {
  if (activePointIndex.value === 0) return
  if (points.value.length === 1) return

  const newPoints = points.value.filter((_, index) => index !== activePointIndex.value)
  points.value = newPoints
  activePointIndex.value = Math.max(activePointIndex.value - 1, 0)
}

const prepareContextmenu = (e: MouseEvent) => {
  contextPoint.value = getSvgPoint(e)

  const target = e.target as Element
  const pointEl = target.closest('[data-point-index]') as SVGCircleElement | null
  const pointIndex = pointEl ? Number(pointEl.dataset.pointIndex) : NaN

  if (!isNaN(pointIndex)) activePointIndex.value = pointIndex
}

const contextmenus = (): ContextmenuItem[] => {
  return [
    {
      text: '追加直线',
      handler: () => addPoint('L'),
    },
    {
      text: '追加二次曲线',
      handler: () => addPoint('Q'),
    },
    {
      text: '追加三次曲线',
      handler: () => addPoint('C'),
    },
    {
      text: '追加弧线',
      handler: () => addPoint('A'),
    },
    { divider: true },
    {
      text: '删除当前点',
      disable: activePointIndex.value === 0,
      handler: removeActivePoint,
    },
  ]
}

const startDraggingPoint = (e: MouseEvent, index: number) => {
  activePointIndex.value = index
  dragging.value = { type: 'point', index }
  startDragging(e)
}

const startDraggingQuadratic = (e: MouseEvent, index: number) => {
  activePointIndex.value = index
  dragging.value = { type: 'quadratic', index }
  startDragging(e)
}

const startDraggingCubic = (e: MouseEvent, index: number, anchor: 0 | 1) => {
  activePointIndex.value = index
  dragging.value = { type: 'cubic', index, anchor }
  startDragging(e)
}

const startDragging = (e: MouseEvent) => {
  e.preventDefault()
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDragging)
}

const drag = (e: MouseEvent) => {
  if (!dragging.value) return

  const position = getSvgPoint(e)
  const state = dragging.value
  const point = points.value[state.index]

  if (state.type === 'point') setPoint(state.index, { ...point, ...position })
  else if (state.type === 'quadratic' && point.q) setPoint(state.index, { ...point, q: position })
  else if (state.type === 'cubic' && point.c) {
    const c: [PointPosition, PointPosition] = [{ ...point.c[0] }, { ...point.c[1] }]
    c[state.anchor] = position
    setPoint(state.index, { ...point, c })
  }
}

const stopDragging = () => {
  dragging.value = null
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDragging)
}

const insert = () => {
  if (!canInsert.value) return
  emit('insert', path.value)
}

onUnmounted(() => {
  stopDragging()
})
</script>

<style lang="scss" scoped>
.svg-path-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container {
  display: flex;
  gap: 16px;
}
.svg-canvas {
  width: 500px;
  height: 500px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  user-select: none;
}
.svg-grid {
  width: 100%;
  height: 100%;
}
.canvas-background {
  fill: #fafafa;
}
.grid-background {
  fill: #fff;
  stroke: $borderColor;
  stroke-width: 1;
}
.grid-lines {
  line {
    stroke: #ececec;
    stroke-width: 1;
  }
}
.path-preview {
  stroke: $themeColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.path-point {
  fill: #fff;
  stroke: $themeColor;
  stroke-width: 2;

  &.start {
    stroke: $themeColor;
  }
  &.active {
    fill: $themeColor;
  }
}
.anchor-line {
  stroke: #999;
  stroke-width: 1;
  stroke-dasharray: 4 4;
}
.anchor-point {
  fill: #fff;
  stroke: #666;
  stroke-width: 2;
}
.svg-panel {
  flex: 1;
  height: 500px;
  overflow: auto;
}
.section-title {
  font-size: 13px;
  margin-bottom: 8px;
}
.segment-type {
  width: 100%;
  
  &.disabled {
    pointer-events: none;
  }

  ::v-deep(.button-group) {
    width: 100%;
  }
  ::v-deep(button.button) {
    flex: 1;
    padding: 0;
  }
}
.input-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}
.number-input {
  width: 100%;
}
.checkbox-row {
  display: flex;
  gap: 18px;
}
.path-content {
  width: 100%;
  height: 80px;
  overflow: auto;
  border: 1px solid #d9d9d9;
  border-radius: $borderRadius;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
  background-color: #fafafa;
  white-space: pre-wrap;
  word-break: break-all;
  user-select: text;
  font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-top: 16px;
}
.tooltips {
  flex: 1;
  color: #888;
  font-style: italic;
  font-size: 12px;
}
.footer-actions {
  display: flex;
  gap: 8px;
}
</style>

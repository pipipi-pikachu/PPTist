<template>
  <div class="image-waterfall-viewer"
    ref="waterfallWrapRef"
    @scroll="handleScroll()"
  >
    <div 
      class="image-waterfall-content" 
      ref="waterfallRef"
      :style="{ height: outerHeight + 'px' }"
    >
      <div
        :class="['waterfall-item', `item-${item.id}`]"
        v-for="item in localList"
        :key="item.id"
        :style="{
          position: item.style.position,
          visibility: item.style.visibility,
          width: Math.round(columnWidthInUse) + 'px',
          top: item.style.top,
          left: item.style.left,
        }"
      >
        <slot v-bind="item.data"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch, useTemplateRef, type CSSProperties } from 'vue'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import findIndex from 'lodash/findIndex'

interface WaterfallItemData {
  id: number
  width: number
  height: number
  src: string
}

interface WaterfallItem {
  id: number
  style: CSSProperties
  prepared: boolean
  data: WaterfallItemData
}

const props = withDefaults(defineProps<{
  list: WaterfallItemData[]
  columnWidth?: number
  columnSpacing?: number
}>(), {
  columnWidth: 200,
  columnSpacing: 10,
})

const emit = defineEmits<{
  (event: 'scrollToBottom'): void
}>()

const outerWidth = ref(-1)
const outerHeight = ref(200)
const columnWidthInUse = ref(0)
const columnCount = ref(0)
const localList = ref<WaterfallItem[]>([])
const lastRowBottomPosition = ref<number[]>([])
const waterfallWrapRef = useTemplateRef<HTMLDivElement>('waterfallWrapRef')
const waterfallRef = useTemplateRef<HTMLDivElement>('waterfallRef')
const resizeObserver = ref<ResizeObserver>()

const loadImage = (src: string, callback: () => void) => {
  if (!src) {
    setTimeout(callback, 0)
    return
  }
  const img = new Image()
  img.src = src
  img.onerror = img.onload = () => {
    callback()
  }
}

watch(() => props.list, () => {
  updateList()
})

const initLayout = () => {
  if (!waterfallRef.value) return false

  const width = waterfallRef.value.clientWidth
  if (width === outerWidth.value) return false

  outerWidth.value = width
  lastRowBottomPosition.value = []
  columnCount.value = Math.max(Math.floor((width + props.columnSpacing) / (props.columnWidth + props.columnSpacing)), 1)

  if (columnCount.value === 1) columnWidthInUse.value = width
  else columnWidthInUse.value = (width + props.columnSpacing) / columnCount.value - props.columnSpacing
  return true
}

const refresh = (forceRefresh?: boolean) => {
  const isLayoutChanged = initLayout()
  if (!isLayoutChanged && !forceRefresh) return

  for (const item of localList.value) {
    item.style.visibility = 'hidden'
  }

  nextTick(() => {
    lastRowBottomPosition.value = []
    for (const item of localList.value) {
      const node = waterfallRef.value!.querySelector(`.item-${item.id}`)
      if (item.prepared && node) setItemPosition(node, item)
    }
  })
}

const resizeListener = throttle(() => {
  refresh()
}, 300, { leading: false, trailing: true })

const updateList = () => {
  const listInScreen = localList.value.map(item => item.data)

  for (const item of props.list) {
    if (findIndex(listInScreen, item) === -1) addItem(item)
  }

  let hasDeletedData = false
  for (let i = listInScreen.length - 1; i >= 0; i--) {
    if (findIndex(props.list, listInScreen[i]) === -1) {
      hasDeletedData = true
      localList.value.splice(i, 1)
    }
  }
  if (hasDeletedData) refresh(true)
}

const addItem = (itemData: WaterfallItemData) => {
  const item: WaterfallItem = {
    id: itemData.id,
    style: {
      position: 'relative',
      top: 0,
      left: 0,
      width: columnWidthInUse.value,
      visibility: 'hidden',
    },
    prepared: false,
    data: itemData,
  }
  localList.value.push(item)

  nextTick(() => {
    const node = waterfallRef.value!.querySelector(`.item-${item.id}`)
    if (!node) return

    const imgNode = node.querySelector('img')
    const imgSrc = imgNode?.getAttribute('src') || ''

    loadImage(imgSrc, () => {
      item.prepared = true
      node.classList.add('animation')

      setTimeout(() => {
        node.classList.remove('animation')
      }, 1000)

      setItemPosition(node, item)
    })
  })
}

const setItemPosition = (itemNode: Element, item: WaterfallItem) => {
  if (!itemNode || !item) return

  const itemHeight = itemNode.clientHeight
  let columnIndex: number
  let top = 0

  if (lastRowBottomPosition.value.length < columnCount.value) {
    columnIndex = lastRowBottomPosition.value.length
    lastRowBottomPosition.value.push(itemHeight)
  }
  else {
    top = Math.min(...lastRowBottomPosition.value)
    columnIndex = lastRowBottomPosition.value.indexOf(top)
    top = top + props.columnSpacing
  }
  item.style.position = 'absolute'
  item.style.visibility = 'visible'
  item.style.top = Math.round(top) + 'px'
  item.style.left = Math.round(columnIndex * (columnWidthInUse.value + props.columnSpacing)) + 'px'

  lastRowBottomPosition.value[columnIndex] = top + itemHeight
  outerHeight.value = Math.max(...lastRowBottomPosition.value) + props.columnSpacing
}

const handleScroll = debounce(function() {
  if (!waterfallWrapRef.value) return

  const scrollTop = waterfallWrapRef.value.scrollTop
  const scrollHeight = waterfallWrapRef.value.scrollHeight
  const clientHeight = waterfallWrapRef.value.clientHeight

  if (scrollHeight - (clientHeight + scrollTop) < Math.abs(5)) {
    const allDataLoaded = localList.value.length && localList.value.length === props.list.length
    const allImagesCompleted = allDataLoaded && localList.value.every(item => item.prepared)

    if (allImagesCompleted) emit('scrollToBottom')
  }
}, 500, { trailing: true })

onMounted(() => {
  lastRowBottomPosition.value = []
  initLayout()
  updateList()

  if (waterfallRef.value) {
    resizeObserver.value = new ResizeObserver(resizeListener)
    resizeObserver.value.observe(waterfallRef.value)
  }
})
onUnmounted(() => {
  if (resizeObserver.value && waterfallRef.value) {
    resizeObserver.value.unobserve(waterfallRef.value)
  }
})
</script>

<style lang="scss" scoped>
.image-waterfall-viewer {
  overflow-x: hidden;
  overflow-y: auto;
}

.image-waterfall-content {
  width: 100%;
  position: relative;
}

.waterfall-item {
  text-align: center;

  &.animation {
    animation: fadeIn .5s ease both;
  }

  ::v-deep(img) {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
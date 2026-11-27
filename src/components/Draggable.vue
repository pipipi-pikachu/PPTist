<script lang="ts">
import { cloneVNode, computed, defineComponent, h, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, onUpdated, ref, watch, type PropType } from 'vue'
import Sortable, { MultiDrag, type SortableEvent } from 'sortablejs'
import type { DraggableEvent } from '@/types/draggable'

type ItemKey = string | number
type SortableInstance = Sortable & { animateAll(): void }
const dragStyleKeys = ['position', 'top', 'left', 'width', 'height', 'transition', 'transform', 'willChange'] as const

if (!Sortable.utils.select) Sortable.mount(new MultiDrag())

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<unknown[]>, 
      required: true,
    },
    itemKey: {
      type: [String, Function] as PropType<string | ((item: unknown, index: number) => ItemKey)>, 
      required: true,
    },
    animation: {
      type: Number, 
      default: 0,
    },
    scroll: {
      type: Boolean,
      default: true,
    },
    scrollSensitivity: {
      type: Number,
      default: 30,
    },
    handle: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    delayOnTouchOnly: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 0,
    },
    multiDrag: {
      type: Boolean,
      default: false,
    },
    selectedKeys: {
      type: Array as PropType<ItemKey[]>,
      default: () => [],
    },
  },
  emits: {
    start: (event: DraggableEvent) => !!event,
    end: (event: DraggableEvent) => !!event,
  },
  setup(props, { slots, emit }) {
    const listRef = ref<HTMLElement>()
    let sortable: SortableInstance | null = null
    let dragging = false
    let cancelled = false
    let disposed = false
    let stopping = false
    let lastEvent: SortableEvent | null = null
    let originalNodes: HTMLElement[] = []
    let originalKeys: ItemKey[] = []
    let draggedNodes: HTMLElement[] = []
    let renderedKeys: ItemKey[] = []
    const selectedNodes = new Set<HTMLElement>()
    const originalStyles = new Map<HTMLElement, Record<typeof dragStyleKeys[number], string>>()

    const clearSelection = () => {
      if (!sortable?.options.multiDrag || !listRef.value) return
      for (const node of selectedNodes) {
        if (node.parentElement === listRef.value) Sortable.utils.deselect(node)
      }
      selectedNodes.clear()
    }

    const getKey = (item: unknown, index: number): ItemKey => {
      if (typeof props.itemKey === 'function') return props.itemKey(item, index)
      // 主题色列表是可能包含重复值的字符串数组，沿用各位置的节点。
      if (!item || typeof item !== 'object') return index
      return (item as Record<string, ItemKey>)[props.itemKey]
    }

    const syncSelection = (target?: HTMLElement) => {
      if (!sortable || !listRef.value || dragging || stopping || disposed) return
      const nodes = Array.from(listRef.value.children) as HTMLElement[]
      const keys = new Set(props.multiDrag ? props.selectedKeys : [])
      const targetIndex = target ? nodes.indexOf(target) : -1
      if (targetIndex >= 0 && !keys.has(getKey(props.modelValue[targetIndex], targetIndex))) {
        keys.clear()
        keys.add(getKey(props.modelValue[targetIndex], targetIndex))
      }
      nodes.forEach((node, index) => {
        if (props.multiDrag && keys.has(getKey(props.modelValue[index], index))) {
          Sortable.utils.select(node)
          selectedNodes.add(node)
        }
        else {
          Sortable.utils.deselect(node)
          selectedNodes.delete(node)
        }
      })
    }

    const captureNodes = () => {
      originalNodes = Array.from(listRef.value!.children) as HTMLElement[]
      originalKeys = props.modelValue.map(getKey)
      originalStyles.clear()
      for (const node of originalNodes) {
        const style = {} as Record<typeof dragStyleKeys[number], string>
        for (const key of dragStyleKeys) style[key] = node.style[key]
        originalStyles.set(node, style)
      }
    }

    // 在 Sortable 处理按下事件前同步选择；点击规则和选择状态由调用方维护。
    const prepareDrag = (event: Event) => {
      if (props.disabled || dragging) return
      const node = (event.target as HTMLElement).closest<HTMLElement>('[data-draggable]')
      if (node && node.parentElement === listRef.value) {
        captureNodes()
        syncSelection(node)
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (dragging && event.key === 'Escape') cancelled = true
    }

    const options = computed(() => ({
      animation: props.animation,
      scroll: props.scroll,
      scrollSensitivity: props.scrollSensitivity,
      handle: props.handle,
      disabled: !!props.disabled,
      delayOnTouchOnly: props.delayOnTouchOnly,
      delay: props.delay,
      multiDrag: props.multiDrag,
    }))

    const getEvent = (event: SortableEvent): DraggableEvent => {
      const { originalEvent } = event as DraggableEvent
      const nodes = Array.from(listRef.value!.children).filter(node => originalNodes.includes(node as HTMLElement))
      return Object.assign(event, {
        originalEvent,
        oldIndex: event.oldIndex ?? 0,
        newIndex: event.newIndex ?? event.oldIndex ?? 0,
        cancelled: cancelled || (originalEvent.type === 'dragend' && (originalEvent as DragEvent).dataTransfer?.dropEffect === 'none'),
        keys: draggedNodes.map(node => originalKeys[originalNodes.indexOf(node)]),
        oldIndices: draggedNodes.map(node => originalNodes.indexOf(node)),
        newIndices: draggedNodes.map(node => nodes.indexOf(node)),
      })
    }

    const listChanged = () => {
      const keys = props.modelValue.map(getKey)
      return keys.length !== originalKeys.length || keys.some((key, index) => key !== originalKeys[index])
    }

    const restoreNodes = () => {
      if (!sortable || !listRef.value) return
      // 取消折叠动画的延迟回调，避免复原后再次移除辅助节点。
      sortable.option('animation', 0)
      sortable.animateAll()
      if (Sortable.active === sortable) {
        Sortable.ghost?.remove()
        Sortable.clone?.remove()
      }
      for (const node of Array.from(listRef.value.children)) {
        if (!originalNodes.includes(node as HTMLElement)) node.remove()
      }
      for (const node of originalNodes) {
        listRef.value.appendChild(node)
        const style = originalStyles.get(node)!
        for (const key of dragStyleKeys) node.style[key] = style[key]
      }
      sortable.option('animation', props.animation)
    }

    const stopDrag = (notify: boolean) => {
      if (!sortable || stopping) return
      stopping = true
      const result = dragging && lastEvent ? getEvent(lastEvent) : null
      if (originalNodes.length) restoreNodes()
      // deselect 需要节点仍属于该 Sortable，必须先接回折叠后脱离容器的节点。
      clearSelection()
      if (Sortable.active === sortable || (Sortable.dragged && originalNodes.includes(Sortable.dragged))) {
        // 让实例正常结束手势、解绑原生 dragend，再销毁，防止松手时旧回调再次执行。
        Sortable.dragged?.dispatchEvent(new Event('dragend', { bubbles: true }))
        if (Sortable.active === sortable || Sortable.dragged) document.dispatchEvent(new Event('touchcancel'))
      }
      sortable.destroy()
      sortable = null
      dragging = false
      lastEvent = null
      originalNodes = []
      originalKeys = []
      draggedNodes = []
      originalStyles.clear()
      stopping = false
      if (notify && result) {
        result.cancelled = true
        result.newIndex = result.oldIndex
        result.newIndices = [...result.oldIndices]
        emit('end', result)
      }
    }

    const scheduleSelection = () => {
      const instance = sortable
      if (stopping || disposed) return
      nextTick(() => {
        if (sortable === instance) syncSelection()
      })
    }

    const createSortable = () => {
      if (disposed || sortable) return
      sortable = new Sortable(listRef.value!, {
        ...options.value,
        draggable: '[data-draggable]',
        avoidImplicitDeselect: true,
        onChoose(event) {
          captureNodes()
          lastEvent = event
        },
        onUnchoose() {
          if (!dragging) lastEvent = null
        },
        onStart(event) {
          dragging = true
          cancelled = false
          lastEvent = event
          const items = props.multiDrag && event.items?.length ? event.items : [event.item]
          draggedNodes = originalNodes.filter(node => items.includes(node))
          if (!draggedNodes.includes(event.item)) {
            stopDrag(true)
            nextTick(createSortable)
            return
          }
          emit('start', getEvent(event))
        },
        onEnd(event) {
          if (stopping || disposed || !dragging) return
          if (listChanged()) {
            stopDrag(true)
            nextTick(createSortable)
            return
          }
          const result = getEvent(event)
          if (result.newIndices.some(index => index < 0)) result.cancelled = true
          if (result.cancelled) {
            result.newIndex = result.oldIndex
            result.newIndices = [...result.oldIndices]
          }
          // Sortable 直接移动 DOM。先复原全部节点，再由调用方提交数据，让 Vue 完成排序。
          restoreNodes()
          dragging = false
          lastEvent = null
          emit('end', result)
          scheduleSelection()
        },
        // MultiDrag 自带的点击选择不能覆盖调用方的受控选择。
        onSelect() {
          scheduleSelection()
        },
        onDeselect() {
          scheduleSelection()
        },
      }) as SortableInstance
      renderedKeys = props.modelValue.map(getKey)
      syncSelection()
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown, true)
      createSortable()
    })

    watch(options, value => {
      if (!sortable) return
      if (!value.multiDrag) clearSelection()
      for (const key of Object.keys(value) as (keyof typeof value)[]) sortable.option(key, value[key])
    })
    // 插件全局保存选中节点，在 Vue 移除节点前清理，避免卸载或替换列表后残留。
    onBeforeUpdate(() => {
      const active = dragging || (Sortable.dragged && originalNodes.includes(Sortable.dragged))
      if (active && listChanged()) {
        stopDrag(true)
        nextTick(createSortable)
      }
      const keys = new Set(props.modelValue.map(getKey))
      if (!dragging && renderedKeys.some(key => !keys.has(key))) clearSelection()
    })
    onUpdated(() => {
      renderedKeys = props.modelValue.map(getKey)
      syncSelection()
    })
    onBeforeUnmount(() => {
      disposed = true
      document.removeEventListener('keydown', handleKeydown, true)
      const active = dragging || (Sortable.dragged && originalNodes.includes(Sortable.dragged))
      if (!active) originalNodes = []
      stopDrag(false)
    })

    // 直接使用插槽根节点，保留原有样式、事件、指令以及组件 ref 的 $el。
    return () => h('div', {
      ref: listRef,
      onPointerdownCapture: prepareDrag,
      onMousedownCapture: prepareDrag,
      onTouchstartCapture: prepareDrag,
    }, props.modelValue.map((element, index) => {
      const node = slots.item?.({ element, index })[0]
      return node ? cloneVNode(node, { key: getKey(element, index), 'data-draggable': '' }) : null
    }))
  },
})
</script>

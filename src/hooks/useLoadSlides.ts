import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

/**
 * 提供幻灯片缩略图/页面列表的分批加载上限。
 *
 * @returns 包含 `slidesLoadLimit` 的对象，用于限制当前允许渲染的幻灯片数量。
 * @throws 当前 composable 不主动抛错；定时器 API 异常会按浏览器行为表现。
 * @remarks
 * - 初始只允许加载 50 页，随后每 600ms 增加 20 页。
 * - 当全部页面都已进入加载上限后，会把上限设为 9999。
 * - 该 hook 适合缩略图或放映列表渐进渲染，避免一次性渲染大量页面造成卡顿。
 */
export default () => {
  // 读取全量幻灯片列表，用于判断是否还需要继续扩大加载上限。
  const { slides } = storeToRefs(useSlidesStore())

  // 保存递归加载定时器 ID，卸载时用于清理。
  const timer = ref<number | null>(null)
  // 当前允许加载/渲染的幻灯片数量上限。
  const slidesLoadLimit = ref(50)

  /**
   * 逐步扩大幻灯片加载上限。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 使用递归 setTimeout，而不是 setInterval，便于在每次扩容后重新判断是否还需要继续加载。
   */
  const loadSlide = () => {
    // 如果总页数仍大于当前加载上限，则需要继续延迟扩容。
    if (slides.value.length > slidesLoadLimit.value) {
      // 延迟 600ms 后增加加载上限，降低一次性渲染压力。
      timer.value = setTimeout(() => {
        // 每次扩容 20 页。
        slidesLoadLimit.value = slidesLoadLimit.value + 20
        // 递归继续判断是否还需要加载更多页面。
        loadSlide()
      }, 600)
    }
    // 已覆盖全部页面时设置为足够大的值，避免后续页面数量小幅变化被限制。
    else slidesLoadLimit.value = 9999
  }

  // 组件挂载后开始渐进扩大加载上限。
  onMounted(loadSlide)

  // 组件卸载时清理未执行的定时器，避免卸载后继续更新响应式状态。
  onUnmounted(() => {
    // 有定时器时清除。
    if (timer.value) clearTimeout(timer.value)
  })

  // 返回当前加载上限，供列表渲染逻辑判断是否展示某页。
  return {
    slidesLoadLimit,
  }
}

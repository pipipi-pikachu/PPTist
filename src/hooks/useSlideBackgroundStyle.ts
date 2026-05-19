import { type Ref, computed } from 'vue'
import type { SlideBackground } from '@/types/slides'

/**
 * 将页面背景数据转换为 CSS 样式对象。
 *
 * @param background - 幻灯片背景配置的响应式引用。
 * @returns 包含 `backgroundStyle` 计算属性的对象。
 * @throws 当前 composable 不主动抛错；非法背景数据会按字符串拼接或 Vue computed 的运行时行为表现。
 * @remarks
 * - 支持纯色、图片和渐变三种背景类型。
 * - 背景配置缺失或无法识别时兜底为白色背景。
 * - 当前函数保持既有 CSS 字符串拼接行为，不修正输出格式。
 */
export default (background: Ref<SlideBackground | undefined>) => {
  // 根据背景配置实时计算 CSS 样式对象。
  const backgroundStyle = computed(() => {
    // 没有背景配置时兜底为白色。
    if (!background.value) return { backgroundColor: '#fff' }

    // 解构背景类型和对应配置。
    const {
      type,
      color,
      image,
      gradient,
    } = background.value

    // 纯色背景
    // 直接返回 backgroundColor 样式。
    if (type === 'solid') return { backgroundColor: color }

    // 背景图模式
    // 包括：背景图、背景大小，是否重复
    else if (type === 'image' && image) {
      // 读取图片地址和尺寸模式。
      const { src, size } = image
      // 图片地址为空时兜底白色背景。
      if (!src) return { backgroundColor: '#fff' }
      // repeat 模式下重复平铺背景图。
      if (size === 'repeat') {
        return {
          backgroundImage: `url(${src}`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
        }
      }
      // 非 repeat 模式下默认不重复，大小使用配置值或 cover。
      return {
        backgroundImage: `url(${src}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: size || 'cover',
      }
    }

    // 渐变色背景
    else if (type === 'gradient' && gradient) {
      // 读取渐变类型、颜色停止点和旋转角度。
      const { type, colors, rotate } = gradient
      // 将颜色停止点转换为 CSS 渐变片段。
      const list = colors.map(item => `${item.color} ${item.pos}%`)

      // 径向渐变直接拼接 radial-gradient。
      if (type === 'radial') return { backgroundImage: `radial-gradient(${list.join(',')}` }
      // 线性渐变角度加 90 度以适配项目内角度定义和 CSS 角度定义差异。
      return { backgroundImage: `linear-gradient(${rotate + 90}deg, ${list.join(',')}` }
    }

    // 未识别或配置不完整时兜底白色背景。
    return { backgroundColor: '#fff' }
  })

  // 返回背景样式计算属性，供幻灯片渲染组件绑定。
  return {
    backgroundStyle,
  }
}

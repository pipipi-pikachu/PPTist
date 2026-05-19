import { useSlidesStore } from '@/store'
import type { PPTElement, PPTElementLink } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import message from '@/utils/message'

/**
 * 提供元素链接设置与移除能力。
 *
 * @returns 包含 `setLink` 和 `removeLink` 的方法对象。
 * @throws 当前 composable 不主动抛错；store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 支持网页链接和页面跳转链接。
 * - 设置链接前会做基础合法性校验，失败时通过全局消息提示用户。
 * - 每次链接变更都会记录历史快照。
 */
export default () => {
  // 获取幻灯片 store，用于更新元素 link 属性。
  const slidesStore = useSlidesStore()

  // 获取历史快照写入方法。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 为指定元素设置链接。
   *
   * @param handleElement - 当前要设置链接的元素。
   * @param link - 链接配置，包含链接类型和目标。
   * @returns 设置成功返回 `true`，校验失败返回 `false`。
   * @throws store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks
   * - web 链接必须匹配 http/https URL 格式。
   * - slide 链接必须存在目标页面 ID。
   * - 该函数只做基础格式校验，不检查网页是否真实可访问。
   */
  const setLink = (handleElement: PPTElement, link: PPTElementLink) => {
    // 网页链接格式校验正则，限制协议为 http 或 https。
    const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
    // web 类型链接格式不合法时，提示用户并阻止写入。
    if (link.type === 'web' && !linkRegExp.test(link.target)) {
      message.error('不是正确的网页链接地址')
      return false
    }
    // slide 类型链接没有目标页面时，提示用户并阻止写入。
    if (link.type === 'slide' && !link.target) {
      message.error('请先选择链接目标')
      return false
    }
    // 构造要写入元素的 link 属性对象。
    const props = { link }
    // 更新目标元素链接配置。
    slidesStore.updateElement({ id: handleElement.id, props })
    // 记录历史快照，支持撤销链接设置。
    addHistorySnapshot()

    // 返回 true 表示链接已成功写入。
    return true
  }

  /**
   * 移除指定元素上的链接。
   *
   * @param handleElement - 当前要移除链接的元素。
   * @returns 无显式返回值。
   * @throws store 更新或历史快照写入异常会按运行时错误表现。
   */
  const removeLink = (handleElement: PPTElement) => {
    // 从元素数据中移除 link 属性。
    slidesStore.removeElementProps({ id: handleElement.id, propName: 'link' })
    // 记录历史快照，支持撤销移除链接。
    addHistorySnapshot()
  }

  // 返回链接操作方法。
  return {
    setLink,
    removeLink,
  }
}

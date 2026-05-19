import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTImageElement } from '@/types/slides'
import { getImageDataURL, getImageSize } from '@/utils/image'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供图片元素替换能力。
 *
 * @returns 包含 `replaceImage` 的方法对象。
 * @throws 当前 composable 不主动抛错；文件读取、图片尺寸读取、store 更新或历史快照写入异常会按对应函数行为表现。
 * @remarks
 * - 替换图片时会尽量保持原图片元素的高度和中心点不变。
 * - 新图片会按原元素高度等比缩放宽度。
 * - 非矩形裁剪会保留裁剪形状，但重置裁剪范围为完整图片。
 */
export default () => {
  // 获取主状态 store，用于读取当前被操作元素。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于更新图片元素数据。
  const slidesStore = useSlidesStore()
  // 当前操作元素和操作元素 ID。
  const { handleElement, handleElementId } = storeToRefs(mainStore)

  // 将当前操作元素按图片元素类型使用，实际调用前仍会校验 type。
  const handleImageElement = handleElement as Ref<PPTImageElement>

  // 获取历史快照写入方法，用于替换图片后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 使用上传文件替换当前操作中的图片元素。
   *
   * @param files - 文件输入框或拖拽得到的文件列表。
   * @returns 无显式返回值。
   * @throws 文件读取、图片尺寸读取或 store 更新异常会按下游函数行为表现。
   * @remarks
   * - 只使用文件列表中的第一个文件。
   * - 当前操作元素不是图片、没有操作元素 ID 或没有文件时会直接返回。
   * - 矩形裁剪会被移除；非矩形裁剪保留形状并重置裁剪范围。
   */
  const replaceImage = (files: FileList) => {
    // 读取用户选择的第一个文件。
    const imageFile = files[0]
    // 读取当前操作的图片元素。
    const imageElement = handleImageElement.value
    // 读取当前操作元素 ID，用于 store 精准更新。
    const imageElementId = handleElementId.value
    // 任一必要条件不满足时直接退出，避免误更新非图片元素。
    if (!imageFile || !imageElement || imageElement.type !== 'image' || !imageElementId) return

    // 将新图片文件读取为 Data URL，便于直接写入元素 src。
    getImageDataURL(imageFile).then(dataURL => {
      // 记录原图片元素宽度。
      const originWidth = imageElement.width
      // 记录原图片元素高度，替换后会保持该高度。
      const originHeight = imageElement.height
      // 记录原图片左侧坐标。
      const originLeft = imageElement.left
      // 记录原图片顶部坐标。
      const originTop = imageElement.top
      // 计算原图片中心点 x，替换后会保持中心点不变。
      const centerX = originLeft + originWidth / 2
      // 计算原图片中心点 y，替换后会保持中心点不变。
      const centerY = originTop + originHeight / 2

      // 读取新图片的实际宽高，用于按原高度等比缩放。
      getImageSize(dataURL).then(({ width, height }) => {
        // 新图片目标高度保持原图片元素高度。
        const h = originHeight
        // 根据新图片宽高比计算目标宽度。
        const w = width * (originHeight / height)
        // 根据原中心点计算新 left，保持视觉中心不变。
        const l = centerX - w / 2
        // 根据原中心点计算新 top，保持视觉中心不变。
        const t = centerY - h / 2

        // 读取原图片裁剪配置。
        const clip = imageElement.clip
        // 非矩形裁剪需要保留裁剪形状，否则用户创建的特殊裁剪会丢失。
        if (clip && clip.shape !== 'rect') {
          // 更新图片 src、尺寸、位置和裁剪范围。
          slidesStore.updateElement({
            id: imageElementId,
            props: {
              src: dataURL,
              width: w,
              height: h,
              left: l,
              top: t,
              clip: {
                ...clip,
                range: [[0, 0], [100, 100]],
              },
            },
          })
        }
        // 矩形裁剪或无裁剪时，替换图片后移除 clip 字段。
        else {
          // 删除 clip 属性，避免旧裁剪范围影响新图片显示。
          slidesStore.removeElementProps({
            id: imageElementId,
            propName: 'clip',
          })
          // 更新图片 src、尺寸和位置。
          slidesStore.updateElement({
            id: imageElementId,
            props: { src: dataURL, width: w, height: h, left: l, top: t },
          })
        }
        // 记录历史快照，支持撤销本次图片替换。
        addHistorySnapshot()
      })
    })
  }

  // 返回图片处理方法。
  return {
    replaceImage,
  }
}

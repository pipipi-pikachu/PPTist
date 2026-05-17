import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTImageElement } from '@/types/slides'
import { getImageDataURL, getImageSize } from '@/utils/image'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { handleElement, handleElementId } = storeToRefs(mainStore)

  const handleImageElement = handleElement as Ref<PPTImageElement>

  const { addHistorySnapshot } = useHistorySnapshot()

  const replaceImage = (files: FileList) => {
    const imageFile = files[0]
    const imageElement = handleImageElement.value
    const imageElementId = handleElementId.value
    if (!imageFile || !imageElement || imageElement.type !== 'image' || !imageElementId) return

    getImageDataURL(imageFile).then(dataURL => {
      const originWidth = imageElement.width
      const originHeight = imageElement.height
      const originLeft = imageElement.left
      const originTop = imageElement.top
      const centerX = originLeft + originWidth / 2
      const centerY = originTop + originHeight / 2

      getImageSize(dataURL).then(({ width, height }) => {
        const h = originHeight
        const w = width * (originHeight / height)
        const l = centerX - w / 2
        const t = centerY - h / 2

        const clip = imageElement.clip
        if (clip && clip.shape !== 'rect') {
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
        else {
          slidesStore.removeElementProps({
            id: imageElementId,
            propName: 'clip',
          })
          slidesStore.updateElement({
            id: imageElementId,
            props: { src: dataURL, width: w, height: h, left: l, top: t },
          })
        }
        addHistorySnapshot()
      })
    })
  }

  return {
    replaceImage,
  }
}

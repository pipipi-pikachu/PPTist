import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { debounce } from 'lodash'

export default () => {
  const { slides } = storeToRefs(useSlidesStore())

  /* 略图栏展示范围 */
  const slidesVisibleScope = ref<number[]>([0, 30])

  const setThumbnailVisibleScope = (newScope:number[]) => {
    slidesVisibleScope.value = newScope
  }

  /* 左侧略图展示 */
  const thumbnailVisible = computed(() => (index: number) => {
    if (slides.value.length <= 30) {
      return true
    }
    return index >= slidesVisibleScope.value[0] && index < slidesVisibleScope.value[1]
  })

  /* 监听thumbnails滚动 获取视线范围 */
  const listenThumbnailsScroll = debounce(function() {
    const thumbnailEl = document.querySelector('.thumbnail-list')
    const scrollTop = thumbnailEl?.scrollTop || 0
    const itemHeight = thumbnailEl?.clientHeight || 0

    // 计算获取视线里的
    let _sight = Math.floor((scrollTop + itemHeight) / 77.5)
    if (_sight < 30) _sight = 30
    setThumbnailVisibleScope([_sight - 30, _sight + 20])
  }, 100)
  return {
    thumbnailVisible,
    listenThumbnailsScroll
  }
}
<template>
  <div 
    class="thumbnails"
    @mousedown="() => setThumbnailsFocus(true)"
    v-click-outside="() => setThumbnailsFocus(false)"
  >
    <div class="add-slide" @click="createSlide()">+ 添加幻灯片</div>
    <Draggable 
      class="thumbnail-list"
      :modelValue="slides"
      :animation="300"
      :scroll="true"
      :scrollSensitivity="50"
      @end="handleDragEnd"
      itemKey="id"
    >
      <template #item="{ element, index }">
        <div
          class="thumbnail-wrapper"
          :class="{ 'active': slideIndex === index }"
          @mousedown="changSlideIndex(index)"
          v-contextmenu="contextmenus"
        >
          <div class="slide-index">{{ fillDigit(index + 1, 2) }}</div>
          <div class="thumbnail">
            <ThumbnailSlide :slide="element" :size="120" />
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { fillDigit } from '@/utils/common'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useSlideHandler from '@/hooks/useSlideHandler'

import Draggable from 'vuedraggable'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'thumbnails',
  components: {
    Draggable,
    ThumbnailSlide,
  },
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)

    const {
      copySlide,
      pasteSlide,
      createSlide,
      copyAndPasteSlide,
      deleteSlide,
      cutSlide,
    } = useSlideHandler()

    const changSlideIndex = (index: number) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])

      if(slideIndex.value === index) return
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, index)
    }

    const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)

    const setThumbnailsFocus = (focus: boolean) => {
      if(thumbnailsFocus.value === focus) return
      store.commit(MutationTypes.SET_THUMBNAILS_FOCUS, focus)
    }

    const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
      const { newIndex, oldIndex } = eventData
      if(oldIndex === newIndex) return

      const _slides = JSON.parse(JSON.stringify(slides.value))
      const _slide = _slides[oldIndex]
      _slides.splice(oldIndex, 1)
      _slides.splice(newIndex, 0, _slide)
      store.commit(MutationTypes.SET_SLIDES, _slides)
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, newIndex)
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '剪切',
          subText: 'Ctrl + X',
          handler: cutSlide,
        },
        {
          text: '复制',
          subText: 'Ctrl + C',
          handler: copySlide,
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteSlide,
        },
        { divider: true },
        {
          text: '新建页面',
          subText: 'Enter',
          handler: createSlide,
        },
        {
          text: '复制页面',
          handler: copyAndPasteSlide,
        },
        {
          text: '删除页面',
          subText: 'Delete',
          handler: deleteSlide,
        },
      ]
    }

    return {
      setThumbnailsFocus,
      slides,
      slideIndex,
      createSlide,
      changSlideIndex,
      contextmenus,
      fillDigit,
      handleDragEnd,
    }
  },
})
</script>

<style lang="scss" scoped>
.thumbnails {
  border-right: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  user-select: none;
}
.add-slide {
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;
}
.thumbnail-list {
  padding: 5px 0;
  flex: 1;
  overflow: auto;
}
.thumbnail-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;

  .thumbnail {
    outline: 1px solid rgba($color: $themeColor, $alpha: .1);
  }

  &.active {
    .slide-index {
      color: $themeColor;
    }
    .thumbnail {
      outline-color: $themeColor;
    }
  }
}
.thumbnail {
  width: 120px;
  height: 67.5px;
}
.slide-index {
  font-size: 12px;
  color: #999;
  width: 20px;
}
</style>
<template>
  <div 
    class="thumbnails"
    @mousedown="() => setThumbnailsFocus(true)"
    v-click-outside="() => setThumbnailsFocus(false)"
    v-contextmenu="contextmenusThumbnails"
  >
    <div class="add-slide" @click="createSlide()"><IconPlus class="icon" />添加幻灯片</div>
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
          class="thumbnail-item"
          :class="{
            'active': slideIndex === index,
            'selected': selectedSlidesIndex.includes(index),
          }"
          @mousedown="handleClickSlideThumbnail(index)"
          v-contextmenu="contextmenusThumbnailItem"
        >
          <div class="label">{{ fillDigit(index + 1, 2) }}</div>
          <ThumbnailSlide class="thumbnail" :slide="element" :size="120" />
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { fillDigit } from '@/utils/common'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useSlideHandler from '@/hooks/useSlideHandler'
import useScreening from '@/hooks/useScreening'

import Draggable from 'vuedraggable'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

export default defineComponent({
  name: 'thumbnails',
  components: {
    Draggable,
    ThumbnailSlide,
  },
  setup() {
    const store = useStore()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)
    const ctrlKeyState = computed(() => store.state.ctrlKeyState)
    const shiftKeyState = computed(() => store.state.shiftKeyState)
    const selectedSlidesIndex = computed(() => [...store.state.selectedSlidesIndex, slideIndex.value])

    const {
      copySlide,
      pasteSlide,
      createSlide,
      copyAndPasteSlide,
      deleteSlide,
      cutSlide,
      selectAllSlide,
    } = useSlideHandler()

    // 切换页面
    const changSlideIndex = (index: number) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])

      if (slideIndex.value === index) return
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, index)
    }

    // 点击缩略图
    const handleClickSlideThumbnail = (index: number) => {
      const isMultiSelected = selectedSlidesIndex.value.length > 1

      // 按住Ctrl键，点选幻灯片，再次点击已选中的页面则取消选中
      if (ctrlKeyState.value) {
        if (slideIndex.value === index) {
          if (!isMultiSelected) return

          const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
          store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, newSelectedSlidesIndex)
          changSlideIndex(selectedSlidesIndex.value[0])
        }
        else {
          if (selectedSlidesIndex.value.includes(index)) {
            const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
            store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, newSelectedSlidesIndex)
          }
          else {
            const newSelectedSlidesIndex = [...selectedSlidesIndex.value, index]
            store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, newSelectedSlidesIndex)
            changSlideIndex(index)
          }
        }
      }
      // 按住Shift键，选择范围内的全部幻灯片
      else if (shiftKeyState.value) {
        if (slideIndex.value === index && !isMultiSelected) return

        let minIndex = Math.min(...selectedSlidesIndex.value)
        let maxIndex = index

        if (index < minIndex) {
          maxIndex = Math.max(...selectedSlidesIndex.value)
          minIndex = index
        }

        const newSelectedSlidesIndex = []
        for (let i = minIndex; i <= maxIndex; i++) newSelectedSlidesIndex.push(i)
        store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, newSelectedSlidesIndex)
        changSlideIndex(index)
      }
      // 正常切换页面
      else {
        store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, [])
        changSlideIndex(index)
      }
    }

    const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)

    // 设置缩略图工具栏聚焦状态（只有聚焦状态下，该部分的快捷键才能生效）
    const setThumbnailsFocus = (focus: boolean) => {
      if (thumbnailsFocus.value === focus) return
      store.commit(MutationTypes.SET_THUMBNAILS_FOCUS, focus)

      if (!focus) store.commit(MutationTypes.UPDATE_SELECTED_SLIDES_INDEX, [])
    }

    // 拖拽调整顺序后进行数据的同步
    const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
      const { newIndex, oldIndex } = eventData
      if (oldIndex === newIndex) return

      const _slides = JSON.parse(JSON.stringify(slides.value))
      const _slide = _slides[oldIndex]
      _slides.splice(oldIndex, 1)
      _slides.splice(newIndex, 0, _slide)
      store.commit(MutationTypes.SET_SLIDES, _slides)
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, newIndex)
    }

    const { enterScreening } = useScreening()

    const contextmenusThumbnails = (): ContextmenuItem[] => {
      return [
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteSlide,
        },
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllSlide,
        },
        {
          text: '新建页面',
          subText: 'Enter',
          handler: createSlide,
        },
        {
          text: '开始演示',
          subText: 'Ctrl + F',
          handler: enterScreening,
        },
      ]
    }

    const contextmenusThumbnailItem = (): ContextmenuItem[] => {
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
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllSlide,
        },
        { divider: true },
        {
          text: '新建页面',
          subText: 'Enter',
          handler: createSlide,
        },
        {
          text: '复制页面',
          subText: 'Ctrl + D',
          handler: copyAndPasteSlide,
        },
        {
          text: '删除页面',
          subText: 'Delete',
          handler: () => deleteSlide(),
        },
        { divider: true },
        {
          text: '从当前页演示',
          subText: 'Ctrl + F',
          handler: enterScreening,
        },
      ]
    }

    return {
      setThumbnailsFocus,
      slides,
      slideIndex,
      selectedSlidesIndex,
      createSlide,
      handleClickSlideThumbnail,
      contextmenusThumbnails,
      contextmenusThumbnailItem,
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

  .icon {
    margin-right: 3px;
    font-size: 14px;
  }
}
.thumbnail-list {
  padding: 5px 0;
  flex: 1;
  overflow: auto;
}
.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;

  .thumbnail {
    outline: 1px solid rgba($color: $themeColor, $alpha: .15);
  }

  &.active {
    .label {
      color: $themeColor;
    }
    .thumbnail {
      outline-color: $themeColor;
    }
  }
  &.selected {
    .thumbnail {
      outline-color: $themeColor;
    }
  }
}
.label {
  font-size: 12px;
  color: #999;
  width: 20px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
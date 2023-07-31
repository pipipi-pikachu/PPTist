<template>
  <div class="thumbnails" @mousedown="() => setThumbnailsFocus(true)" v-click-outside="() => setThumbnailsFocus(false)"
    v-contextmenu="contextmenusThumbnails">
    <div class="add-slide">
      <div class="btn" @click="createSlide()">
        <IconPlus class="icon" />Add slideshow
      </div>
      <Popover trigger="click" placement="bottomLeft" v-model:visible="presetLayoutPopoverVisible">
        <template #content>
          <LayoutPool @select="slide => { createSlideByTemplate(slide); presetLayoutPopoverVisible = false }" />
        </template>
        <div class="select-btn">
          <IconDown />
        </div>
      </Popover>
    </div>

    <Draggable class="thumbnail-list" :modelValue="slides" :animation="200" :scroll="true" :scrollSensitivity="50"
      @end="handleDragEnd" itemKey="id">
      <template #item="{ element, index }">
        <div class="thumbnail-item" :class="{
          'active': slideIndex === index,
          'selected': selectedSlidesIndex.includes(index),
        }" @mousedown="$event => handleClickSlideThumbnail($event, index)" v-contextmenu="contextmenusThumbnailItem">
          <div class="label" :class="{ 'offset-left': index >= 99 }">{{ fillDigit(index + 1, 2) }}</div>
          <ThumbnailSlide class="thumbnail" :slide="element" :size="120" :visible="index < slidesLoadLimit" />
        </div>
      </template>
    </Draggable>

    <div class="page-number">Slides {{ slideIndex + 1 }} / {{ slides.length }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import { fillDigit } from '@/utils/common'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useSlideHandler from '@/hooks/useSlideHandler'
import useScreening from '@/hooks/useScreening'
import useLoadSlides from '@/hooks/useLoadSlides'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import LayoutPool from './LayoutPool.vue'
import Draggable from 'vuedraggable'
import { Popover } from 'ant-design-vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const keyboardStore = useKeyboardStore()
const { selectedSlidesIndex: _selectedSlidesIndex, thumbnailsFocus } = storeToRefs(mainStore)
const { slides, slideIndex } = storeToRefs(slidesStore)
const { ctrlKeyState, shiftKeyState } = storeToRefs(keyboardStore)

const { slidesLoadLimit } = useLoadSlides()

const selectedSlidesIndex = computed(() => [..._selectedSlidesIndex.value, slideIndex.value])

const presetLayoutPopoverVisible = ref(false)

const {
  copySlide,
  pasteSlide,
  createSlide,
  createSlideByTemplate,
  copyAndPasteSlide,
  deleteSlide,
  cutSlide,
  selectAllSlide,
  sortSlides,
} = useSlideHandler()

// switch page
const changeSlideIndex = (index: number) => {
  mainStore.setActiveElementIdList([])

  if (slideIndex.value === index) return
  slidesStore.updateSlideIndex(index)
}

// click on the thumbnail
const handleClickSlideThumbnail = (e: MouseEvent, index: number) => {
  const isMultiSelected = selectedSlidesIndex.value.length > 1

  if (isMultiSelected && selectedSlidesIndex.value.includes(index) && e.button !== 0) return

  // Hold down the Ctrl key, click on the slide, and click on the selected page again to cancel the selection
  if (ctrlKeyState.value) {
    if (slideIndex.value === index) {
      if (!isMultiSelected) return

      const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
      mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      changeSlideIndex(selectedSlidesIndex.value[0])
    }
    else {
      if (selectedSlidesIndex.value.includes(index)) {
        const newSelectedSlidesIndex = selectedSlidesIndex.value.filter(item => item !== index)
        mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
      }
      else {
        const newSelectedSlidesIndex = [...selectedSlidesIndex.value, index]
        mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
        changeSlideIndex(index)
      }
    }
  }
  // Hold down the Shift key to select all slides in the range
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
    mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
    changeSlideIndex(index)
  }
  // Switch pages normally
  else {
    mainStore.updateSelectedSlidesIndex([])
    changeSlideIndex(index)
  }
}

// Set the focus state of the thumbnail toolbar (only in the focus state, the shortcut keys of this part can take effect)
const setThumbnailsFocus = (focus: boolean) => {
  if (thumbnailsFocus.value === focus) return
  mainStore.setThumbnailsFocus(focus)

  if (!focus) mainStore.updateSelectedSlidesIndex([])
}// Drag and drop to adjust the order to synchronize the data
const handleDragEnd = (eventData: { newIndex: number; oldIndex: number }) => {
  const { newIndex, oldIndex } = eventData
  if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
  sortSlides(newIndex, oldIndex)
}

const { enterScreening, enterScreeningFromStart } = useScreening()

const contextmenusThumbnails = (): ContextmenuItem[] => {
  return [
    {
      text: 'Paste',
      subText: 'Ctrl + V',
      handler: pasteSlide,
    },
    {
      text: 'Select all',
      subText: 'Ctrl + A',
      handler: selectAllSlide,
    },
    {
      text: 'New page',
      subText: 'Enter',
      handler: createSlide,
    },
    {
      text: 'Slideshow',
      subText: 'F5',
      handler: enterScreeningFromStart,
    },
  ]
}

const contextmenusThumbnailItem = (): ContextmenuItem[] => {
  return [
    {
      text: 'Cut',
      subText: 'Ctrl + X',
      handler: cutSlide,
    },
    {
      text: 'Copy',
      subText: 'Ctrl + C',
      handler: copySlide,
    },
    {
      text: 'Paste',
      subText: 'Ctrl + V',
      handler: pasteSlide,
    },
    {
      text: 'Select all',
      subText: 'Ctrl + A',
      handler: selectAllSlide,
    },
    { divider: true },
    {
      text: 'New page',
      subText: 'Enter',
      handler: createSlide,
    },
    {
      text: 'Copy page',
      subText: 'Ctrl + D',
      handler: copyAndPasteSlide,
    },
    {
      text: 'Delete page',
      subText: 'Delete',
      handler: () => deleteSlide(),
    },
    { divider: true },
    {
      text: 'From current show',
      subText: 'Shift + F5',
      handler: enterScreening,
    },
  ]
}
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
  flex-shrink: 0;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  .btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $lightGray;
    }
  }

  .select-btn {
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid $borderColor;

    &:hover {
      background-color: $lightGray;
    }
  }

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

  &.offset-left {
    position: relative;
    left: -4px;
  }

  &:active {
    cursor: grabbing;
  }
}

.page-number {
  height: 40px;
  font-size: 12px;
  border-top: 1px solid $borderColor;
  line-height: 40px;
  text-align: center;
  color: #666;
}
</style>
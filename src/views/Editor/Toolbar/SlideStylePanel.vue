<template>
  <div class="slide-style-panel">
    <div class="title">背景填充</div>
    <div class="row">
      <Select 
        style="flex: 10;" 
        :value="background.type" 
        @change="value => updateBackgroundType(value)"
      >
        <SelectOption value="solid">纯色填充</SelectOption>
        <SelectOption value="image">图片填充</SelectOption>
      </Select>
      <div style="flex: 1;"></div>
      <Popover trigger="click" v-if="background.type === 'solid'">
        <template #content>
          <ColorPicker
            :modelValue="background.value"
            @update:modelValue="value => updateBackground({ value })"
          />
        </template>
        <ColorButton :color="background.value" style="flex: 10;" />
      </Popover>
      <Select 
        style="flex: 10;" 
        :value="background.size || 'cover'" 
        @change="value => updateBackground({ size: value })"
        v-else
      >
        <SelectOption value="initial">原始大小</SelectOption>
        <SelectOption value="contain">缩放</SelectOption>
        <SelectOption value="repeat">拼贴</SelectOption>
        <SelectOption value="cover">缩放铺满</SelectOption>
      </Select>
    </div>
    <div class="background-image-wrapper" v-if="background.type === 'image'">
      <FileInput @change="files => uploadBackgroundImage(files)">
        <div class="background-image">
          <div class="content" :style="{ backgroundImage: `url(${background.value})` }">
            <IconPlus />
          </div>
        </div>
      </FileInput>
    </div>
    <div class="row"><Button style="flex: 1;" @click="applyAllSlide()">应用到全部</Button></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { Slide, SlideBackground } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './common/ColorButton.vue'
import { getImageDataURL } from '@/utils/image'

export default defineComponent({
  name: 'slide-style-panel',
  components: {
    ColorButton,
  },
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const background = computed(() => {
      if(!currentSlide.value.background) {
        return {
          type: 'solid',
          value: '#fff',
        } as SlideBackground
      }
      return currentSlide.value.background
    })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateBackgroundType = (type: 'solid' | 'image') => {
      if(type === 'solid') {
        const background: SlideBackground = {
          type: 'solid',
          value: '#fff',
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background })
      }
      else {
        const background: SlideBackground = {
          type: 'image',
          value: '',
          size: 'cover',
        }
        store.commit(MutationTypes.UPDATE_SLIDE, { background })
      }
      addHistorySnapshot()
    }

    const updateBackground = (props: Partial<SlideBackground>) => {
      store.commit(MutationTypes.UPDATE_SLIDE, { background: { ...background.value, ...props } })
      addHistorySnapshot()
    }

    const uploadBackgroundImage = (files: File[]) => {
      const imageFile = files[0]
      if(!imageFile) return
      getImageDataURL(imageFile).then(dataURL => updateBackground({ value: dataURL }))
    }

    const applyAllSlide = () => {
      const newSlides = slides.value.map(slide => {
        return {
          ...slide,
          background: currentSlide.value.background,
        }
      })
      store.commit(MutationTypes.SET_SLIDES, newSlides)
      addHistorySnapshot()
    }

    return {
      background,
      updateBackgroundType,
      updateBackground,
      uploadBackgroundImage,
      applyAllSlide,
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  margin-bottom: 10px;
}
.background-image-wrapper {
  margin-bottom: 10px;
}
.background-image {
  height: 0;
  padding-bottom: 56.25%;
  border: 1px dashed $borderColor;
  border-radius: $borderRadius;
  position: relative;
  transition: all .2s;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
  }

  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
</style>
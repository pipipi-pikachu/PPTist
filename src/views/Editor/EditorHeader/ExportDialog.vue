<template>
  <div class="export-dialog">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ 'active': tab.value === currentTab }"
        v-for="tab in tabs" 
        :key="tab.value"
        @click="currentTab = tab.value"
      >{{tab.label}}</div>
    </div>

    <div class="content json" v-if="currentTab === 'json'">
      <div class="json-preview">
        <pre>{{slides}}</pre>
      </div>
      <div class="json-configs">
        <Button class="btn" type="primary" @click="exportJSON()">导出 JSON 文件</Button>
        <Button class="btn" @click="emit('close')">关闭</Button>
      </div>
    </div>

    <div class="content image" v-if="currentTab === 'image'">
      <div class="thumbnails-view">
        <div class="thumbnails" ref="imageThumbnailsRef">
          <ThumbnailSlide 
            class="thumbnail" 
            v-for="slide in slides" 
            :key="slide.id" 
            :slide="slide" 
            :size="1600" 
          />
        </div>
      </div>
      <div class="configs">
        <Button class="btn" type="primary" @click="exportImage('png')">导出 PNG 图片</Button>
        <Button class="btn" type="primary" @click="exportImage('jpeg')">导出 JPEG 图片</Button>
        <Button class="btn" @click="emit('close')">关闭</Button>
      </div>
      <div class="spinning" v-if="spinning">
        <Spin />
        <div class="tip">正在导出，请稍等...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import { saveAs } from 'file-saver'
import { toPng, toJpeg } from 'html-to-image'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'export-dialog',
  components: {
    ThumbnailSlide,
  },
  setup(props, { emit }) {
    const store = useStore()
    const slides = computed(() => store.state.slides)

    const tabs = ref([
      { label: 'JSON', value: 'json' },
      { label: '图片', value: 'image' },
    ])

    const currentTab = ref('json')
    const spinning = ref(false)

    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(slides.value)], { type: '' })
      saveAs(blob, 'pptist_slides.json')
    }

    const imageThumbnailsRef = ref<HTMLElement>()
    const exportImage = (type: string) => {
      spinning.value = true
      const toImage = type === 'png' ? toPng : toJpeg

      setTimeout(() => {
        if (!imageThumbnailsRef.value) return

        toImage(imageThumbnailsRef.value, {
          quality: 0.95,
          width: 1600,
        }).then(dataUrl => {
          spinning.value = false
          saveAs(dataUrl, `pptist_slides.${type}`)
        }).catch(() => {
          spinning.value = false
          message.error('导出图片失败')
        })
      }, 200)
    }

    return {
      tabs,
      currentTab,
      spinning,
      slides,
      exportJSON,
      exportImage,
      imageThumbnailsRef,
      emit,
    }
  },
})
</script>

<style lang="scss" scoped>
.export-dialog {
  height: 500px;
}
.tabs {
  height: 40px;
  font-size: 12px;
  display: flex;
  margin: -24px -24px 20px -24px;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}

.content {
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.json-preview {
  width: 460px;
  height: 100%;
  overflow: auto;
  margin-right: 20px;
  background-color: #2d2d30;
  color: #fff;

  pre {
    width: 100%;
    height: 100%;
  }
}
.json-configs {
  flex: 1;

  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}

.thumbnails-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}

.configs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .btn {
    width: 240px;
    margin-bottom: 12px;
  }
}

.spinning {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .tip {
    margin-top: 10px;
    color: $themeColor;
  }
}
</style>
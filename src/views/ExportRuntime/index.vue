<template>
  <div class="export-runtime">
    <div
      class="export-page"
      v-for="slide in renderSlides"
      :key="slide.id"
      :style="{
        width: viewportSize + 'px',
        height: viewportSize * viewportRatio + 'px',
      }"
    >
      <ThumbnailSlide :slide="slide" :size="viewportSize" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide, SlideTheme } from '@/types/slides'
import useExport from '@/hooks/useExport'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

interface ExportDoc {
  title: string
  theme: SlideTheme
  viewportSize: number
  viewportRatio: number
  slides: Slide[]
}

interface PPTXOptions {
  masterOverwrite?: boolean
  ignoreMedia?: boolean
  slides?: number[]
}

declare global {
  interface Window {
    __PPTIST_EXPORT__: {
      ready: boolean
      load: (doc: ExportDoc) => Promise<void>
      pptx: (options?: PPTXOptions) => Promise<string>
    }
  }
}

const slidesStore = useSlidesStore()
const { viewportSize, viewportRatio } = storeToRefs(slidesStore)
const { buildPPTX } = useExport()

// 服务端调用 load() 后才渲染页面，避免启动时空闪
const renderSlides = ref<Slide[]>([])

const waitForImages = () => {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.export-page img'))
  return Promise.all(imgs.map(img => {
    if (img.complete) return Promise.resolve()
    return new Promise<void>(resolve => {
      img.addEventListener('load', () => resolve(), { once: true })
      img.addEventListener('error', () => resolve(), { once: true })
    })
  }))
}

const waitForFrames = (count: number) => new Promise<void>(resolve => {
  const step = (left: number) => {
    if (left <= 0) return resolve()
    requestAnimationFrame(() => step(left - 1))
  }
  step(count)
})

const load = async (doc: ExportDoc) => {
  window.__PPTIST_EXPORT__.ready = false
  renderSlides.value = []

  slidesStore.setTitle(doc.title)
  slidesStore.setTheme(doc.theme)
  slidesStore.setViewportSize(doc.viewportSize)
  slidesStore.setViewportRatio(doc.viewportRatio)
  slidesStore.setSlides(doc.slides)
  renderSlides.value = doc.slides

  await nextTick()
  await document.fonts.ready
  await waitForImages()
  await waitForFrames(2)
  window.__PPTIST_EXPORT__.ready = true
}

// 返回 base64 字符串，由服务端写文件；slides 为页码子集（从 0 开始）
const pptx = async (options?: PPTXOptions): Promise<string> => {
  const { masterOverwrite = false, ignoreMedia = false, slides } = options ?? {}
  const all = slidesStore.slides
  const selected = slides ? slides.map(i => all[i]).filter(Boolean) : all
  const pptx = buildPPTX(selected, masterOverwrite, ignoreMedia)
  return await pptx.write({ outputType: 'base64' }) as string
}

window.__PPTIST_EXPORT__ = { ready: false, load, pptx }
</script>

<style lang="scss" scoped>
.export-runtime {
  margin: 0;
}
.export-page {
  page-break-after: always;
  break-after: page;
  overflow: hidden;
}
</style>

<!-- 全局样式 overflow:hidden 会裁掉第一页之后的内容，打印时放开让每页一张 -->
<style lang="scss">
@media print {
  html,
  body,
  #app {
    height: auto !important;
    overflow: visible !important;
  }
}
</style>

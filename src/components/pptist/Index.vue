<style lang="scss">
@import '@icon-park/vue-next/styles/index.css';
@import 'prosemirror-view/style/prosemirror.css';
@import 'animate.css';
@import './styles/prosemirror.scss';
@import './styles/global.scss';
@import './styles/font.scss';
</style>

<template>
  <Screen v-if="screening" />
  <Editor v-else-if="_isPC" />
  <Mobile v-else />
</template>

<script lang="ts" setup>
import { watch, onMounted, defineEmits } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from './store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from './configs/storage'
import { deleteDiscardedDB } from './utils/database'
import { isPC } from './utils/common'
// pinia存在此问题https://github.com/vuejs/pinia/discussions/2487
const slidesStore = useSlidesStore(window.pinia)
const { title, theme, slides } = slidesStore
import type { Slide, SlideTheme} from './types/slides'

import Editor from './Editor/index.vue'
import Screen from './Screen/index.vue'
import Mobile from './Mobile/index.vue'
import { TitleLevel } from '@icon-park/vue-next'

const _isPC = isPC()

const mainStore = useMainStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)
const { screening } = storeToRefs(useScreenStore())

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: Object): void
}>()

watch(slides,(newValue)=>{ // 监测一个响应式值的变化
  emit('update:modelValue', {
    title: title,
    theme: theme,
    slides: newValue
  } )
})
watch(theme,(newValue)=>{ // 监测一个响应式值的变化
  emit('update:modelValue', {
    title: title,
    theme: newValue,
    slides: slides
  } )
})

// 编辑器配置
type Options = {
  showEditorHeader: boolean,
  exportFileTypes: string[],
  fileMenuItems: string[],
}
type ModelValue = {
  title: string,
  theme: Partial<SlideTheme>,
  slides: Slide[],
}
const props = withDefaults(defineProps<{
  modelValue: ModelValue,
  options: Options
}>(), {
  options: () => ({
    showEditorHeader: true,
    exportFileTypes: [],
    fileMenuItems: []
  })
})

watch(
  () => props.modelValue.title,
  (newVal) => {
    slidesStore.setTitle(newVal)
  }
)

onMounted(async () => {
  mainStore.setShowEditorHeader(props.options.showEditorHeader)
  if (props.options.exportFileTypes.length > 0) {
    mainStore.setExportFileTypes(props.options.exportFileTypes)
  }
  if (props.options.fileMenuItems.length > 0) {
    mainStore.setFileMenuItems(props.options.fileMenuItems)
  }
  // 初始化幻灯片数据
  if (props.modelValue.slides.length > 0) {
    slidesStore.setTitle(props.modelValue.title)
    slidesStore.setTheme(props.modelValue.theme)
    slidesStore.setSlides(props.modelValue.slides)
  }
  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
  mainStore.setAvailableFonts()
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('unload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>


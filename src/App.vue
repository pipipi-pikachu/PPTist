<template>
  <GeneratePPTTest v-if="isGeneratePPTTestPage" />
  <template v-else-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else  loading :mask="false" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import { installIframeBridge, notifyIframeBridgeReady, type DisposeIframeBridge } from '@/utils/iframeBridge'
import api from '@/services'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import GeneratePPTTest from './views/Test/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

/**
 * 应用初始化调试日志前缀。
 *
 * 功能描述：
 * - 统一根组件初始化、iframe 桥接安装和 ready 通知时机的控制台输出。
 * - 帮助验证父项目是否在当前项目完成初始化后再开始发送消息。
 *
 * 入参：
 * - 常量没有入参。
 *
 * 返回值：
 * - 常量没有返回值。
 *
 * 异常：
 * - 常量定义不会抛出异常。
 *
 * 注意事项：
 * - 日志只记录运行模式和数量信息，不包含用户数据明文。
 */
const APP_DEBUG_PREFIX = '[PPTist App]'

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const screenStore = useScreenStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(screenStore)

const isAudienceMode = new URLSearchParams(window.location.search).get('mode') === 'audience'

/**
 * 当前页面是否为 generatePPT 测试页。
 *
 * 功能说明：
 * - 项目当前没有引入 vue-router，因此这里用 pathname 做一个轻量路由分支。
 * - 访问 `/test` 时只渲染测试页，不进入编辑器初始化流程。
 *
 * 边界说明：
 * - 仅匹配精确路径 `/test`，避免影响正常编辑器首页。
 * - 如果部署在带 base path 的环境，需要由外层服务器把 `/test` 回退到当前 index.html。
 */
const isGeneratePPTTestPage = window.location.pathname === '/test'

/** iframe 桥接卸载函数：应用卸载时移除全局 postMessage 监听，避免重复安装。 */
let disposeIframeBridge: DisposeIframeBridge | null = null

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

onMounted(async () => {
  /**
   * generatePPT 测试页跳过主应用初始化。
   *
   * 这样做的原因：
   * - 测试页只验证 `src/utils/generatePPT`，不需要加载默认 slides、安装 iframeBridge 或初始化快照数据库。
   * - 跳过主流程可以避免测试生成逻辑时受到编辑器初始化、副作用监听或父窗口消息影响。
   */
  if (isGeneratePPTTestPage) return

  // 打印应用挂载开始，便于判断 iframe 页面生命周期。
  console.info(APP_DEBUG_PREFIX, 'mounted:start', {
    // 当前 Vite 模式。
    mode: import.meta.env.MODE,
    // 是否运行在 iframe 内。
    inIframe: window.parent !== window,
    // 是否观众模式。
    isAudienceMode,
    // 当前页面 origin。
    origin: window.location.origin,
  })
  // 安装父级 iframe postMessage 桥接监听，并从 URL query 中初始化父级 token。
  disposeIframeBridge = installIframeBridge()
  // 打印桥接监听已安装。
  console.info(APP_DEBUG_PREFIX, 'iframe bridge installed')

  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
    // 打印观众模式初始化完成。
    console.info(APP_DEBUG_PREFIX, 'audience mode initialized')
  }
  else {
    const slides = await api.getMockData('slides')
    slidesStore.setSlides(slides)
    // 打印默认 mock slides 加载完成。
    console.info(APP_DEBUG_PREFIX, 'default slides loaded', {
      // 页面数量。
      slidesCount: Array.isArray(slides) ? slides.length : undefined,
    })

    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
    // 打印本地快照数据库初始化完成。
    console.info(APP_DEBUG_PREFIX, 'snapshot database initialized')
  }

  // 初始页面数据加载完成后再通知父级，避免父级发送的 slides 被初始化 mock 数据覆盖。
  notifyIframeBridgeReady()
  // 打印 ready 通知已触发。
  console.info(APP_DEBUG_PREFIX, 'iframe bridge ready notified', {
    // 当前 slides 数量。
    slidesCount: slidesStore.slides.length,
  })
})

/**
 * 组件卸载时清理 iframe 桥接监听。
 *
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错；卸载函数内部只移除事件监听。
 * @remarks 虽然根组件通常不会卸载，但 HMR 或微前端容器切换时仍可能触发。
 */
onBeforeUnmount(() => {
  // 打印应用卸载，便于 HMR 或父容器重载时排查监听清理。
  console.info(APP_DEBUG_PREFIX, 'beforeUnmount')
  // 存在卸载函数时执行清理。
  if (disposeIframeBridge) disposeIframeBridge()
  // 清空引用，避免重复调用。
  disposeIframeBridge = null
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('beforeunload', () => {
  /**
   * generatePPT 测试页不写入废弃数据库记录。
   *
   * 边界说明：
   * - 测试页不会初始化 snapshot database。
   * - 如果仍然写 databaseId，可能把无意义 ID 写入 localStorage。
   */
  if (isGeneratePPTTestPage) return

  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>

import { nextTick } from 'vue'
import { debounce } from 'lodash'
import { useDocumentStore, useMainStore, useSlidesStore, useSnapshotStore } from '@/store'
import { AUTOSAVE_DELAY } from '@/configs/collab'
import {
  DocRequestError,
  getDoc,
  putDoc,
  setDocToken,
  subscribe,
  type DocData,
  type DocEvent,
} from '@/services/document'
import message from '@/utils/message'

// 409 冲突时本地版本备份用的 localStorage 键前缀
const BACKUP_KEY_PREFIX = 'PPTIST_DOC_BACKUP_'

export default () => {
  const documentStore = useDocumentStore()
  const slidesStore = useSlidesStore()
  const snapshotStore = useSnapshotStore()
  const mainStore = useMainStore()

  let initialized = false
  let lastSyncedJSON = ''
  let applyingRemote = false
  let dirty = false
  let saving = false
  let saveQueued = false
  let pendingRemote: DocEvent | null = null
  let pendingTimer: ReturnType<typeof setTimeout> | null = null

  const serializeDoc = (): DocData => ({
    title: slidesStore.title,
    theme: slidesStore.theme,
    viewportSize: slidesStore.viewportSize,
    viewportRatio: slidesStore.viewportRatio,
    slides: slidesStore.slides,
  })
  const serialize = () => JSON.stringify(serializeDoc())

  // 是否正聚焦于文本编辑（ProseMirror / input / textarea）
  const isEditingFocused = () => {
    const el = document.activeElement
    if (!el || !(el instanceof HTMLElement)) return false
    return !!el.closest('.ProseMirror') || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
  }

  const hasUnsavedChanges = () => dirty || saving

  // 用服务端文档覆盖本地状态（保持当前页、清理失效选中），应用期间置 applyingRemote 避免触发自动保存
  const applyRemoteDoc = async (doc: DocData & { version: number }) => {
    applyingRemote = true
    const currentSlideId = slidesStore.currentSlide?.id
    const oldIndex = slidesStore.slideIndex

    slidesStore.setTitle(doc.title)
    slidesStore.setTheme(doc.theme)
    slidesStore.setViewportSize(doc.viewportSize)
    slidesStore.setViewportRatio(doc.viewportRatio)
    slidesStore.setSlides(doc.slides)

    const nextIndex = doc.slides.findIndex(slide => slide.id === currentSlideId)
    slidesStore.updateSlideIndex(nextIndex >= 0 ? nextIndex : Math.max(0, Math.min(oldIndex, doc.slides.length - 1)))

    const elementIds = new Set((slidesStore.currentSlide?.elements || []).map(el => el.id))
    const remainingActiveIds = mainStore.activeElementIdList.filter(id => elementIds.has(id))
    if (remainingActiveIds.length !== mainStore.activeElementIdList.length) {
      mainStore.setActiveElementIdList(remainingActiveIds)
    }

    lastSyncedJSON = serialize()
    documentStore.setVersion(doc.version)
    dirty = false

    await nextTick()
    applyingRemote = false
  }

  const scheduleSave = debounce(() => void maybeSave(), AUTOSAVE_DELAY)

  async function maybeSave() {
    if (!initialized || applyingRemote || documentStore.readonly) return

    const json = serialize()
    if (json === lastSyncedJSON) {
      dirty = false
      if (documentStore.saveStatus === 'dirty') documentStore.setSaveStatus('saved')
      tryApplyPending()
      return
    }
    if (saving) {
      saveQueued = true
      return
    }

    saving = true
    documentStore.setSaveStatus('saving')
    try {
      const result = await putDoc(documentStore.docId, documentStore.version, JSON.parse(json))
      documentStore.setVersion(result.version)
      lastSyncedJSON = json
      if ((result.merged || result.normalized) && !dirty) {
        // 服务端做过合并/清洗，重新拉取保持一致；保存期间有新改动则留给下一次保存合并，不覆盖正在编辑的内容
        await applyRemoteDoc(await getDoc(documentStore.docId))
      }
      dirty = serialize() !== lastSyncedJSON
      documentStore.setSaveStatus(dirty ? 'dirty' : 'saved')
    }
    catch (e) {
      if (e instanceof DocRequestError && e.status === 409) {
        localStorage.setItem(`${BACKUP_KEY_PREFIX}${documentStore.docId}`, json)
        await applyRemoteDoc(await getDoc(documentStore.docId))
        documentStore.setSaveStatus('conflict')
        message.warning('与 Agent 的修改冲突，已载入最新版本')
      }
      else if (e instanceof DocRequestError && e.status < 500 && e.status !== 429) {
        // 服务端明确拒绝（如令牌失效、文档过大），不再自动重试
        documentStore.setSaveStatus('dirty')
      }
      else {
        documentStore.setSaveStatus('offline')
        setTimeout(scheduleSave, 5000)
      }
    }
    finally {
      saving = false
      if (saveQueued) {
        saveQueued = false
        scheduleSave()
      }
      tryApplyPending()
    }
  }

  // 有等待中的 Agent 更新时，延迟到可应用为止
  const schedulePendingCheck = () => {
    if (pendingTimer || !pendingRemote) return
    pendingTimer = setTimeout(() => {
      pendingTimer = null
      tryApplyPending()
    }, 400)
  }

  function tryApplyPending() {
    if (!pendingRemote) return
    if (pendingRemote.version <= documentStore.version) {
      pendingRemote = null
      return
    }
    // 正在编辑文本或有未保存改动时延后应用，不打断输入
    if (applyingRemote || saving || dirty || isEditingFocused()) {
      schedulePendingCheck()
      return
    }
    const event = pendingRemote
    pendingRemote = null
    void applyRemoteEvent(event)
  }

  async function applyRemoteEvent(event: DocEvent) {
    try {
      await applyRemoteDoc(await getDoc(documentStore.docId))
      documentStore.setLastRemoteSummary(event.summary)
      documentStore.setSaveStatus('saved')
      // Agent 的改动也加入历史快照，可以撤销
      await snapshotStore.addSnapshot()
    }
    catch (e) {
      // 4xx（如令牌失效）不再重试；网络/5xx 错误继续等待
      if (e instanceof DocRequestError && e.status < 500) {
        documentStore.setSaveStatus('offline')
        return
      }
      pendingRemote = event
      schedulePendingCheck()
    }
  }

  const onRemoteEvent = (event: DocEvent) => {
    if (event.author !== 'agent') return
    if (event.version <= documentStore.version) return
    pendingRemote = event
    tryApplyPending()
  }

  // 有 doc 的页面打开时调用一次：getDoc 初始化 slidesStore，然后挂上自动保存与 SSE
  const init = async () => {
    if (initialized) return
    initialized = true

    setDocToken(documentStore.token)
    const remote = await getDoc(documentStore.docId)

    documentStore.setRole(remote.role)
    documentStore.setVersion(remote.version)
    if (remote.viewUrl) documentStore.setViewUrl(remote.viewUrl)

    applyingRemote = true
    slidesStore.setTitle(remote.title)
    slidesStore.setTheme(remote.theme)
    slidesStore.setViewportSize(remote.viewportSize)
    slidesStore.setViewportRatio(remote.viewportRatio)
    slidesStore.setSlides(remote.slides)
    slidesStore.updateSlideIndex(0)
    lastSyncedJSON = serialize()
    await nextTick()
    applyingRemote = false

    if (!documentStore.readonly) {
      slidesStore.$subscribe(() => {
        if (applyingRemote || documentStore.readonly) return
        dirty = true
        if (documentStore.saveStatus === 'saved') documentStore.setSaveStatus('dirty')
        scheduleSave()
      })
    }
    subscribe(documentStore.docId, onRemoteEvent)
  }

  return {
    init,
    hasUnsavedChanges,
  }
}

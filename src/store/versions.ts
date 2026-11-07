import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore } from './slides'
import { useSnapshotStore } from './snapshot'
import { useMainStore } from './main'
import { indexedDBVersionStorage } from '@/utils/versionStorage'
import { capturePresentation, applyPresentation } from '@/utils/presentation'
import type { PresentationVersion, VersionStorage } from '@/types/version'

export const useVersionsStore = defineStore('versions', () => {
  const versions = shallowRef<PresentationVersion[]>([])
  const error = ref('')
  const restoring = ref(false)
  let storage: VersionStorage = indexedDBVersionStorage
  let documentId = 'local-workspace'
  let lastSaved = ''
  let ready = false
  let pending: Promise<unknown> = Promise.resolve()

  // Configure once before initialize(), using the host's stable document ID.
  const configure = (id: string, adapter: VersionStorage) => {
    documentId = id
    storage = adapter
  }
  const refresh = async () => {
    versions.value = await storage.list(documentId)
    ready = true
    error.value = ''
  }
  const initialize = async () => {
    try {
      await refresh()
      const latest = versions.value[0]
      if (!latest) return false
      applyPresentation(latest.presentation)
      lastSaved = JSON.stringify(latest.presentation)
      return true
    }
    catch {
      error.value = '无法读取版本历史，请检查浏览器存储权限后重试'
      return false
    }
  }
  const save = (reason: PresentationVersion['reason'] = 'manual') => {
    const presentation = capturePresentation()
    const fingerprint = JSON.stringify(presentation)
    const operation = pending.then(async () => {
      if (!ready) throw new Error('无法读取版本历史，请重试后保存')
      if (!presentation.slides.length || (reason === 'automatic' && fingerprint === lastSaved)) return
      await storage.save({ id: nanoid(), documentId, createdAt: Date.now(), reason, presentation })
      lastSaved = fingerprint
      versions.value = await storage.list(documentId)
      error.value = ''
    })
    pending = operation.catch((cause: unknown) => {
      error.value = cause instanceof Error ? cause.message : '版本保存失败，请重试'
    })
    return operation
  }
  const restore = async (version: PresentationVersion) => {
    if (restoring.value) return
    restoring.value = true
    try {
      await save('before-change')
      const snapshots = useSnapshotStore()
      await snapshots.addSnapshot()
      applyPresentation(version.presentation)
      useMainStore().setActiveElementIdList([])
      await snapshots.addSnapshot()
      await save('restore')
    }
    finally {
      restoring.value = false
    }
  }
  const start = () => {
    const backgroundSave = (reason: PresentationVersion['reason']) => {
      void save(reason).catch(() => {})
    }
    let changePending = false
    let stopped = false
    const stop = useSlidesStore().$onAction(({ name }) => {
      if (!restoring.value && !changePending && ['setSlides', 'deleteSlide', 'setTheme', 'setViewportSize', 'setViewportRatio'].includes(name)) {
        changePending = true
        backgroundSave('before-change')
        // Imports update slides, theme, title and dimensions in the same synchronous turn.
        queueMicrotask(() => {
          changePending = false
          if (!stopped) backgroundSave('automatic')
        })
      }
    })
    const timer = window.setInterval(() => backgroundSave('automatic'), 60_000)
    const onHidden = () => {
      if (document.hidden) backgroundSave('automatic')
    }
    document.addEventListener('visibilitychange', onHidden)
    backgroundSave('automatic')
    return () => {
      stopped = true
      stop()
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }
  return { versions, error, restoring, configure, refresh, initialize, save, restore, start }
})

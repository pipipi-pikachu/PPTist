import Clipboard from 'clipboard'

/**
 * 复制文本到剪贴板
 * @param text 文本内容
 */
export const copyText = (text: string) => {
  return new Promise((resolve, reject) => {
    const fakeElement = document.createElement('button')
    const clipboard = new Clipboard(fakeElement, {
      text: () => text,
      action: () => 'copy',
      container: document.body,
    })
    clipboard.on('success', e => {
      clipboard.destroy()
      resolve(e)
    })
    clipboard.on('error', e => {
      clipboard.destroy()
      reject(e)
    })
    document.body.appendChild(fakeElement)
    fakeElement.click()
    document.body.removeChild(fakeElement)
  })
}

// 读取剪贴板
export const readClipboard = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard?.readText) {
      navigator.clipboard.readText().then(text => {
        if (!text) reject('剪贴板为空或者不包含文本')
        return resolve(text)
      })
    }
    else reject('浏览器不支持或禁止访问剪贴板，请使用快捷键 Ctrl + V')
  })
}
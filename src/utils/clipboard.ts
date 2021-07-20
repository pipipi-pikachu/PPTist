import Clipboard from 'clipboard'
import { decrypt } from '@/utils/crypto'

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

// 解析加密后的剪贴板内容
export const pasteCustomClipboardString = (text: string) => {
  let clipboardData
  try {
    clipboardData = JSON.parse(decrypt(text))
  }
  catch {
    clipboardData = text
  }

  return clipboardData
}

/**
 * 检查粘贴元素是否为外部exlc表格类型
 * @param text 
 * @returns 
 */
export const exlcTesting = (text: string): string[][] | boolean => {
  // 判定一下是不是exl格式
  const lineList: string[] = text.split('\r\n')
  // 按照\n拆分表格 最后会多出一个空字串
  if (lineList[lineList.length - 1] === '') {
    lineList.splice(length - 1, 1)
  }
  let tNum = -1
  const exlc: string[][] = []
  for (const index in lineList) {
    exlc[index] = lineList[index].split('\t')
    if (exlc[index].length === 1) return false
    if (tNum === -1) {
      tNum = exlc[index].length
    }
    else if (tNum !== exlc[index].length) {
      return false
    }
  }
  return exlc
}
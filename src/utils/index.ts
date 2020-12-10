import padStart from 'lodash/padStart'
import Clipboard from 'clipboard'
import CryptoJS from 'crypto-js'

const CRYPTO_KEY = 'zxc_ppt_online_editor'

// 生成随机数
export const createRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min))
}

// 生成随机码
export const createRandomCode = (len: number = 6) => {
  const charset = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
  const maxLen = charset.length
  let ret = ''
  for(let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * maxLen)
    ret += charset[randomIndex]
  }
  return ret
}

// 生成uuid
export const createUUID = () => {
  const url = URL.createObjectURL(new Blob())
  const uuid = url.toString()
  URL.revokeObjectURL(url)
  return uuid.substr(uuid.lastIndexOf('/') + 1)
}

// 获取当前日期字符串
export const getDateTime = (format: string = 'yyyy-MM-dd hh:mm:ss') => {
  const date = new Date()

  const formatMap = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }

  for(const item of Object.keys(formatMap)) {
    if(new RegExp('(' + item + ')').test(format)) {
      const formated = (formatMap[item] + '').length < RegExp.$1.length ? padStart('' + formatMap[item], RegExp.$1.length, '0') : formatMap[item]
      format = format.replace(RegExp.$1, formated)
    }
  }
  return format
}

// 数字转中文，如1049 -> 一千零四十九
export const digitalToChinese = (n: number) => {
  const str = n + ''
  const len = str.length - 1
  const idxs = ['', '十', '百', '千']
  const num = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  return str.replace(/([1-9]|0+)/g, ($, $1, idx) => {
    const pos = len - idx
    if($1 !== 0) {
      if(idx === 0 && $1 === 1 && idxs[pos] === '十') return idxs[pos]
      return num[$1] + idxs[pos]
    }
    if(idx + $1.length >= str.length) return ''
    return '零'
  })
}

// 数字补足位数，例如将6补足3位 -> 003
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}

// 进入全屏
export const enterFullscreen = () => {
  const docElm = document.documentElement
  docElm.requestFullscreen()
}

// 退出全屏
export const exitFullscreen = document.exitFullscreen

// 判断是否全屏
export const isFullscreen = () => document.fullscreenEnabled

// 判断用户的操作系统是否安装了某字体
export const isSupportFontFamily = (fontFamily: string) => {
  if(typeof fontFamily !== 'string') return false
  const arial = 'Arial'
  if(fontFamily.toLowerCase() === arial.toLowerCase()) return true
  const a = 'a'
  const size = 100
  const width = 100
  const height = 100

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if(!ctx) return false

  canvas.width = width
  canvas.height = height
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.textBaseline = 'middle'

  const getDotArray = (_fontFamily: string) => {
    ctx.clearRect(0, 0, width, height)
    ctx.font = `${size}px ${_fontFamily}, ${arial}`
    ctx.fillText(a, width / 2, height / 2)
    const imageData = ctx.getImageData(0, 0, width, height).data
    return [].slice.call(imageData).filter(item => item !== 0)
  }

  return getDotArray(arial).join('') !== getDotArray(fontFamily).join('')
}

// 获取图片的原始宽高
export const getImageSize = (imgUrl: string) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.src = imgUrl
    img.style.opacity = '0'
    document.body.appendChild(img)

    img.onload = () => {
      const imgWidth = img.clientWidth
      const imgHeight = img.clientHeight
    
      img.onload = null
      img.onerror = null

      document.body.removeChild(img)

      resolve({ imgWidth, imgHeight })
    }

    img.onerror = () => {
      img.onload = null
      img.onerror = null

      reject('图片加载失败')
    }
  })
}

// 复制文本到剪贴板
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

// 加密函数
export const encrypt = (msg: string) => {
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

// 解密函数
export const decrypt = (ciphertext: string) => {
  const bytes  = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 获取DOM节点样式
export const getStyle = (el: HTMLElement, style: string) => {
  if(!el) return null
  return window.getComputedStyle(el, null).getPropertyValue(style)
}

// 检查元素是否处在可视区域内
export const checkElementInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
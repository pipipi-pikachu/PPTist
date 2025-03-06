import { padStart } from 'lodash'

/**
 * 补足数字位数
 * @param digit 数字
 * @param len 位数
 */
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}

/**
 * 判断设备
 */
export const isPC = () => {
  return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Mobile|BlackBerry|Symbian|Windows Phone)/i)
}

/**
 * 判断URL字符串
 */
export const isValidURL = (url: string) => {
  return /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(url)
}

/**
 * 判断是否为跨域资源
 * @param resourceUrl
 */
export const isCrossOriginResource = (resourceUrl: string): boolean => {
  try {
    // 相对路径配置当前域名作为基础路径
    const resourceOrigin = new URL(resourceUrl, window.location.href).origin
    const currentOrigin = window.location.origin
    return resourceOrigin !== currentOrigin
  }
  catch (error) {
    return true // 出于安全考虑，如果 URL 无效，将其视为跨域
  }
}

import padStart from 'lodash/padStart'

// 生成随机码
export const createRandomCode = (len = 6) => {
  const charset = `_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
  const maxLen = charset.length
  let ret = ''
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * maxLen)
    ret += charset[randomIndex]
  }
  return ret
}

// 数字补足位数，例如将6补足3位 -> 003
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}
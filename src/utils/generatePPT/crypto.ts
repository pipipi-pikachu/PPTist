import CryptoJS from 'crypto-js'

// 项目内固定 AES 密钥；注意这是前端可见常量，只适合轻量混淆或本地存储保护，不适合高安全等级加密。
const CRYPTO_KEY = 'pptist'

/**
 * 使用 CryptoJS AES 算法加密明文字符串。
 *
 * @param msg - 待加密的明文字符串；调用方应确保传入值已经序列化为字符串。
 * @returns AES 加密后的密文字符串，可用于本地缓存或传输前的轻量保护。
 * @throws 当底层 CryptoJS AES 加密过程遇到非法输入或运行时异常时，会向上抛出原始异常。
 * @remarks
 * - 加密密钥硬编码在前端代码中，无法抵御有源码或构建产物访问权限的攻击者。
 * - 该方法不改变输入内容，也不负责 JSON 序列化；对象数据需要调用方自行 `JSON.stringify()`。
 * - 空字符串可以被加密，但解密后仍为空字符串，调用方需要自行区分空值和缺省值。
 */
export const encrypt = (msg: string) => {
  // 调用 CryptoJS AES 加密函数，将明文和固定密钥转换成 CipherParams 对象。
  // 随后通过 `toString()` 输出可存储、可传输的字符串格式密文。
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

/**
 * 使用 CryptoJS AES 算法解密密文字符串。
 *
 * @param ciphertext - 待解密的密文字符串，通常来自 `encrypt()` 的返回值。
 * @returns 解密后的 UTF-8 明文字符串；当密钥不匹配或密文非法时，可能返回空字符串。
 * @throws 当底层 CryptoJS AES 解密过程遇到运行时异常时，会向上抛出原始异常。
 * @remarks
 * - 该函数只负责 AES 解密，不负责校验明文是否为 JSON、URL 或其他业务格式。
 * - 如果传入空字符串、损坏密文或非本函数生成的内容，CryptoJS 可能不会抛错，而是返回无法转成 UTF-8 的结果。
 * - 调用方需要根据业务场景判断空字符串是否代表合法数据、解密失败或数据缺失。
 */
export const decrypt = (ciphertext: string) => {
  // 使用固定密钥对密文执行 AES 解密，得到 CryptoJS WordArray 字节数据。
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  // 将解密得到的字节数据按 UTF-8 编码转换为普通字符串，供业务层继续使用。
  return bytes.toString(CryptoJS.enc.Utf8)
}

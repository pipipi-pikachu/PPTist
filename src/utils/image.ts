interface ImageSize {
  width: number;
  height: number;
}

/**
 * 获取图片的原始宽高
 * @param src 图片地址
 */
export const getImageSize = (src: string): Promise<ImageSize> => {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.src = src
    img.style.opacity = '0'
    document.body.appendChild(img)

    img.onload = () => {
      const imgWidth = img.clientWidth
      const imgHeight = img.clientHeight

      img.onload = null
      img.onerror = null

      document.body.removeChild(img)

      resolve({ width: imgWidth, height: imgHeight })
    }

    img.onerror = () => {
      img.onload = null
      img.onerror = null
    }
  })
}

/**
 * 读取图片文件的dataURL
 * @param file 图片文件
 */
export const getImageDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('不支持的文件类型'))
      return
    }


    // 创建文件流
    const stream = file.stream()
    const reader = stream.getReader()

    // 收集数据块
    const chunks: Uint8Array[] = []
    
    reader.read().then(function processData({ done, value }): Promise<void> | void {
      if (done) {
        // 合并所有数据块
        const blob = new Blob(chunks, { type: file.type })
        const url = URL.createObjectURL(blob)
        resolve(url)
        return
      }

      chunks.push(value)
      return reader.read().then(processData)
    }).catch(error => {
      reject(new Error('文件读取失败: ' + error.message))
    })
  })
}

/**
 * 判断是否为SVG代码字符串
 * @param text 待验证文本
 */
export const isSVGString = (text: string): boolean => {
  const svgRegex = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i
  if (!svgRegex.test(text)) return false

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'image/svg+xml')
    return doc.documentElement.nodeName === 'svg'
  }
  catch {
    return false
  }
}

/**
 * SVG代码转文件
 * @param svg SVG代码
 */
export const svg2File = (svg: string): File => {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  return new File([blob], `${Date.now()}.svg`, { type: 'image/svg+xml' })
}

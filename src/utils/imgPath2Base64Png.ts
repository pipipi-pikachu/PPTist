/**
 * 通过canvas将外部链接图片转换为base64 png, 报错时返回空字符串
 * @param url
 */
export const urlImgToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    if (url.startsWith('data:image/')) {
      resolve(url)
    }
    else {
      try {
        // 新开一个OffscreenCanvas处理，避免阻塞主线程
        const canvas: OffscreenCanvas = new OffscreenCanvas(512, 512)// 创建一个离屏 Canvas
        const ctx = canvas.getContext('2d')

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = function() {
          canvas.width = img.width
          canvas.height = img.height
                    ctx!.drawImage(img, 0, 0)
                    // 将 Canvas 转换为 base64
                    canvas.convertToBlob({type: 'image/png'}).then((blob: Blob) => {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        resolve(reader.result as string)
                      }
                      reader.readAsDataURL(blob)
                    })
        }
        img.onerror = function() {
          resolve('')
        }
        img.src = url
      }
      catch (e) {
        resolve('')
      }
    }
  })
}

interface ImageSize {
  width: number;
  height: number;
}

// 获取图片的原始宽高
export const getImageSize = (imgUrl: string): Promise<ImageSize> => {
  return new Promise(resolve => {
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

      resolve({ width: imgWidth, height: imgHeight })
    }

    img.onerror = () => {
      img.onload = null
      img.onerror = null
    }
  })
}

// 获取图片文件的dataURL
export const getImageDataURL = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })
    reader.readAsDataURL(file)
  })
}
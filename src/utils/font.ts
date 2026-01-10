export const isSystemFont = (font: string) => {
  if (typeof font !== 'string') return false
  const arial = 'Arial'
  if (font.toLowerCase() === arial.toLowerCase()) return true
  const a = 'a'
  const size = 100
  const width = 100
  const height = 100

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  canvas.width = width
  canvas.height = height
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.textBaseline = 'middle'

  const getDotArray = (_font: string) => {
    ctx.clearRect(0, 0, width, height)
    ctx.font = `${size}px ${_font}, ${arial}`
    ctx.fillText(a, width / 2, height / 2)
    const imageData = ctx.getImageData(0, 0, width, height).data
    return [].slice.call(imageData).filter(item => item !== 0)
  }

  return getDotArray(arial).join('') !== getDotArray(font).join('')
}
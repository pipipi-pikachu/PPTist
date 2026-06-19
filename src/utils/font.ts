import { FONTS } from '@/configs/font'

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

const requestedCustomFonts = new Set<string>()

export const loadGoogleFonts = (usedFonts: string[]) => {
  const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2'
  const fontWeightMap: Record<string, number> = {
    thin: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900,
  }
  const presetFontNames = new Set<string>()
  FONTS.forEach(font => {
    if (font.label) presetFontNames.add(font.label.toLowerCase())
    if (font.value) presetFontNames.add(font.value.toLowerCase())
  })

  const fontNames = Array.from(new Set(
    usedFonts.map(font => font.replace(/^['"]|['"]$/g, '').trim()).filter(font => font && !presetFontNames.has(font.toLowerCase()) && !isSystemFont(font))
  ))

  fontNames.forEach(async fontName => {
    const fontKey = fontName.toLowerCase()
    if (requestedCustomFonts.has(fontKey)) return

    requestedCustomFonts.add(fontKey)

    try {
      const getFontFaceBlocks = async (family: string, weight?: number, italic = false) => {
        const fontFamily = encodeURIComponent(family).replace(/%20/g, '+')
        let fontStyle = ''
        if (italic && weight) fontStyle = `:ital,wght@1,${weight}`
        else if (italic) fontStyle = ':ital@1'
        else if (weight) fontStyle = `:wght@${weight}`
        const response = await fetch(`${GOOGLE_FONTS_API}?family=${fontFamily}${fontStyle}`)
        if (!response.ok) return []

        const cssText = await response.text()
        return Array.from(cssText.matchAll(/@font-face\s*{([^}]+)}/g)).map(match => match[1])
      }

      const loadFontFaceBlocks = async (fontFaceBlocks: string[]) => {
        if (!fontFaceBlocks.length) return false

        let loaded = false
        await Promise.all(fontFaceBlocks.map(async fontFaceBlock => {
          const urlMatch = fontFaceBlock.match(/src:\s*url\((['"]?)(https:\/\/fonts\.gstatic\.com\/[^'")]+)\1\)/)
          if (!urlMatch) return

          const descriptors: FontFaceDescriptors = {}
          const styleMatch = fontFaceBlock.match(/font-style:\s*([^;]+);/)
          const weightMatch = fontFaceBlock.match(/font-weight:\s*([^;]+);/)
          const unicodeRangeMatch = fontFaceBlock.match(/unicode-range:\s*([^;]+);/)
          if (styleMatch) descriptors.style = styleMatch[1].trim()
          if (weightMatch) descriptors.weight = weightMatch[1].trim()
          if (unicodeRangeMatch) descriptors.unicodeRange = unicodeRangeMatch[1].trim()

          try {
            const fontFace = await new FontFace(fontName, `url("${urlMatch[2]}")`, descriptors).load()
            document.fonts.add(fontFace)
            loaded = true
          }
          catch { /* Ignore */ }
        }))
        return loaded
      }

      let loaded = await loadFontFaceBlocks(await getFontFaceBlocks(fontName))
      if (loaded) return

      const fontNameParts = fontName.split(/\s+/)
      const suffix = fontNameParts[fontNameParts.length - 1].toLowerCase()
      const italic = suffix === 'italic' || suffix === 'oblique'
      if (italic) fontNameParts.pop()

      const weightSuffix = fontNameParts[fontNameParts.length - 1]?.toLowerCase()
      const weight = fontWeightMap[weightSuffix]
      if (weight) fontNameParts.pop()
      if ((!italic && !weight) || !fontNameParts.length) return

      loaded = await loadFontFaceBlocks(await getFontFaceBlocks(fontNameParts.join(' '), weight, italic))
    }
    catch { /* Ignore */ }
  })
}

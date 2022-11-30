const fs = require('fs')
const ttf2woff2 = require('ttf2woff2')
const path = require('path')
const assetsPath = path.join(__dirname, '../src/assets')
const scssVariablePath = path.join(assetsPath, 'styles/variable.scss')
const fontsPath = path.join(assetsPath, 'fonts')
const scssFontListVar = '$font-list'

// scss 文件中 $font-list 变量替换
const replaceSCSSFile = (names) => {
  fs.readFile(scssVariablePath, 'utf-8', (errs, content) => {
    if (errs) {
      console.error(errs)
      process.exit(1)
    }
    const reg = new RegExp(`(\\${scssFontListVar}:\\s*)(.*)(;.*)`, 'g')
    const newContent = content.replace(reg, `$1${names}$3`)
    fs.writeFile(scssVariablePath, newContent, (errs) => {
      if (errs) {
        console.error(errs)
        process.exit(1)
      }
      console.log('替换 SCSS 字体列表成功！')
    })
  })
}

// ttf 转 woff2
fs.readdir(fontsPath, { withFileTypes: true }, (errs, files) => {
  if (errs) {
    console.error(errs)
    process.exit(1)
  }
  const fontList = []
  files
    .filter(({ name }) => name.endsWith('.ttf'))
    .forEach(({ name }) => {
      console.log(`${name} 正在转换为 woff2 格式...`)
      const woff2FontExists = files.find((item) => item.name.endsWith('.woff2'))
      const replacedName = name.replace('.ttf', '.woff2')
      fontList.push(name.replace('.ttf', ''))
      if (woff2FontExists) {
        console.log(`${replacedName} 已存在，不再转换`)
        return
      }

      const input = fs.readFileSync(path.join(fontsPath, name))
      fs.writeFileSync(
        path.join(fontsPath, replacedName),
        ttf2woff2(input)
      )
      console.log(`${name} 转换 woff2 成功！`)
    })
  const names = fontList.reduce((result, name, i) => {
    if (i === 0) return `'${name}'`
    return `${result}, '${name}'`
  }, '')
  replaceSCSSFile(names)
})

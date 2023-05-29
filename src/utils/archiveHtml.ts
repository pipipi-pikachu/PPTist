// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip')
import {saveAs} from 'file-saver'

const createIframe = () => {
  const iframe = document.createElement('iframe')
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.position = 'absolute'
  iframe.style.right = '0'
  iframe.style.top = '0'
  iframe.style.border = '0'

  document.body.appendChild(iframe)

  return iframe
}

const writeContent = (doc: Document, archiveNode: HTMLElement) => {
  const docType = '<!DOCTYPE html>'

  let style = ''
  const styleSheets = document.styleSheets
  if (styleSheets) {
    for (const styleSheet of styleSheets) {
      if (!styleSheet.cssRules) continue

      for (const rule of styleSheet.cssRules) {
        style += rule.cssText
      }
    }
  }

  const head = `
    <head>
      <style type="text/css">
        ${style}
      </style>
    </head>
  `
  const body = '<body>' + archiveNode.innerHTML + '</body>'

  doc.open()
  doc.write(`
    ${docType}
    <html>
      ${head}
      ${body}
    </html>
  `)
  doc.close()
}

export const archiveHtml = (archiveNode: HTMLElement) => {
  const zip = new JSZip()
  const slides = archiveNode.querySelectorAll('.thumbnail-slide')

  slides.forEach((slide, index) => {
    const iframe = createIframe()
    const iframeContentWindow = iframe.contentWindow

    if (!iframe.contentDocument || !iframeContentWindow) return
    writeContent(iframe.contentDocument, slide as HTMLElement)
    iframe.addEventListener('load', () => {
      iframeContentWindow.focus()
    })
    zip.file('slide-' + ++index + '.html', iframe.contentWindow.document.documentElement.innerHTML)
  })

  zip.generateAsync({type: 'blob'})
    .then(function(content: string | Blob) {
      saveAs(content, 'slides.zip')
    })
}
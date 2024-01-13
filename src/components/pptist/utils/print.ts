interface PageSize {
  width: number
  height: number
  margin: number
}

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

const writeContent = (doc: Document, printNode: HTMLElement, size: PageSize) => {
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

  const { width, height, margin } = size
  const head = `
    <head>
      <style type="text/css">
        ${style} 
        html, body {
          height: auto;
          overflow: auto;
        }
        @media print {
          @page {
            size: ${width + 2 * margin}px ${height + 2 * margin}px;
            margin: ${margin}px;
          }
        }
      </style>
    </head>
  `
  const body = '<body>' + printNode.innerHTML + '</body>'

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

export const print = (printNode: HTMLElement, size: PageSize) => {
  const iframe = createIframe()
  const iframeContentWindow = iframe.contentWindow

  if (!iframe.contentDocument || !iframeContentWindow) return
  writeContent(iframe.contentDocument, printNode, size)

  const handleLoadIframe = () => {
    iframeContentWindow.focus()
    iframeContentWindow.print()
  }

  const handleAfterprint = () => {
    iframe.removeEventListener('load', handleLoadIframe)
    iframeContentWindow.removeEventListener('afterprint', handleAfterprint)
    document.body.removeChild(iframe)
  }

  iframe.addEventListener('load', handleLoadIframe)
  iframeContentWindow.addEventListener('afterprint', handleAfterprint)
}
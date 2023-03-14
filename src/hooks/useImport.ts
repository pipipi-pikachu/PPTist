import { storeToRefs } from 'pinia'
import { parse } from 'pptxtojson'
import { nanoid } from 'nanoid'
import { Slide, TableCellStyle, TableCell, ChartType, ChartOptions, SlideBackground, PPTShapeElement } from '@/types/slides'
import { useSlidesStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

import { message } from 'ant-design-vue'

export default () => {
  const slidesStore = useSlidesStore()
  const { theme } = storeToRefs(useSlidesStore())

  const { addSlidesFromData } = useAddSlidesOrElements()

  // 导入pptist文件
  const importSpecificFile = (files: FileList, cover = false) => {
    const file = files[0]

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      try {
        const slides = JSON.parse(decrypt(reader.result as string))
        if (cover) slidesStore.setSlides(slides)
        else addSlidesFromData(slides)
      }
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    reader.readAsText(file)
  }

  // 导入PPTX文件
  const importPPTXFile = (files: FileList) => {
    const file = files[0]
    if (!file) return

    const shapeList: ShapePoolItem[] = []
    for (const item of SHAPE_LIST) {
      shapeList.push(...item.children)
    }
    
    const reader = new FileReader()
    reader.onload = async e => {
      const json = await parse(e.target!.result as ArrayBuffer)
      const slides: Slide[] = []
      for (const item of json.slides) {
        const { type, value } = item.fill
        let background: SlideBackground
        if (type === 'image') {
          background = {
            type: 'image',
            image: value.picBase64,
            imageSize: 'cover',
          }
        }
        else {
          background = {
            type: 'solid',
            color: value,
          }
        }

        const slide: Slide = {
          id: nanoid(10),
          elements: [],
          background,
        }
        for (const el of item.elements) {
          if (el.type === 'text') {
            slide.elements.push({
              type: 'text',
              id: nanoid(10),
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
              rotate: el.rotate,
              defaultFontName: theme.value.fontName,
              defaultColor: theme.value.fontColor,
              content: el.content,
              lineHeight: 1,
              outline: {
                color: el.borderColor,
                width: el.borderWidth,
                style: el.borderType,
              },
              fill: el.fillColor,
            })
          }
          else if (el.type === 'image') {
            slide.elements.push({
              type: 'image',
              id: nanoid(10),
              src: el.src,
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
              fixedRatio: true,
              rotate: el.rotate,
            })
          }
          else if (el.type === 'shape') {
            const shape = shapeList.find(item => item.pptxShapeType === el.shapType)
            
            const element: PPTShapeElement = {
              type: 'shape',
              id: nanoid(10),
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
              viewBox: [200, 200],
              path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
              fill: el.fillColor,
              fixedRatio: false,
              rotate: el.rotate,
              outline: {
                color: el.borderColor,
                width: el.borderWidth,
                style: el.borderType,
              },
              text: {
                content: el.content,
                defaultFontName: theme.value.fontName,
                defaultColor: theme.value.fontColor,
                align: 'middle',
              }
            }

            if (shape) {
              element.path = shape.path
              element.viewBox = shape.viewBox

              if (shape.pathFormula) {
                element.pathFormula = shape.pathFormula
                element.viewBox = [el.width, el.height]

                const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
                if ('editable' in pathFormula) {
                  element.path = pathFormula.formula(el.width, el.height, pathFormula.defaultValue)
                  element.keypoint = pathFormula.defaultValue
                }
                else element.path = pathFormula.formula(el.width, el.height)
              }
            }

            slide.elements.push(element)
          }
          else if (el.type === 'table') {
            const row = el.data.length
            const col = el.data[0].length

            const style: TableCellStyle = {
              fontname: theme.value.fontName,
              color: theme.value.fontColor,
            }
            const data: TableCell[][] = []
            for (let i = 0; i < row; i++) {
              const rowCells: TableCell[] = []
              for (let j = 0; j < col; j++) {
                const cellData = el.data[i][j]
                rowCells.push({
                  id: nanoid(10),
                  colspan: 1,
                  rowspan: cellData.rowSpan || 1,
                  text: cellData.text,
                  style,
                })
              }
              data.push(rowCells)
            }

            const colWidths: number[] = new Array(col).fill(1 / col)

            slide.elements.push({
              type: 'table',
              id: nanoid(10),
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
              colWidths,
              rotate: 0,
              data,
              outline: {
                width: 2,
                style: 'solid',
                color: '#eeece1',
              },
              theme: {
                color: theme.value.themeColor,
                rowHeader: true,
                rowFooter: false,
                colHeader: false,
                colFooter: false,
              },
              cellMinHeight: 36,
            })
          }
          else if (el.type === 'chart') {
            const labels = Object.values(el.data[0].xlabels)
            const legends = el.data.map(item => item.key)
            const series = el.data.map(item => item.values.map(v => v.y))
            let options: ChartOptions = {}

            let chartType: ChartType = 'bar'
            if (el.chartType === 'barChart') {
              chartType = 'bar'
            }
            if (el.chartType === 'stackedBarChart') {
              chartType = 'bar'
              options = { stackBars: true }
            }
            else if (el.chartType === 'lineChart') {
              chartType = 'line'
            }
            else if (el.chartType === 'areaChart') {
              chartType = 'line'
              options = { showArea: true }
            }
            else if (el.chartType === 'scatterChart') {
              chartType = 'line'
              options = { showLine: false }
            }
            else if (el.chartType === 'pieChart' || el.chartType === 'pie3DChart') {
              chartType = 'pie'
            }

            slide.elements.push({
              type: 'chart',
              id: nanoid(10),
              chartType: chartType,
              width: el.width,
              height: el.height,
              left: el.left,
              top: el.top,
              rotate: 0,
              themeColor: [theme.value.themeColor],
              gridColor: theme.value.fontColor,
              data: {
                labels,
                legends,
                series,
              },
              options,
            })
          }
          // else if (el.type === 'group') {}
        }
        slides.push(slide)
      }
      addSlidesFromData(slides)
    }
    reader.readAsArrayBuffer(file)
  }

  return {
    importSpecificFile,
    importPPTXFile,
  }
}
import type { ComposeOption } from 'echarts/core'
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts'
import type { ChartData, ChartType } from '@/types/slides'

type EChartOption = ComposeOption<BarSeriesOption | LineSeriesOption | PieSeriesOption | ScatterSeriesOption | RadarSeriesOption>

const RADAR_DEFAULT_SPLIT_NUMBER = 5
const RADAR_SPLIT_NUMBERS = [4, 5, 6]

const getRadarNiceMax = (max: number, splitNumber: number) => {
  if (max <= 0) return 0

  const rawInterval = max / splitNumber
  const exponent = Math.floor(Math.log10(rawInterval))
  const exp10 = Math.pow(10, exponent)
  const ratio = rawInterval / exp10

  let niceRatio = 10
  if (ratio <= 1) niceRatio = 1
  else if (ratio <= 2) niceRatio = 2
  else if (ratio <= 3) niceRatio = 3
  else if (ratio <= 5) niceRatio = 5

  return niceRatio * exp10 * splitNumber
}

const getRadarScale = (max: number) => {
  if (max <= 0) return { max: 0, splitNumber: RADAR_DEFAULT_SPLIT_NUMBER }

  return RADAR_SPLIT_NUMBERS
    .map(splitNumber => ({ max: getRadarNiceMax(max, splitNumber), splitNumber }))
    .reduce((best, item) => {
      const bestOverflow = best.max - max
      const overflow = item.max - max
      if (overflow < bestOverflow) return item

      const bestSplitNumberOffset = Math.abs(best.splitNumber - RADAR_DEFAULT_SPLIT_NUMBER)
      const splitNumberOffset = Math.abs(item.splitNumber - RADAR_DEFAULT_SPLIT_NUMBER)
      if (overflow === bestOverflow && splitNumberOffset < bestSplitNumberOffset) return item

      return best
    })
}

export interface ChartOptionPayload {
  type: ChartType
  data: ChartData
  themeColors: string[]
  textColor?: string
  lineColor?: string
  lineSmooth?: boolean
  stack?: boolean
}

export const getChartOption = ({
  type,
  data,
  themeColors,
  textColor,
  lineColor,
  lineSmooth,
  stack,
}: ChartOptionPayload): EChartOption | null => {
  const textStyle = textColor ? {
    color: textColor
  } : {}

  const axisLine = textColor ? {
    lineStyle: {
      color: textColor,
    }
  } : undefined

  const axisLabel = textColor ? {
    color: textColor,
  } : undefined

  const splitLine = lineColor ? {
    lineStyle: {
      color: lineColor,
    }
  } : {}

  const legend = data.series.length > 1 ? {
    top: 'bottom',
    textStyle,
  } : undefined

  if (type === 'bar') {
    return {
      color: themeColors,
      textStyle,
      legend,
      xAxis: {
        type: 'category',
        data: data.labels,
        axisLine,
        axisLabel,
      },
      yAxis: {
        type: 'value',
        axisLine,
        axisLabel,
        splitLine,
      },
      series: data.series.map((item, index) => {
        const seriesItem: BarSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'bar',
          label: {
            show: true,
          },
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
          },
        }
        if (stack) seriesItem.stack = 'A'
        return seriesItem
      }),
    }
  }
  if (type === 'column') {
    return {
      color: themeColors,
      textStyle,
      legend,
      yAxis: {
        type: 'category',
        data: data.labels,
        axisLine,
        axisLabel,
      },
      xAxis: {
        type: 'value',
        axisLine,
        axisLabel,
        splitLine,
      },
      series: data.series.map((item, index) => {
        const seriesItem: BarSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'bar',
          label: {
            show: true,
          },
          itemStyle: {
            borderRadius: [0, 2, 2, 0],
          },
        }
        if (stack) seriesItem.stack = 'A'
        return seriesItem
      }),
    }
  }
  if (type === 'line') {
    return {
      color: themeColors,
      textStyle,
      legend,
      xAxis: {
        type: 'category',
        data: data.labels,
        axisLine,
        axisLabel,
      },
      yAxis: {
        type: 'value',
        axisLine,
        axisLabel,
        splitLine,
      },
      series: data.series.map((item, index) => {
        const seriesItem: LineSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'line',
          smooth: lineSmooth,
          label: {
            show: true,
          },
        }
        if (stack) seriesItem.stack = 'A'
        return seriesItem
      }),
    }
  }
  if (type === 'pie') {
    return {
      color: themeColors,
      textStyle,
      legend: {
        top: 'bottom',
        textStyle,
      },
      series: [
        {
          data: data.series[0].map((item, index) => ({ value: item, name: data.labels[index] })),
          label: textColor ? {
            color: textColor,
          } : {},
          type: 'pie',
          radius: '70%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
          },
        }
      ],
    }
  }
  if (type === 'ring') {
    return {
      color: themeColors,
      textStyle,
      legend: {
        top: 'bottom',
        textStyle,
      },
      series: [
        {
          data: data.series[0].map((item, index) => ({ value: item, name: data.labels[index] })),
          label: textColor ? {
            color: textColor,
          } : {},
          type: 'pie',
          radius: ['40%', '70%'],
          padAngle: 1,
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
          },
        }
      ],
    }
  }
  if (type === 'area') {
    return {
      color: themeColors,
      textStyle,
      legend,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.labels,
        axisLine,
        axisLabel,
      },
      yAxis: {
        type: 'value',
        axisLine,
        axisLabel,
        splitLine,
      },
      series: data.series.map((item, index) => {
        const seriesItem: LineSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'line',
          areaStyle: {},
          label: {
            show: true,
          },
        }
        if (stack) seriesItem.stack = 'A'
        return seriesItem
      }),
    }
  }
  if (type === 'radar') {
    const values: number[] = []
    for (const item of data.series) {
      values.push(...item)
    }
    const { max, splitNumber } = getRadarScale(Math.max(...values))

    return {
      color: themeColors,
      textStyle,
      legend,
      radar: {
        splitNumber,
        indicator: data.labels.map(item => ({ name: item, max })),
        splitLine,
        axisLine: lineColor ? {
          lineStyle: {
            color: lineColor,
          }
        } : undefined,
      },
      series: [
        {
          data: data.series.map((item, index) => ({ value: item, name: data.legends[index] })),
          type: 'radar',
        },
      ],
    }
  }
  if (type === 'scatter') {
    const xData = data.series[0]
    const ySeries = data.series.length > 1 ? data.series.slice(1) : [xData]
    const formatedSeries: ScatterSeriesOption[] = ySeries.map((item, index) => ({
      symbolSize: 12,
      data: xData.map((x, dataIndex) => [x, item[dataIndex]]),
      name: data.legends[index + 1],
      type: 'scatter',
    }))

    return {
      color: themeColors,
      textStyle,
      legend: data.series.length > 2 ? {
        top: 'bottom',
        textStyle,
      } : undefined,
      xAxis: {
        axisLine,
        axisLabel,
        splitLine,
      },
      yAxis: {
        axisLine,
        axisLabel,
        splitLine,
      },
      series: formatedSeries,
    }
  }

  return null
}

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

export interface ChartOptionPayload {
  type: ChartType
  data: ChartData
  themeColors: string[]
  textColor?: string
  lineSmooth?: boolean
  stack?: boolean
}

export const getChartOption = ({
  type,
  data,
  themeColors,
  textColor,
  lineSmooth,
  stack,
}: ChartOptionPayload): EChartOption | null => {
  if (type === 'bar') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: data.series.length > 1 ? {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
      } : undefined,
      xAxis: {
        type: 'category',
        data: data.labels,
      },
      yAxis: {
        type: 'value',
      },
      series: data.series.map((item, index) => {
        const seriesItem: BarSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'bar',
          label: {
            show: true,
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
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: data.series.length > 1 ? {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
      } : undefined,
      yAxis: {
        type: 'category',
        data: data.labels,
      },
      xAxis: {
        type: 'value',
      },
      series: data.series.map((item, index) => {
        const seriesItem: BarSeriesOption = {
          data: item,
          name: data.legends[index],
          type: 'bar',
          label: {
            show: true,
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
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: data.series.length > 1 ? {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
      } : undefined,
      xAxis: {
        type: 'category',
        data: data.labels,
      },
      yAxis: {
        type: 'value',
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
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
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
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
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
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: data.series.length > 1 ? {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
      } : undefined,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.labels,
      },
      yAxis: {
        type: 'value',
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
    // indicator 中不设置max时显示异常，设置max后控制台警告，无解，等EChart官方修复此bug
    // const values: number[] = []
    // for (const item of data.series) {
    //   values.push(...item)
    // }
    // const max = Math.max(...values)

    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      legend: data.series.length > 1 ? {
        top: 'bottom',
        textStyle: textColor ? {
          color: textColor,
        } : {},
      } : undefined,
      radar: {
        indicator: data.labels.map(item => ({ name: item })),
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
    const formatedData = []
    for (let i = 0; i < data.series[0].length; i++) {
      const x = data.series[0][i]
      const y = data.series[1] ? data.series[1][i] : x
      formatedData.push([x, y])
    }

    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      xAxis: {},
      yAxis: {},
      series: [
        {
          symbolSize: 12,
          data: formatedData,
          type: 'scatter',
        }
      ],
    }
  }

  return null
}
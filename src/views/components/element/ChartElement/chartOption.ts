import * as echarts from 'echarts'
import type { ChartData, ChartType } from '@/types/slides'

export interface ChartOptionPayload {
  type: ChartType
  data: ChartData
  themeColors: string[]
  textColor?: string
}

export const getChartOption = ({
  type,
  data,
  themeColors,
  textColor,
}: ChartOptionPayload): echarts.EChartsOption | null => {
  if(type === 'bar') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
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
      series: data.series.map((item, index) => ({
        data: item,
        name: data.legends[index],
        type: 'bar',
        label: {
          show: true,
        },
      })),
    }
  }
  if(type === 'column') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
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
      series: data.series.map((item, index) => ({
        data: item,
        name: data.legends[index],
        type: 'bar',
        label: {
          show: true,
        },
      })),
    }
  }
  if(type === 'line') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
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
      series: data.series.map((item, index) => ({
        data: item,
        name: data.legends[index],
        type: 'line',
        label: {
          show: true,
        },
      })),
    }
  }
  if(type === 'pie') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
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
  if(type === 'ring') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
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
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
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
  if(type === 'area') {
    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
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
      series: data.series.map((item, index) => ({
        data: item,
        name: data.legends[index],
        type: 'line',
        areaStyle: {},
        label: {
          show: true,
        },
      })),
    }
  }
  if(type === 'scatter') {
    const formatedData = []
    for(let i = 0; i < data.series[0].length; i++) {
      const x = data.series[0][i]
      const y = data.series[1] ? data.series[1][i] : x
      formatedData.push([x, y])
    }

    return {
      color: themeColors,
      textStyle: textColor ? {
        color: textColor,
      } : {},
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
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
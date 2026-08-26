export const SCATTER_HIDE_SYMBOL_POINT_THRESHOLD = 48

export type ScatterRenderMode = 'connected-line' | 'scatter-points'

export function resolveScatterRenderMode(pointCount: number): ScatterRenderMode {
  if (!Number.isFinite(pointCount) || pointCount < 1) return 'scatter-points'
  if (pointCount >= SCATTER_HIDE_SYMBOL_POINT_THRESHOLD) return 'connected-line'
  return 'scatter-points'
}

export function sanitizeImportedChartColors(
  colors: Array<string | null | undefined> | undefined,
  fallback: string[],
): string[] {
  const cleaned = (colors ?? []).filter((color): color is string => typeof color === 'string' && color.trim().length > 0)
  return cleaned.length ? cleaned : fallback
}

export function toSortedXyPoints(xData: number[], yData: number[]): [number, number][] {
  const count = Math.min(xData.length, yData.length)
  const points: [number, number][] = []
  for (let index = 0; index < count; index++) {
    const x = xData[index]
    const y = yData[index]
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    points.push([x, y])
  }
  points.sort((left, right) => left[0] - right[0] || left[1] - right[1])
  return points
}

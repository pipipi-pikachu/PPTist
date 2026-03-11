import { describe, it, expect } from 'vitest'
import {
  getRectRotatedRange,
  getRectRotatedOffset,
  getElementRange,
  getElementListRange,
  getLineElementLength,
} from '../utils/element'

describe('element.ts', () => {
  describe('getRectRotatedRange', () => {
    it('should return correct range for non-rotated element', () => {
      const result = getRectRotatedRange({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
      })

      expect(result.xRange[0]).toBeCloseTo(0, 5)
      expect(result.xRange[1]).toBe(100)
      expect(result.yRange[0]).toBeCloseTo(0, 5)
      expect(result.yRange[1]).toBe(50)
    })

    it('should handle 90 degree rotation', () => {
      const result = getRectRotatedRange({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 90,
      })

      // After 90° rotation, width and height swap
      expect(result.xRange[1] - result.xRange[0]).toBeCloseTo(50, 1)
      expect(result.yRange[1] - result.yRange[0]).toBeCloseTo(100, 1)
    })

    it('should handle 45 degree rotation', () => {
      const result = getRectRotatedRange({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        rotate: 45,
      })

      // Diagonal of a 100x100 square is ~141.42
      const xRange = result.xRange[1] - result.xRange[0]
      const yRange = result.yRange[1] - result.yRange[0]
      
      expect(xRange).toBeCloseTo(141.42, 1)
      expect(yRange).toBeCloseTo(141.42, 1)
    })
  })

  describe('getRectRotatedOffset', () => {
    it('should return zero offset for non-rotated element', () => {
      const result = getRectRotatedOffset({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
      })

      expect(result.offsetX).toBe(0)
      expect(result.offsetY).toBe(0)
    })

    it('should return non-zero offset for rotated element', () => {
      const result = getRectRotatedOffset({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 45,
      })

      expect(result.offsetX).not.toBe(0)
      expect(result.offsetY).not.toBe(0)
    })
  })

  describe('getElementRange', () => {
    it('should handle normal rectangle element', () => {
      const element = {
        id: 'test',
        type: 'text',
        left: 10,
        top: 20,
        width: 100,
        height: 50,
      }

      const result = getElementRange(element as any)

      expect(result.minX).toBe(10)
      expect(result.maxX).toBe(110)
      expect(result.minY).toBe(20)
      expect(result.maxY).toBe(70)
    })

    it('should handle rotated element', () => {
      const element = {
        id: 'test',
        type: 'text',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 45,
      }

      const result = getElementRange(element as any)

      expect(result.minX).toBeLessThan(0)
      expect(result.maxX).toBeGreaterThan(100)
      expect(result.minY).toBeLessThan(0)
      expect(result.maxY).toBeGreaterThan(50)
    })

    it('should handle line element', () => {
      const element = {
        id: 'test',
        type: 'line',
        left: 0,
        top: 0,
        start: [0, 0],
        end: [100, 50],
      }

      const result = getElementRange(element as any)

      expect(result.minX).toBe(0)
      expect(result.maxX).toBe(100)
      expect(result.minY).toBe(0)
      expect(result.maxY).toBe(50)
    })
  })

  describe('getElementListRange', () => {
    it('should return correct range for multiple elements', () => {
      const elements = [
        { id: '1', type: 'text', left: 10, top: 20, width: 50, height: 30 },
        { id: '2', type: 'text', left: 100, top: 50, width: 40, height: 60 },
      ] as any[]

      const result = getElementListRange(elements)

      expect(result.minX).toBe(10)
      expect(result.maxX).toBe(140)
      expect(result.minY).toBe(20)
      expect(result.maxY).toBe(110)
    })

    it('should handle empty array', () => {
      const result = getElementListRange([])

      expect(result.minX).toBe(Infinity)
      expect(result.maxX).toBe(-Infinity)
      expect(result.minY).toBe(Infinity)
      expect(result.maxY).toBe(-Infinity)
    })
  })

  describe('getLineElementLength', () => {
    it('should calculate horizontal line length correctly', () => {
      const element = {
        id: 'test',
        type: 'line',
        left: 0,
        top: 0,
        start: [0, 0],
        end: [100, 0],
      }

      const result = getLineElementLength(element as any)

      expect(result).toBe(100)
    })

    it('should calculate vertical line length correctly', () => {
      const element = {
        id: 'test',
        type: 'line',
        left: 0,
        top: 0,
        start: [0, 0],
        end: [0, 50],
      }

      const result = getLineElementLength(element as any)

      expect(result).toBe(50)
    })

    it('should calculate diagonal line length correctly', () => {
      const element = {
        id: 'test',
        type: 'line',
        left: 0,
        top: 0,
        start: [0, 0],
        end: [30, 40],
      }

      const result = getLineElementLength(element as any)

      expect(result).toBe(50) // 3-4-5 triangle
    })
  })
})

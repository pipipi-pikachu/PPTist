import { describe, it, expect } from 'vitest'
import { isSVGString, svg2File } from './image'

describe('image.ts', () => {
  describe('isSVGString', () => {
    it('should return true for valid SVG string', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'
      expect(isSVGString(svg)).toBe(true)
    })

    it('should return false for non-SVG string', () => {
      expect(isSVGString('<div>Hello</div>')).toBe(false)
      expect(isSVGString('plain text')).toBe(false)
    })

    it('should return false for invalid SVG', () => {
      expect(isSVGString('<svg><rect>')).toBe(false)
    })

    it('should return true for SVG with namespace', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>'
      expect(isSVGString(svg)).toBe(true)
    })
  })

  describe('svg2File', () => {
    it('should convert SVG string to File object', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
      const file = svg2File(svg)

      expect(file).toBeInstanceOf(File)
      expect(file.type).toBe('image/svg+xml')
      expect(file.name).toMatch(/^\d+\.svg$/)
    })

    it('should create File with correct content', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'
      const file = svg2File(svg)

      // Verify File was created with correct properties
      expect(file.name).toMatch(/\d+\.svg/)
      expect(file.type).toBe('image/svg+xml')
      expect(file.size).toBe(svg.length)
    })
  })
})

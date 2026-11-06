// 可直接用 Node 22+ 运行：node --test src/utils/__tests__/entry.test.ts
// （本文件被 tsconfig.app.json 的 src/**/__tests__/* 排除，不参与 vue-tsc 类型检查和打包）
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isMcpHomeEntry } from '../entry.ts'

test('根路径无参数显示 MCP 说明页', () => {
  assert.equal(isMcpHomeEntry(''), true)
  assert.equal(isMcpHomeEntry('?'), true)
  assert.equal(isMcpHomeEntry('?foo=bar'), true)
})

test('带 doc 参数仍走文档入口', () => {
  assert.equal(isMcpHomeEntry('?doc=abc'), false)
  assert.equal(isMcpHomeEntry('?doc=abc&mode=view'), false)
})

test('带 mode 参数保持原有行为', () => {
  assert.equal(isMcpHomeEntry('?mode=export'), false)
  assert.equal(isMcpHomeEntry('?mode=view'), false)
  assert.equal(isMcpHomeEntry('?mode=audience'), false)
})

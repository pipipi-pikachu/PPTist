import { describe, expect, it } from 'vitest'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { assertFetchableUrl, fetchRemoteAsset, isBlockedIp } from '../src/assets/fetch'
import { loadConfig } from '../src/config'

const config = loadConfig({ DATA_DIR: mkdtempSync(join(tmpdir(), 'pptist-ssrf-')) } as NodeJS.ProcessEnv)

describe('SSRF 防护', () => {
  it('内网 / 保留地址全部被判定为屏蔽', () => {
    for (const ip of [
      '127.0.0.1', '127.1.2.3',
      '10.0.0.1', '10.255.255.255',
      '172.16.0.1', '172.31.255.1',
      '192.168.1.1',
      '169.254.1.1',
      '100.64.0.1',
      '0.0.0.0',
      '224.0.0.1', // 组播
      '::1',
      '::',
      'fc00::1', 'fd12::1',
      'fe80::1',
      '::ffff:127.0.0.1', '::ffff:10.1.2.3', // IPv4 映射
    ]) {
      expect(isBlockedIp(ip), ip).toBe(true)
    }
  })

  it('公网地址放行', () => {
    for (const ip of ['8.8.8.8', '1.1.1.1', '172.32.0.1', '11.0.0.1', '2606:4700:4700::1111']) {
      expect(isBlockedIp(ip), ip).toBe(false)
    }
  })

  it('指向内网的 URL 在请求前就被拒绝', () => {
    for (const url of ['http://127.0.0.1/', 'http://10.0.0.1/a.png', 'http://[::1]/', 'http://192.168.0.1/x', 'https://169.254.169.254/latest/meta-data']) {
      expect(() => assertFetchableUrl(url), url).toThrowError()
    }
  })

  it('非 http(s) 协议被拒绝', () => {
    for (const url of ['file:///etc/passwd', 'ftp://example.com/x', 'gopher://x']) {
      expect(() => assertFetchableUrl(url), url).toThrowError()
    }
  })

  it('fetchRemoteAsset 对内网地址直接拒绝（不发起网络连接）', async () => {
    await expect(fetchRemoteAsset('http://127.0.0.1/', config)).rejects.toThrowError()
    await expect(fetchRemoteAsset('http://10.0.0.1/', config)).rejects.toThrowError()
    await expect(fetchRemoteAsset('http://[::1]/', config)).rejects.toThrowError()
  })
})

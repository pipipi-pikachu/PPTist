import { buildApp } from './app'
import { loadConfig } from './config'
import { openDb } from './db'
import { cleanupExpiredExports } from './render/jobs'

const config = loadConfig()
const db = openDb(config.dataDir)
const app = await buildApp(config, db)

// 每小时清理超过 24h 的导出文件与对应 job 记录
const cleanupTimer = setInterval(() => {
  try {
    const { files, jobs } = cleanupExpiredExports(db, config)
    if (files || jobs) app.log.info(`清理过期导出: ${files} 个文件, ${jobs} 条任务记录`)
  }
  catch (err) {
    app.log.error(err, '清理过期导出失败')
  }
}, 60 * 60 * 1000)
cleanupTimer.unref()

let closing = false
const shutdown = () => {
  if (closing) return
  closing = true
  clearInterval(cleanupTimer)
  void app.close().then(() => {
    db.close()
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

try {
  await app.listen({ port: config.port, host: config.host })
}
catch (err) {
  app.log.error(err)
  process.exit(1)
}

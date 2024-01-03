/**
 * build 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
 * chore 其他修改, 比如改变构建流程、或者增加依赖库、工具等
 * docs 文档修改
 * feat 新特性、新功能
 * fix 修改bug
 * perf 优化相关，比如提升性能、体验
 * refactor 代码重构
 * revert 回滚到上一个版本
 * style 代码格式修改
 * test 测试用例修改
 */
/* eslint-env node */
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
# 代码注释系统化推进计划

## 目标

为当前 PPTist 项目逐步补齐高质量代码注释，优先解释业务规则、数据结构、边界条件、浏览器兼容逻辑和潜在坑点，确保后续维护者能够更快理解编辑器、放映器、移动端、导入导出和富文本等核心模块。

## 注释规范

1. 所有新增或补充注释均使用当前文件所属语言的规范格式，例如 TypeScript 使用 JSDoc，Vue `<script setup>` 内的函数也使用 JSDoc。
2. 函数、类、复杂类型、核心常量必须说明用途、参数、返回值、异常、注意事项和边界条件。
3. 对核心逻辑行补充内联注释，解释为什么这样写，以及它和业务规则、浏览器行为或数据结构之间的关系。
4. 保持代码逻辑不变，首轮工作只做注释补充，不主动重构、不调整格式化规则、不改变运行行为。
5. 已生成文件、依赖目录、锁文件、静态图片和字体文件不纳入注释范围。

## 分阶段范围

### 第一阶段：低风险基础设施

- `src/utils/*.ts`
- `src/services/*.ts`
- `src/directive/*.ts`
- `src/configs/*.ts`

说明：这些文件体量较小、调用面清晰，适合先建立注释风格，并尽早覆盖容易被复用的工具能力。

### 第二阶段：状态与类型模型

- `src/store/*.ts`
- `src/types/*.ts`
- `src/global.d.ts`

说明：状态和类型是理解 PPT 数据模型的入口，需要重点解释字段语义、编辑器状态流转、边界值和持久化含义。

### 第三阶段：核心 Hooks

- `src/hooks/*.ts`
- `src/views/Editor/Canvas/hooks/*.ts`
- `src/views/Screen/hooks/*.ts`
- `src/views/components/element/hooks/*.ts`

说明：Hooks 承载大量业务操作，如元素增删改、对齐、组合、拖拽、导入导出、历史快照和放映控制，应按功能域逐个推进。

### 第四阶段：核心业务组件

- `src/views/Editor/**/*.vue`
- `src/views/Screen/**/*.vue`
- `src/views/Mobile/**/*.vue`
- `src/views/components/**/*.vue`

说明：组件注释重点放在交互流程、Props/Emits、复杂 computed、watch、副作用和模板中难以一眼看懂的状态映射。

### 第五阶段：通用 UI 组件

- `src/components/**/*.vue`

说明：通用组件需要解释对外 API、插槽约定、事件语义、可访问性行为、布局计算和浏览器兼容处理。

### 第六阶段：富文本、HTML、导入导出与媒体

- `src/utils/prosemirror/**/*.ts`
- `src/utils/htmlParser/**/*.ts`
- `src/hooks/useImport.ts`
- `src/hooks/useExport.ts`
- `src/views/components/element/**/*`

说明：这些模块复杂度最高，涉及外部库、格式转换、PPTX 数据结构、媒体处理和富文本 AST，放到注释风格稳定后推进。

## 每批推进流程

1. 选择 3 到 8 个相关文件作为一批，避免单批改动过大。
2. 阅读文件上下文和调用位置，确认注释描述准确。
3. 只补充注释，不改变代码逻辑。
4. 运行 `npm run type-check` 或更小范围的可用验证命令。
5. 记录本批完成范围、验证结果和下一批建议。

## 当前试点批次

- `src/services/fetch.ts`
- `src/utils/common.ts`
- `src/utils/crypto.ts`
- `src/utils/fullscreen.ts`

选择原因：文件较小，业务语义明确，适合作为后续注释细节程度和 JSDoc 格式的参考样板。

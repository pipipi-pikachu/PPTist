# PPTist Server

PPTist 的服务端：多用户（每人一个 Key）文档服务，供 Agent 和网页端调用。

- 数据全部放在 `DATA_DIR`：SQLite（`app.db`，WAL）、`assets/`、`secret`（首次启动自动生成，权限 0600）
- 三类凭证：用户 Key（`pk_…`，Agent 用）、文档编辑令牌、文档只读令牌（网页端用，`X-Doc-Token` 请求头）
- 文档数据 = PPTist `exportJSON` 格式 `{ title, theme, viewportSize, viewportRatio, slides }`，类型直接复用 `src/types/slides.ts`

## 本地开发

```bash
npm install
npm run dev          # tsx watch，默认 0.0.0.0:3100
curl http://127.0.0.1:3100/api/health
```

配合前端：`npm run dev`（根目录，vite 把 `/api`、`/assets` 代理到 3100）。

```bash
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run build        # esbuild 打包 index.ts + admin.ts 到 dist/
npm start            # node dist/index.js
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` / `HOST` | `3100` / `0.0.0.0` | 监听地址 |
| `DATA_DIR` | `./data` | 数据库、资产、导出文件、密钥 |
| `PUBLIC_BASE_URL` | `http://localhost:5173` | 拼 editUrl/viewUrl，生产填 `https://域名` |
| `RENDER_BASE_URL` | `http://127.0.0.1:$PORT` | 无头浏览器地址（M4）；容器内自指 `http://127.0.0.1:3100` |
| `STATIC_DIR` | `./dist` | 前端构建产物目录；目录里有 `index.html` 才启用静态托管（开发模式自动跳过） |
| `DEFAULT_QUOTA_DOCS` / `DEFAULT_QUOTA_DOC_MB` / `DEFAULT_QUOTA_EXPORTS_PER_DAY` | 100 / 10 / 200 | 默认配额 |
| `RATE_LIMIT_PER_MIN` | 120 | 每 Key/令牌每分钟限流 |
| `MAX_ASSET_MB` | 10 | 单张图片上限 |
| `EXPORT_CONCURRENCY` / `EXPORT_SYNC_WAIT_MS` | 2 / 45000 | 导出并发 / 同步等待（M4） |

## 管理命令（pptist-admin）

构建后 `dist/admin.js` 即 `bin.pptist-admin`，直接操作 `DATA_DIR` 下的数据库：

```bash
node dist/admin.js user create alice --note "张三"   # 新建用户并生成第一个 Key（只显示这一次）
node dist/admin.js user list                        # 用户、状态、文档数、Key 数、最近使用
node dist/admin.js user disable alice               # 停用：所有 Key 和文档链接立即失效
node dist/admin.js user enable alice
node dist/admin.js key create alice --label hermes  # 追加 Key（建议每个 Agent 一个）
node dist/admin.js key list alice                   # 只显示前缀
node dist/admin.js key revoke <keyId>
node dist/admin.js quota set alice --docs 100 --doc-mb 10 --exports-per-day 200
node dist/admin.js backup <目标文件>                 # SQLite 在线备份（db.backup()）
```

Docker 部署时 `pptist-admin` 已在容器 PATH 上，用 `docker compose exec app pptist-admin ...` 执行（见下文「部署」）。

## REST 接口

- Key：`Authorization: Bearer pk_…`；文档令牌：`X-Doc-Token: <token>`
- 统一错误：`{ error, message, issues? }`，error ∈ `unauthorized / forbidden / not_found / validation / conflict / quota_exceeded / doc_too_large / rate_limited`

| 方法和路径 | 凭证 | 说明 |
| --- | --- | --- |
| `GET /api/health` | 无 | `{ ok: true }` |
| `GET /api/docs` | Key | 列出本人文档 |
| `POST /api/docs` | Key | `{ title?, theme?, viewportRatio?, slides? }` → `{ docId, version, editUrl, viewUrl }` |
| `DELETE /api/docs/:id` | Key | 删除文档 |
| `POST /api/docs/:id/links/rotate` | Key | 重新生成链接，旧链接立即失效 |
| `POST /api/docs/:id/ops` | Key | Agent 原子操作 `{ ops, baseVersion? }` → `{ version, summary }` |
| `POST /api/docs/:id/patch` | Key | `{ baseVersion, ops: RFC6902[] }` |
| `GET /api/docs/:id` | Key / 令牌 | 完整文档 + version + role + 链接 |
| `PUT /api/docs/:id` | 编辑令牌 | 网页自动保存 `{ baseVersion, doc }` → `{ version, merged, normalized }`，冲突 409 |
| `GET /api/docs/:id/revisions?since=N` | Key / 令牌 | `[{ version, author, createdAt, summary }]` |
| `GET /api/docs/:id/events` | Key / 令牌 | SSE，事件名 `update` |
| `POST /api/assets` | Key | `{ url }` 或 `{ data: base64 }` → `{ id, url }` |
| `POST /api/docs/:id/assets` | 编辑令牌 | 网页端上传图片 |
| `GET /assets/:file` | 无 | 图片（文件名不可猜） |
| `POST /api/docs/:id/exports` | Key / 编辑令牌 | `{ format: 'pptx'\|'pdf'\|'png'\|'json', slides?, options? }`；`EXPORT_SYNC_WAIT_MS` 内完成返回 `{ status:'done', url }`，否则 `{ status:'pending', jobId }` |
| `GET /api/exports/:jobId` | Key / 令牌 | 导出任务状态 |
| `GET /exports/:file` | 无（21 位随机文件名，24h 清理） | 下载导出文件 |
| `GET /api/docs/:id/slides/:index.png?width=` | Key / 令牌 | 单页 PNG 截图（width 默认 1000，16~4000） |

| `POST /mcp` | Key | 远程 MCP 端点（Streamable HTTP，无状态）；GET/DELETE 返回 405 |

### Agent 原子操作（ops）

```ts
{ op: 'addSlides', slides, index? }          { op: 'updateSlide', slideId, props }
{ op: 'deleteSlides', slideIds }             { op: 'moveSlide', slideId, toIndex }
{ op: 'addElements', slideId, elements, index? }
{ op: 'updateElements', updates: [{ id, props }] }   // 不能改 id / type
{ op: 'deleteElements', ids }
{ op: 'setTheme', theme }                    { op: 'setTitle', title }
{ op: 'addNote', slideId, content, elId? }   { op: 'replyNote', slideId, noteId, content }
```

一次请求里的所有 op 按顺序执行、作为一条修订提交；找不到 id 返回 400 并整体回滚。

## 写入流水线

所有写入（PUT / ops / patch）走同一条流水线：zod 校验 → 补全 id → HTML 白名单清洗（防 XSS）→ `data:` 图片转存 `/assets` → 维护元素引用（动画 / 批注 / 线条连接）→ 大小检查 → 无变化短路 → 事务写入 + 修订（gzip 快照，保留最近 100 个）→ SSE 推送。

网页端 `PUT` 带 `baseVersion`：与当前版本一致直接写；落后时用 `base / 服务端 / 浏览器` 三方合并（按页面和元素 id），同一元素两边都改返回 409。

## MCP（远程 Agent 接入）

`POST /mcp`：Streamable HTTP、无状态（每个请求独立鉴权），凭证为 `Authorization: Bearer pk_…`；GET/DELETE 返回 405，不带 Key 返回 401。连接后服务端通过 `instructions` 注入精简编写规范，`get_authoring_guide` 工具可分段取 `doc/AI_PPT_SCHEMA.md` 全文。

工具：

- 指南：`get_authoring_guide`
- 文档：`create_presentation` / `list_presentations` / `get_presentation`（默认 outline 视图省 token）/ `get_slide` / `delete_presentation` / `rotate_links`
- 编辑：`add_slides` / `update_slide` / `delete_slides` / `move_slide` / `add_elements` / `update_elements` / `delete_elements` / `batch_edit` / `set_theme`
- 协作：`get_changes`（看用户改了什么）/ `list_comments` / `add_comment` / `reply_comment`
- 素材：`upload_image`（外链转存或 base64，返回 `/assets/...` 地址）
- 导出：`render_slide`（单页 PNG 截图）/ `export_presentation`（pptx/pdf/png/json）/ `get_export`（查任务状态）

### 客户端配置

Hermes（`~/.hermes/config.yaml` 的 `mcp_servers`）：

```yaml
mcp_servers:
  pptist:
    url: https://你的域名/mcp
    headers:
      Authorization: Bearer pk_...
```

DeepSeek Harness（`dsh-mcp-client`，工具调用超时保持默认 60s 即可）：

```yaml
mcp_servers:
  pptist:
    transport: streamable-http
    url: https://你的域名/mcp
    headers:
      Authorization: Bearer pk_...
```

Grok Bot（远程 MCP，具体字段名以它的文档为准）：

```yaml
mcp_servers:
  pptist:
    url: https://你的域名/mcp
    headers:
      Authorization: Bearer pk_...
```

## 渲染与导出（M4）

导出复用前端代码：无头 Chromium（Playwright）打开 `RENDER_BASE_URL/?mode=export`，调用页面上的 `window.__PPTIST_EXPORT__`（`src/views/ExportRuntime`）生成 PPTX；PDF 用 `page.pdf()`，PNG 用元素截图；JSON 不走浏览器。

- 开发环境：`RENDER_BASE_URL` 指向 vite dev（如 `http://127.0.0.1:5173`）即可，外链图片/字体经服务端防 SSRF 代理回传给页面。
- 需要 Playwright Chromium：`npx playwright install chromium`（缺系统库时 `--with-deps`，或参考 Dockerfile 的官方 Playwright 镜像）。
- 浏览器懒启动常驻、崩溃自动重启；渲染队列并发 `EXPORT_CONCURRENCY`（默认 2）、单任务超时 120s、等待位上限 20（超了返回 429）。
- 导出文件写到 `DATA_DIR/exports/`，文件名 21 位随机串；每小时清理超过 24h 的文件和任务记录。

## 部署（Docker Compose，M5）

### 结构

- `Dockerfile`（仓库根目录，多阶段）：`node:22-bookworm` 构建前端 `dist/` 与 `server/dist/`；运行阶段用 `mcr.microsoft.com/playwright:v1.56.1-noble`（自带 Chromium 与依赖，版本与 `server/package.json` 的 `playwright ~1.56.x` 对齐，以 package-lock 实际安装版本为准）。
- 容器内非 root（`pwuser`）运行，`pptist-admin` 已链接到 `/usr/local/bin`；`EXPOSE 3100`，健康检查 `/api/health`。
- 单容器内：Fastify 托管前端构建产物（`STATIC_DIR`，SPA fallback）+ REST `/api/*` + MCP `/mcp` + 资产 `/assets/*` + 导出 `/exports/*` + Playwright Chromium（经 `RENDER_BASE_URL` 自指打开导出页）。
- 前端打包资源走 `/static/`（`vite.config.ts` 的 `build.assetsDir`），把 `/assets` 前缀留给服务端资产路由，二者不冲突。
- `docker-compose.yml`：`app`（挂载 `./data:/data`，`mem_limit: 3g`，`restart: unless-stopped`）+ 可选 `caddy`（`profile: https`，默认不启动）。`mem_limit` 适用于 compose v2 非 swarm；swarm 模式请改用 `deploy.resources.limits.memory`。
- `Caddyfile`：`reverse_proxy app:3100` + `flush_interval -1`（SSE/流式关闭缓冲）。

### 本地跑一遍

```bash
mkdir -p data                        # 先建好，否则 docker 自动创建会归 root 导致容器写不了
docker compose build                 # 或 docker build -t pptist-app:local .
docker compose up -d                 # 仅 app，宿主 127.0.0.1:3100（避开 3000/3030/4000）
curl http://127.0.0.1:3100/api/health          # → {"ok":true}
curl -I http://127.0.0.1:3100/                  # → 200 text/html（前端 index）
docker compose exec app pptist-admin user create alice   # 建用户，保存输出的 pk_ Key
docker compose exec app pptist-admin key create alice --label hermes
docker compose exec app pptist-admin backup /data/backup-$(date +%F).db   # 备份
docker compose logs -f app
docker compose down
```

冒烟：浏览器开 `http://127.0.0.1:3100/?doc=<id>#t=<token>`（`user create` 后用 `POST /api/docs` 拿 editUrl）；`POST /mcp` 带 `Authorization: Bearer pk_…`。

### 部署到 honcho / VPS

> 测试目标机为 **honcho**；以下步骤对任何装有 Docker 的 Linux 主机通用（计划书中的 VPS 4C8G + Caddy 公网方案作为参考）。真实域名、Key、证书一律不入库。

1. 同步代码到主机：`git clone` 或 `git pull`。
2. （启用 HTTPS 时）DNS 把 `pptist.example.com` 换成真实域名并解析到主机；防火墙/安全组放行 80、443。应用端口 3100 只需容器网络内部可达；宿主映射避开 3000/3030/4000。
3. 编辑 `Caddyfile` 把 `pptist.example.com` 换成真实域名；`docker-compose.yml` 里 `PUBLIC_BASE_URL` 改为 `https://你的域名`。`RENDER_BASE_URL` 保持 `http://127.0.0.1:3100`（容器内自指）。
4. 启动：`docker compose --profile https up -d`；宿主 80/443 被占或不需 HTTPS 时，去掉 `--profile https` 仅起 app。
5. 首个用户：`docker compose exec app pptist-admin user create <name>`，保存输出的 `pk_` Key（只显示一次）。
6. 按「客户端配置」把 `https://你的域名/mcp` + `Authorization: Bearer pk_…` 配进 Agent。
7. 备份：`docker compose exec app pptist-admin backup /data/backup-$(date +%F).db`，产物在宿主 `./data/` 下，建议再定时异地拷贝。

资源建议：内存 ≥ 4G（`mem_limit 3g` + Chromium + Caddy），磁盘按资产与导出量预估；`./data` 需要能被容器内 `pwuser`（playwright noble 镜像中 uid 1001）写入，宿主办不到时改用 named volume。

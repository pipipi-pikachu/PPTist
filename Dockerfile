# syntax=docker/dockerfile:1

#################### 构建阶段 ####################
FROM node:22-bookworm AS build
WORKDIR /app

# 前端依赖；HUSKY=0：镜像内没有 .git，跳过 husky 的 prepare 脚本
COPY package.json package-lock.json ./
RUN HUSKY=0 npm ci

# server 依赖（构建完成后 prune 成生产依赖再带走）
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

# 源码与构建配置
COPY index.html vite.config.ts env.d.ts components.d.ts ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
COPY public ./public
COPY doc ./doc
COPY server/tsconfig.json ./server/tsconfig.json
COPY server/src ./server/src

# 前端 vite build（assetsDir=static → dist/static/）+ server esbuild（→ server/dist/）
RUN npm run build-only \
  && cd server && npm run build && npm prune --omit=dev

#################### 运行阶段 ####################
# 与 server/package.json 的 playwright ~1.56.x 对齐（package-lock 安装版本 1.56.1）
FROM mcr.microsoft.com/playwright:v1.56.1-noble

ENV NODE_ENV=production \
    DATA_DIR=/data \
    PORT=3100 \
    HOST=0.0.0.0 \
    STATIC_DIR=/app/frontend/dist \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

COPY --from=build /app/dist ./frontend/dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/package.json ./server/package.json
COPY doc/AI_PPT_SCHEMA.md ./doc/AI_PPT_SCHEMA.md

# 非 root 运行（playwright 镜像自带 pwuser）；pptist-admin 放进 PATH
RUN mkdir -p /data \
  && chown -R pwuser:pwuser /data /app \
  && chmod +x /app/server/dist/admin.js \
  && ln -s /app/server/dist/admin.js /usr/local/bin/pptist-admin

USER pwuser
EXPOSE 3100

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3100/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/dist/index.js"]

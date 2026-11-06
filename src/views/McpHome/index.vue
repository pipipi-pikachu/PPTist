<template>
  <div class="mcp-home">
    <div class="card">
      <h1>PPTist · Agent 接入（MCP）</h1>
      <p class="intro">
        本服务为 AI Agent 提供远程 MCP 端点，用于创建和修改演示文稿；文档由用户在网页端查看与编辑。
        如果你是文档使用者，请打开 Agent 返回的编辑链接（形如 <code>?doc=…#t=…</code>）。
      </p>

      <h2>端点与鉴权</h2>
      <table class="kv">
        <tbody>
          <tr><td>端点</td><td><code>POST /mcp</code>（Streamable HTTP，无状态）</td></tr>
          <tr><td>鉴权</td><td><code>Authorization: Bearer pk_…</code></td></tr>
          <tr><td>限流</td><td>服务端对每个 Key 实施按分钟频率限制（阈值随部署环境配置，见 <code>MCP_RATE_LIMIT_PER_MIN</code>）</td></tr>
        </tbody>
      </table>

      <h2>客户端配置示例</h2>
      <pre>mcp_servers:
  pptist:
    url: {{ mcpEndpoint }}
    headers:
      Authorization: Bearer pk_...</pre>

      <h2>推荐工作流</h2>
      <ol>
        <li><code>get_authoring_guide</code> 获取页面数据编写规范</li>
        <li><code>create_presentation</code> 创建文档</li>
        <li>把返回的 <code>editUrl</code> 发给用户（网页端可直接编辑，<code>viewUrl</code> 为只读）</li>
        <li><code>get_changes</code> 查看用户在网页端的修改</li>
        <li><code>export_presentation</code> 导出为 pptx / pdf / png / json</li>
      </ol>

      <h2>工具一览</h2>
      <table class="tools">
        <tbody>
          <tr><td>指南</td><td><code>get_authoring_guide</code></td></tr>
          <tr><td>文档</td><td><code>create_presentation</code> <code>list_presentations</code> <code>get_presentation</code> <code>get_slide</code> <code>delete_presentation</code> <code>rotate_links</code></td></tr>
          <tr><td>编辑</td><td><code>add_slides</code> <code>update_slide</code> <code>delete_slides</code> <code>move_slide</code> <code>add_elements</code> <code>update_elements</code> <code>delete_elements</code> <code>batch_edit</code> <code>set_theme</code></td></tr>
          <tr><td>协作</td><td><code>get_changes</code> <code>list_comments</code> <code>add_comment</code> <code>reply_comment</code></td></tr>
          <tr><td>素材</td><td><code>upload_image</code>（外链或 base64 转存，返回可写入 <code>image.src</code> 的地址）</td></tr>
          <tr><td>导出</td><td><code>render_slide</code> <code>export_presentation</code> <code>get_export</code></td></tr>
        </tbody>
      </table>

      <h2>获取 Key</h2>
      <p>
        Key 由管理员在服务端执行 <code>docker compose exec app pptist-admin user create &lt;name&gt;</code> 发放，
        明文只显示一次，请向管理员索取并妥善保管；泄露时请管理员吊销后重发。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const mcpEndpoint = `${window.location.origin}/mcp`
</script>

<style lang="scss" scoped>
.mcp-home {
  min-height: 100%;
  box-sizing: border-box;
  padding: 48px 20px;
  background: #f5f5f5;
  color: #333;
  font-size: 14px;
  line-height: 1.7;
}
.card {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 40px 40px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}
h1 {
  margin: 0 0 16px;
  font-size: 24px;
}
h2 {
  margin: 28px 0 10px;
  font-size: 16px;
  border-left: 3px solid #d24625;
  padding-left: 8px;
}
.intro {
  margin: 0;
  color: #666;
}
.kv td:first-child,
.tools td:first-child {
  width: 64px;
  color: #888;
  white-space: nowrap;
  vertical-align: top;
}
table {
  border-collapse: collapse;
}
td {
  padding: 3px 8px 3px 0;
  vertical-align: top;
}
code {
  padding: 1px 5px;
  background: #f2f2f2;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
}
pre {
  margin: 0;
  padding: 12px 16px;
  background: #2b2b2b;
  color: #e8e8e8;
  border-radius: 6px;
  overflow-x: auto;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 1.6;
}
ol {
  margin: 0;
  padding-left: 22px;
}
p {
  margin: 0;
}
</style>

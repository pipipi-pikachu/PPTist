/**
 * 请求让当前页面根元素进入全屏模式。
 *
 * @returns 无显式返回值；不同浏览器的 Fullscreen API 可能返回 Promise，但当前封装不向调用方暴露该 Promise。
 * @throws 浏览器拒绝全屏请求、缺少用户手势或底层 API 抛错时，异常可能由浏览器实现向上抛出。
 * @remarks
 * - 浏览器通常要求全屏请求由用户手势触发，例如点击按钮或快捷键。
 * - 该函数按标准 API、Firefox 旧 API、WebKit 旧 API、IE/Edge 旧 API 的顺序兼容调用。
 * - 若当前环境完全不支持全屏 API，函数会静默结束，不改变页面状态。
 */
export const enterFullscreen = () => {
  // 选择文档根元素作为全屏目标，保证编辑器或放映视图能够占满整个屏幕。
  const docElm = document.documentElement
  // 优先调用标准 Fullscreen API，这是现代浏览器的首选实现。
  if (docElm.requestFullscreen) docElm.requestFullscreen() 
  // 兼容 Firefox 旧版本的私有 API 命名。
  else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen() 
  // 兼容 WebKit 内核旧版本浏览器的私有 API 命名。
  else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen()
  // 兼容 IE/旧 Edge 的私有 API 命名。
  else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen()
}

/**
 * 请求退出当前文档的全屏模式。
 *
 * @returns 无显式返回值；不同浏览器的退出全屏 API 可能返回 Promise，但当前封装不向调用方暴露该 Promise。
 * @throws 浏览器退出全屏失败或底层 API 抛错时，异常可能由浏览器实现向上抛出。
 * @remarks
 * - 如果页面当前不在全屏状态，多数浏览器会直接忽略该请求或返回已解决的 Promise。
 * - 该函数只处理文档级全屏退出，不额外维护业务状态；业务状态需要调用方自行同步。
 * - 若当前环境完全不支持退出全屏 API，函数会静默结束。
 */
export const exitFullscreen = () => {
  // 优先调用标准退出全屏 API。
  if (document.exitFullscreen) document.exitFullscreen()
  // 兼容 Firefox 旧版本的退出全屏 API。
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  // 兼容 WebKit 内核旧版本浏览器的退出全屏 API。
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  // 兼容 IE/旧 Edge 的退出全屏 API。
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

/**
 * 判断当前文档是否处于全屏状态。
 *
 * @returns 当标准或浏览器私有全屏元素字段存在时返回 `true`，否则返回 `false`。
 * @throws 当前函数不主动抛错；在没有 `document` 的非浏览器环境中调用会触发引用错误。
 * @remarks
 * - 不同浏览器和历史版本暴露的全屏元素字段不同，因此这里同时检查标准字段和多个私有字段。
 * - 返回值只代表浏览器全屏状态，不代表项目内放映状态或演讲者视图状态。
 */
export const isFullscreen = () => {
  // 依次读取标准字段和各浏览器历史私有字段，只要任意字段有元素引用就说明处于全屏状态。
  const fullscreenElement = 
    // 标准 Fullscreen API 字段，现代浏览器优先使用。
    document.fullscreenElement ||
    // Firefox 旧版本使用的私有字段。
    document.mozFullScreenElement ||
    // WebKit 旧版本使用的私有字段。
    document.webkitFullscreenElement ||
    // IE/旧 Edge 使用的私有字段。
    document.msFullscreenElement ||
    // 部分 WebKit 环境曾暴露的当前全屏元素字段，作为额外兼容兜底。
    document.webkitCurrentFullScreenElement
  // 将可能的元素引用转换成稳定布尔值，避免调用方关心具体浏览器字段。
  return !!fullscreenElement
}

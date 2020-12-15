// 进入全屏
export const enterFullscreen = document.documentElement.requestFullscreen

// 退出全屏
export const exitFullscreen = document.exitFullscreen

// 判断是否全屏
export const isFullscreen = () => document.fullscreenEnabled
// 进入全屏
export const enterFullscreen = () => {
  const docElm = document.documentElement
  if (docElm.requestFullscreen) docElm.requestFullscreen() 
  else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen() 
  else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen()
}

// 退出全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
}

// 判断是否全屏
export const isFullscreen = () => (
  document.mozFullScreen ||                         
  document.webkitIsFullScreen ||       
  document.webkitFullScreen
)
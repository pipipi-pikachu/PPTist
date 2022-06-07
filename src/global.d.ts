interface HTMLElement {
  webkitRequestFullScreen(options?: FullscreenOptions): Promise<void>
  mozRequestFullScreen(options?: FullscreenOptions): Promise<void>
  msRequestFullscreen(options?: FullscreenOptions): Promise<void>
}

interface Document {
  webkitFullscreenElement: Element | null
  mozFullScreenElement: Element | null
  msFullscreenElement: Element | null
  webkitCurrentFullScreenElement: Element | null

  mozCancelFullScreen(): Promise<void>
  webkitExitFullscreen(): Promise<void>
  msExitFullscreen(): Promise<void>
}
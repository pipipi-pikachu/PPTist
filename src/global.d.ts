interface HTMLElement {
  webkitRequestFullScreen(options?: FullscreenOptions): Promise<void>;
  mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
}

interface Document {
  mozFullScreen: boolean;
  webkitIsFullScreen: boolean;
  webkitFullScreen: boolean;

  mozCancelFullScreen(): Promise<void>;
  webkitCancelFullScreen(): Promise<void>;
}
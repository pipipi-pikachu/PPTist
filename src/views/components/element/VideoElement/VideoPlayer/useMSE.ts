import { onMounted, type Ref } from 'vue'

export default (
  src: string,
  videoRef: Ref<HTMLVideoElement | undefined>,
) => {
  onMounted(() => {
    if (!videoRef.value) return

    let type = 'normal'
    if (/m3u8(#|\?|$)/i.exec(src)) type = 'hls'
    else if (/.flv(#|\?|$)/i.exec(src)) type = 'flv'

    if (videoRef.value && type === 'hls' && (videoRef.value.canPlayType('application/x-mpegURL') || videoRef.value.canPlayType('application/vnd.apple.mpegURL'))) {
      type = 'normal'
    }

    if (type === 'hls') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Hls = (window as any).Hls
      
      if (Hls && Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(videoRef.value)
      }
    }
    else if (type === 'flv') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flvjs = (window as any).flvjs
      if (flvjs && flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: src,
        })
        flvPlayer.attachMediaElement(videoRef.value)
        flvPlayer.load()
      }
    }
  })
}
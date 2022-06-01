importScripts("precache-manifest.99f45a5a18d81c1f34e55d2c2a746959.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.setCacheNameDetails({
  prefix: 'pptist',
})

workbox.skipWaiting()
workbox.clientsClaim()

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

workbox.routing.registerRoute(
  new RegExp('.*/.*'),
  workbox.strategies.networkFirst()
)

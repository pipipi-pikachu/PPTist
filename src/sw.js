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
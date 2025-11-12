self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('static-v1')
      .then((cache) => cache.addAll(['/']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        const copy = response.clone()
        caches.open('static-v1').then((cache) => cache.put(request, copy)).catch(() => {})
        return response
      })
    })
  )
})



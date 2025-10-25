const CACHE = 'meelz-cache-v2';
const APP_SHELL = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

function isHttpRequest(request) {
  try {
    const url = new URL(request.url);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (!isHttpRequest(req)) return; // ignore chrome-extension:// and other schemes

  // Only cache same-origin requests
  const reqUrl = new URL(req.url);
  const sameOrigin = reqUrl.origin === self.location.origin;
  if (!sameOrigin) return;

  // Workaround for opaque-only caching errors
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;

  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        try {
          const resClone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, resClone)).catch(() => {});
        } catch {}
        return res;
      }).catch(() => cached)
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

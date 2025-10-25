/// <reference lib="webworker" />
export type {}

const CACHE = 'meelz-cache-v2';
const APP_SHELL = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  (self as any).skipWaiting?.();
});

self.addEventListener('fetch', (event: any) => {
  const req = event.request as Request;
  if (req.method !== 'GET') return;
  try {
    const url = new URL(req.url);
    if (!(url.protocol === 'http:' || url.protocol === 'https:')) return;
    if (url.origin !== self.location.origin) return;
  } catch {
    return;
  }
  if ((req as any).cache === 'only-if-cached' && (req as any).mode !== 'same-origin') return;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      try {
        const resClone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, resClone)).catch(() => {});
      } catch {}
      return res;
    }).catch(() => cached))
  );
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    (self as any).clients?.claim?.();
  })());
});

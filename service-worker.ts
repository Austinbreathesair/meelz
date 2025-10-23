/// <reference lib="webworker" />
export type {}

const CACHE = 'meelz-cache-v1';
const APP_SHELL = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('fetch', (event: any) => {
  const req = event.request as Request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, resClone));
      return res;
    }).catch(() => cached))
  );
});


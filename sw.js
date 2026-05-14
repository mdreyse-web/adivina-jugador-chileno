const CACHE_NAME = 'viejos-cracks-v1';
const ASSETS = [
  './',
  './index.html',
  './fondo-chile.png',
  './jugadores.json',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png'
];

// Instalar: cachear assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: servir desde cache primero, luego red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        // Refrescar en background
        fetch(e.request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response);
          });
        }).catch(() => {});
        return cached;
      }
      return fetch(e.request);
    })
  );
});

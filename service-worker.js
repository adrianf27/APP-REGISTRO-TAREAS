// Service worker del Cuaderno de tareas.
// Cachea los archivos de la app para que abra igual sin conexión.
// Sube este archivo a la misma carpeta que registro-tareas.html en tu repositorio.

const CACHE_NAME = 'cuaderno-tareas-v1';
const APP_SHELL = [
  './registro-tareas.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
             .map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// Cache-first para los archivos de la app; si algún día añades
// llamadas a una API (por ejemplo Supabase), esas peticiones van
// directas a la red y no pasan por esta caché.
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  var isAppFile = APP_SHELL.some(function (f) {
    return url.pathname.endsWith(f.replace('./', '/'));
  }) || event.request.mode === 'navigate';

  if (!isAppFile || event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request).then(function (resp) {
        if (resp && resp.ok) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});

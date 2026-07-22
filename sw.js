// Service Worker — caché versionada.
// La versión se lee de js/version.js — ese es el único fichero a modificar.
// Al cambiar la versión, la caché anterior se elimina y todos los
// archivos se descargan frescos. Entre recargas de la misma versión
// se sirven desde caché local (carga instantánea).

importScripts('./js/version.js');
const CACHE = `poke-v${GAME_VERSION}`;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Recursos externos (PokeAPI, Google Fonts) — comportamiento normal del navegador
  if (url.origin !== location.origin) return;

  // HTML, CSS y JS — network-first: siempre descarga la última versión; caché como fallback.
  // JS incluido para que cualquier cambio de código llegue sin necesidad de bumpar versión.
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // El resto (imágenes, fuentes, etc.) — cache-first; solo se cachean respuestas OK.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// Alice's Photo Frame — Service Worker v1.0
// PWA offline support + caching

const CACHE_NAME = 'alice-photo-frame-v1';

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Install v1.0');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/']);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: clean old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activate v1.0');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: network-first, fallback to cache ───────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

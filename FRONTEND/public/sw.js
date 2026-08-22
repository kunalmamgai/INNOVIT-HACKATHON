const CACHE_NAME = 'heritage-portal-v3';
const PRECACHE_URLS = ['/', '/index.html'];

// Install: pre-cache only production-safe paths
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches when a new version deploys
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategies:
//   - Navigations: network-first (fresh HTML, offline fallback to cached)
//   - Hashed assets (JS/CSS/images with content hash): cache-first (immutable)
//   - Other same-origin requests: stale-while-revalidate (serve cache, update in background)
//   - Cross-origin requests: pass through (don't cache third-party CDN)
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigation requests: network-first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Skip cross-origin (third-party CDNs, API calls, etc.)
  if (url.origin !== self.location.origin) return;

  // Hashed static assets (Vite appends content hash): cache-first (immutable)
  // These filenames change when content changes, so caching forever is safe.
  const isHashedAsset = /\/assets\/.*\.[a-f0-9]{8,}\.(js|css|woff2|png|svg|mp4|webp|jpg)$/.test(url.pathname);
  if (isHashedAsset) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Other same-origin requests (index.html, non-hashed assets):
  // Stale-while-revalidate — serve from cache instantly, update in background
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached); // If network fails, return whatever is cached

      // Return cached version immediately if available, otherwise wait for network
      return cached || fetchPromise;
    })
  );
});

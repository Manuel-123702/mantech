// MANTECH Nexus Service Worker (PWA) v2 — Offline-First & Stale-While-Revalidate
const CACHE_NAME = 'mantech-nexus-v2';
const STATIC_CACHE_NAME = 'mantech-static-v2';
const OFFLINE_URL = '/offline.html';

const CORE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-icon-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-cache non-fatal error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== STATIC_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass API routes, Clerk auth, and chrome-extension schemes
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_clerk/') ||
    url.pathname.startsWith('/clerk/') ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // 1. Navigation requests (Page HTML): Stale-While-Revalidate with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, try serving matching cached page first
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;

          // If not in cache, try root page cache
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;

          // Fallback to offline page
          const offlinePage = await caches.match(OFFLINE_URL);
          return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 2. Static Next.js Chunks, CSS, Images, Fonts: Cache-First with Network Revalidation
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          // Revalidate in background
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(STATIC_CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => {});
          return cached;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. All other requests: Network-first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

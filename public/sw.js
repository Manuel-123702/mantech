// MANTECH Nexus Service Worker (PWA) v6 — Data-Efficient Online-First Engine
// - Both standard Web and installed PWA operate strictly in live online mode.
// - If the user loses network connection (offline), the creative diagnostic
//   offline page is presented with auto-reconnection detection.
// - v6: Next.js self-hosted fonts cached aggressively so repeat visits
//   require ZERO font downloads (huge saving on Cameroon mobile data).

const CACHE_NAME = 'mantech-nexus-v6';
const STATIC_CACHE_NAME = 'mantech-static-v6';
const FONT_CACHE_NAME = 'mantech-fonts-v6';
const OFFLINE_URL = '/offline.html';

const CORE_ASSETS = [
  OFFLINE_URL,
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
          if (name !== CACHE_NAME && name !== STATIC_CACHE_NAME && name !== FONT_CACHE_NAME) {
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

  // Bypass API routes, Clerk auth, and non-http schemes
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_clerk/') ||
    url.pathname.startsWith('/clerk/') ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // 1. Navigation requests (Page HTML): 100% Online-First
  // Web and PWA both require live internet. If fetch fails (offline), serve the creative offline screen.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offlinePage = await caches.match(OFFLINE_URL);
        return (
          offlinePage ||
          new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#020617;color:#fff;font-family:sans-serif;padding:40px;text-align:center"><h1>You are offline</h1><p>Please reconnect to the internet to use MANTECH Nexus.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
          )
        );
      })
    );
    return;
  }

  // 1b. Self-hosted font files from next/font — Cache-first, permanent TTL.
  //     Once cached, fonts are served 100% from cache with zero network cost.
  //     This is the biggest data saving for repeat Cameroon mobile users.
  const isFontAsset =
    url.pathname.startsWith('/_next/static/media/') &&
    (url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff'));

  if (isFontAsset) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response && response.status === 200) cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  // 2. Static Next.js Chunks, CSS, Images, Fonts: Cache-First with Background Revalidation
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif') ||
    url.pathname.endsWith('.svg');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
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

  // 3. Fallback for other GET requests: Network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

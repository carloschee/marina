// sw.js — Dótir service worker
// Cache-first for everything in the app shell. After the install event
// finishes, the app works fully offline on her iPad.
//
// Bump CACHE_VERSION whenever you change any cached file. The old cache
// is wiped on `activate` and the new one is populated lazily as files
// are requested.

const CACHE_VERSION = 'dotir-v3-2026-05-11-1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './marina.jsx',
  './shared.jsx',
  './tweaks-panel.jsx',
  './marina-app.jsx',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  // 3rd-party JS (cached on first fetch — they're CORS-safe with integrity hashes)
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  // Fonts CSS — actual woff2 files are picked up by the fetch handler
  'https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&family=Lexend:wght@400;500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Best-effort: don't fail install if a CDN is unreachable on first install.
    await Promise.allSettled(APP_SHELL.map((url) =>
      cache.add(new Request(url, { mode: url.startsWith('http') ? 'no-cors' : 'same-origin' }))
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache-first, fall back to network, then populate cache on success.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) {
      // Update in the background — silent cache refresh
      fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      // Offline & uncached — fall back to index for navigations
      if (req.mode === 'navigate') {
        const idx = await cache.match('./index.html');
        if (idx) return idx;
      }
      throw err;
    }
  })());
});

// sw.js — Dótir service worker v4
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  PARA ACTUALIZAR: sube sólo CACHE_VERSION. Todo lo demás es automático. │
// └─────────────────────────────────────────────────────────────────────────┘
//
// Estrategia por tipo de recurso
// ──────────────────────────────
//   App shell  (HTML / JSX / íconos / manifest)
//              → Cache-first  |  precache en install
//
//   CDN JS / fuentes  (unpkg, fonts.googleapis.com, fonts.gstatic.com)
//              → Cache-first  |  lazy, opaque-ok
//
//   Audio  (.mp3 / .ogg / .wav)
//              → Cache-first  |  lazy + cuota protegida (50 MB mínimo libre)
//
//   Navegación  (request.mode === 'navigate')
//              → Network-first con fallback a index.html  (timeout 3s)
//
//   Todo lo demás
//              → Stale-while-revalidate

const CACHE_VERSION = 'dotir-v4-2026-05-12';
const AUDIO_QUOTA_MIN = 50 * 1024 * 1024; // 50 MB
const NAV_NETWORK_TIMEOUT = 3000;

const APP_SHELL_SAME_ORIGIN = [
  './',
  './index.html',
  './manifest.json',
  './marina-app.jsx',
  './marina.jsx',
  './shared.jsx',
  './tweaks-panel.jsx',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

const APP_SHELL_CDN = [
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&family=Lexend:wght@400;500;600;700&display=swap',
];

const openCache   = () => caches.open(CACHE_VERSION);
const isAudio     = (url) => /\.(mp3|ogg|wav|m4a|aac)(\?|$)/i.test(url);
const isFont      = (url) => /\.(woff2?|ttf|otf)(\?|$)/i.test(url) || url.includes('fonts.gstatic.com');
const isCdnOpaque = (url) =>
  url.startsWith('https://unpkg.com') ||
  url.startsWith('https://fonts.googleapis.com') ||
  url.startsWith('https://fonts.gstatic.com');

async function hasStorageQuota(minBytes) {
  if (!navigator.storage?.estimate) return true;
  try {
    const { quota = 0, usage = 0 } = await navigator.storage.estimate();
    return (quota - usage) > minBytes;
  } catch { return true; }
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await openCache();
    await cache.addAll(
      APP_SHELL_SAME_ORIGIN.map((url) => new Request(url, { cache: 'reload' }))
    );
    await Promise.allSettled(
      APP_SHELL_CDN.map((url) =>
        cache.add(new Request(url, { mode: 'no-cors', cache: 'reload' }))
          .catch((e) => console.warn('[sw] CDN precache miss:', url, e))
      )
    );
    self.skipWaiting();
  })());
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;
  if (req.method !== 'GET') return;
  if (!url.startsWith('http')) return;

  if (req.mode === 'navigate') { event.respondWith(handleNavigate(req)); return; }
  if (isAudio(url))            { event.respondWith(handleAudio(req));    return; }
  if (isCdnOpaque(url) || isFont(url)) { event.respondWith(handleCacheFirst(req, { allowOpaque: true })); return; }
  event.respondWith(handleStaleWhileRevalidate(req));
});

async function handleNavigate(req) {
  const cache = await openCache();
  try {
    const res = await fetchWithTimeout(req, NAV_NETWORK_TIMEOUT);
    if (res.ok) { cache.put(req, res.clone()).catch(() => {}); return res; }
    throw new Error('non-ok');
  } catch {
    const cached = await cache.match(req, { ignoreSearch: true }) ?? await cache.match('./index.html');
    if (cached) return cached;
    return new Response('<h1>Sin conexión</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 });
  }
}

async function handleCacheFirst(req, { allowOpaque = false } = {}) {
  const cache  = await openCache();
  const cached = await cache.match(req);
  if (cached) {
    fetch(req).then((res) => {
      if (res && (res.ok || (allowOpaque && res.type === 'opaque'))) cache.put(req, res.clone()).catch(() => {});
    }).catch(() => {});
    return cached;
  }
  const res = await fetch(req);
  if (res && (res.ok || (allowOpaque && res.type === 'opaque'))) cache.put(req, res.clone()).catch(() => {});
  return res;
}

async function handleStaleWhileRevalidate(req) {
  const cache   = await openCache();
  const cached  = await cache.match(req, { ignoreSearch: true });
  const network = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);
  return cached ?? await network ?? new Response('', { status: 503 });
}

async function handleAudio(req) {
  const cache  = await openCache();
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res && res.ok) {
    if (await hasStorageQuota(AUDIO_QUOTA_MIN)) {
      cache.put(req, res.clone()).catch(() => {});
    } else {
      console.warn('[sw] Audio no cacheado — cuota insuficiente:', req.url);
    }
  }
  return res;
}

// ── Mensajes ──────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

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
//              Siempre disponible offline sin red.
//
//   CDN JS / fuentes CSS  (unpkg, fonts.googleapis.com, fonts.gstatic.com)
//              → Cache-first  |  lazy (se puebla en primer uso)
//              No bloqueamos el install si el CDN está caído;
//              los recursos llegan igual la primera vez que se piden.
//
//   Audio  (.mp3 / .ogg / .wav — cuando existan)
//              → Cache-first  |  lazy + cuota protegida
//              Los archivos de audio pueden ser grandes; sólo se cachean
//              si la Storage API reporta > AUDIO_QUOTA_MIN libre.
//
//   Navegación  (request.mode === 'navigate')
//              → Network-first con fallback a index.html cacheado
//              Garantiza que actualizaciones de HTML lleguen rápido,
//              pero la app sigue abriendo offline.
//
//   Todo lo demás  (imágenes futuras, data, etc.)
//              → Stale-while-revalidate
//              El usuario ve respuesta inmediata; la cache se refresca
//              en background si hay red.

// ─── Configuración ───────────────────────────────────────────────────────────

// Bump este string cuando cambie cualquier archivo del app shell.
// Formato recomendado: dotir-vN-YYYY-MM-DD[-n]
const CACHE_VERSION = 'dotir-v4-2026-05-12';

// Cuánto espacio libre mínimo debe haber para cachear audio (bytes).
// 50 MB es un umbral conservador para un iPad con almacenamiento ajustado.
const AUDIO_QUOTA_MIN = 50 * 1024 * 1024;

// Tiempo máximo de espera para network-first en navegación (ms).
// Si la red tarda más, servimos desde cache de inmediato.
const NAV_NETWORK_TIMEOUT = 3000;

// App shell: se precachean en install. Si alguno falla, el install
// se cancela (fail-fast) para que el SW no quede en estado corrupto.
// Los recursos externos (CDN) se marcan con mode:'no-cors' y se
// añaden best-effort, sin bloquear el install.
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Abre (o reutiliza) el cache de la versión actual. */
const openCache = () => caches.open(CACHE_VERSION);

/** ¿Es una URL de audio cacheable? */
const isAudio = (url) => /\.(mp3|ogg|wav|m4a|aac)(\?|$)/i.test(url);

/** ¿Es una fuente woff/woff2? (servidas por gstatic, opaque ok) */
const isFont = (url) => /\.(woff2?|ttf|otf)(\?|$)/i.test(url) ||
  url.includes('fonts.gstatic.com');

/** ¿Es un recurso CDN externo que admitimos como opaque? */
const isCdnOpaque = (url) =>
  url.startsWith('https://unpkg.com') ||
  url.startsWith('https://fonts.googleapis.com') ||
  url.startsWith('https://fonts.gstatic.com');

/** Consulta Storage API; resuelve `true` si hay espacio suficiente. */
async function hasStorageQuota(minBytes) {
  if (!navigator.storage?.estimate) return true; // sin API → optimista
  try {
    const { quota = 0, usage = 0 } = await navigator.storage.estimate();
    return (quota - usage) > minBytes;
  } catch {
    return true;
  }
}

/**
 * Intenta una petición de red con timeout.
 * Resuelve con la Response si llega antes de `ms`; rechaza si no.
 */
function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

// ─── Install ─────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await openCache();

    // Same-origin: fallo explícito si alguno no carga.
    // Así detectamos en desarrollo que olvidamos un archivo.
    await cache.addAll(
      APP_SHELL_SAME_ORIGIN.map((url) => new Request(url, { cache: 'reload' }))
    );

    // CDN: best-effort, no-cors. Un CDN caído no impide instalar el SW.
    await Promise.allSettled(
      APP_SHELL_CDN.map((url) =>
        cache.add(new Request(url, { mode: 'no-cors', cache: 'reload' }))
          .catch((e) => console.warn('[sw] CDN precache miss:', url, e))
      )
    );

    // Toma control inmediato sin esperar que el cliente se refresque.
    self.skipWaiting();
  })());
});

// ─── Activate ────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Borra todas las versiones anteriores.
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k !== CACHE_VERSION)
        .map((k) => caches.delete(k))
    );

    // Reclama clientes abiertos para que esta versión del SW
    // los controle de inmediato (sin reload del usuario).
    await self.clients.claim();
  })());
});

// ─── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // Ignoramos peticiones no-GET y peticiones de chrome-extension, etc.
  if (req.method !== 'GET') return;
  if (!url.startsWith('http')) return;

  // ── 1. Navegación → Network-first con fallback ─────────────────────────
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigate(req));
    return;
  }

  // ── 2. Audio → Cache-first con cuota protegida ─────────────────────────
  if (isAudio(url)) {
    event.respondWith(handleAudio(req));
    return;
  }

  // ── 3. CDN JS / fuentes → Cache-first (opaque ok) ─────────────────────
  if (isCdnOpaque(url) || isFont(url)) {
    event.respondWith(handleCacheFirst(req, { allowOpaque: true }));
    return;
  }

  // ── 4. Todo lo demás → Stale-while-revalidate ─────────────────────────
  event.respondWith(handleStaleWhileRevalidate(req));
});

// ─── Estrategias ─────────────────────────────────────────────────────────────

/**
 * Navegación: intenta red con timeout; si falla o tarda, sirve index.html.
 * Garantiza que abrir la app offline siempre funcione.
 */
async function handleNavigate(req) {
  const cache = await openCache();
  try {
    const res = await fetchWithTimeout(req, NAV_NETWORK_TIMEOUT);
    if (res.ok) {
      cache.put(req, res.clone()).catch(() => {});
      return res;
    }
    throw new Error('non-ok');
  } catch {
    const cached = await cache.match(req, { ignoreSearch: true })
      ?? await cache.match('./index.html');
    if (cached) return cached;
    // Último recurso: respuesta offline mínima
    return new Response('<h1>Sin conexión</h1>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
    });
  }
}

/**
 * Cache-first estándar. Refresca en background si llega desde cache.
 * `allowOpaque`: acepta respuestas opaque (CDN no-cors) como válidas.
 */
async function handleCacheFirst(req, { allowOpaque = false } = {}) {
  const cache = await openCache();
  const cached = await cache.match(req, { ignoreSearch: false });

  if (cached) {
    // Refresco silencioso en background
    fetch(req).then((res) => {
      if (res && (res.ok || (allowOpaque && res.type === 'opaque'))) {
        cache.put(req, res.clone()).catch(() => {});
      }
    }).catch(() => {});
    return cached;
  }

  try {
    const res = await fetch(req);
    if (res && (res.ok || (allowOpaque && res.type === 'opaque'))) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    // Sin cache y sin red — propaga el error
    throw err;
  }
}

/**
 * Stale-while-revalidate: sirve cache inmediatamente si existe,
 * lanza fetch en paralelo para actualizar. Si no hay cache, espera la red.
 */
async function handleStaleWhileRevalidate(req) {
  const cache = await openCache();
  const cached = await cache.match(req, { ignoreSearch: true });

  const networkPromise = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);

  return cached ?? await networkPromise ?? new Response('', { status: 503 });
}

/**
 * Audio: cache-first, pero antes de cachear verifica que haya cuota.
 * Si el archivo ya está en cache, se sirve siempre sin consultar cuota.
 */
async function handleAudio(req) {
  const cache = await openCache();
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const enoughSpace = await hasStorageQuota(AUDIO_QUOTA_MIN);
      if (enoughSpace) {
        cache.put(req, res.clone()).catch(() => {});
      } else {
        console.warn('[sw] Audio no cacheado — cuota insuficiente:', req.url);
      }
    }
    return res;
  } catch (err) {
    throw err;
  }
}

// ─── Mensaje desde la app ─────────────────────────────────────────────────────
// La app puede enviar postMessage({ type: 'SKIP_WAITING' }) para forzar
// activación inmediata de un SW pendiente (útil después de mostrarle
// al usuario un banner "nueva versión disponible").

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

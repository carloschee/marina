# Dótir — PWA (Marina)

Aplicación instalable para iPad Air (4ª gen.) en horizontal. Diseñada para
desarrollo de lenguaje en una niña de tres años, autista.

## Cómo instalarla en el iPad

1. Sube esta carpeta (`pwa/`) a un servidor con **HTTPS** (GitHub Pages,
   Netlify, Cloudflare Pages, Vercel, o un servidor propio con TLS).
   _iOS no instala PWAs servidas por `http://`._
2. En el iPad, abre la URL en **Safari** (no Chrome — en iOS sólo Safari
   instala PWAs reales).
3. Toca el botón **Compartir** → **Añadir a pantalla de inicio**.
4. Confirma el nombre ("Dótir") y toca **Añadir**.
5. Abre el ícono desde la pantalla de inicio — se abrirá en modo
   pantalla completa, sin barra del navegador.

Después de la primera apertura con internet, el _service worker_ guarda
toda la app y los pictogramas en caché. A partir de ese momento, **funciona
100% sin conexión**.

## Área de adultos (PIN)

La pantalla de ajustes está oculta para que la niña no la abra sola. Hay
dos formas de llegar:

- 5 toques en la **esquina inferior derecha** (zona invisible de 56×56 px)
- 3 toques en la **esquina superior izquierda**

PIN por defecto: `1234`. (Cambia la constante `PARENT_PIN` en
`marina-app.jsx` mientras no exista una pantalla de Ajustes para
configurarlo.)

## Estructura

| Archivo                | Qué hace                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `index.html`           | Punto de entrada — meta tags PWA, scale-to-fit, splash     |
| `manifest.json`        | Manifiesto PWA (íconos, color, idioma, orientación)        |
| `sw.js`                | Service worker — cache-first, offline-completo             |
| `marina-app.jsx`       | Wrapper de la app: navegación, persistencia local, PIN     |
| `marina.jsx`           | Pantallas (Home, Mira y di, Memorama, Frases)              |
| `shared.jsx`           | Vocabulario, TTS hook, pictogramas                         |
| `tweaks-panel.jsx`     | Panel de ajustes (paleta, densidad, voz)                   |
| `icons/`               | Íconos PNG (180, 192, 256, 384, 512, maskable 512)         |

## Pendientes (futuras versiones)

- Reemplazar emoji por pictogramas de **ARASAAC** (descarga + bundle).
- Pantalla de Ajustes accesible desde el área de adultos (cambiar PIN,
  agregar vocabulario, ver favoritos, exportar progreso).
- Marcado de palabras/frases favoritas con `localStorage`.
- Cuando esté listo, generar un build "production" sin Babel en
  cliente (precompilar JSX) para que arranque más rápido en iPad.

## Bumping the service worker

Si cambias cualquier archivo cacheado, sube la versión en `sw.js`:

```js
const CACHE_VERSION = 'dotir-v3-2026-05-11-1'; // ← incrementa esto
```

La próxima vez que la app abra con internet, la nueva versión se instala
y la antigua se borra.

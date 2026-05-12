// shared.jsx — vocabulario, TTS, pictogramas comunes

const VOCAB = [
  { id: 'globo',     es: 'globo',     en: 'balloon',    art: '🎈', theme: 'cielo'   },
  { id: 'mariposa',  es: 'mariposa',  en: 'butterfly',  art: '🦋', theme: 'cielo'   },
  { id: 'sol',       es: 'sol',       en: 'sun',        art: '☀️', theme: 'cielo'   },
  { id: 'nube',      es: 'nube',      en: 'cloud',      art: '☁️', theme: 'cielo'   },
  { id: 'flor',      es: 'flor',      en: 'flower',     art: '🌸', theme: 'cielo'   },
  { id: 'sandia',    es: 'sandía',    en: 'watermelon', art: '🍉', theme: 'fruta'   },
  { id: 'manzana',   es: 'manzana',   en: 'apple',      art: '🍎', theme: 'fruta'   },
  { id: 'platano',   es: 'plátano',   en: 'banana',     art: '🍌', theme: 'fruta'   },
  { id: 'uva',       es: 'uva',       en: 'grapes',     art: '🍇', theme: 'fruta'   },
  { id: 'fresa',     es: 'fresa',     en: 'strawberry', art: '🍓', theme: 'fruta'   },
  { id: 'zanahoria', es: 'zanahoria', en: 'carrot',     art: '🥕', theme: 'verdura' },
  { id: 'brocoli',   es: 'brócoli',   en: 'broccoli',   art: '🥦', theme: 'verdura' },
  { id: 'tomate',    es: 'tomate',    en: 'tomato',     art: '🍅', theme: 'verdura' },
  { id: 'coche',     es: 'coche',     en: 'car',        art: '🚗', theme: 'vehiculo'},
  { id: 'tren',      es: 'tren',      en: 'train',      art: '🚂', theme: 'vehiculo'},
  { id: 'avion',     es: 'avión',     en: 'airplane',   art: '✈️', theme: 'vehiculo'},
  { id: 'barco',     es: 'barco',     en: 'boat',       art: '⛵', theme: 'mar'     },
  { id: 'submarino', es: 'submarino', en: 'submarine',  art: 'submarine', theme: 'mar' },
  { id: 'pez',       es: 'pez',       en: 'fish',       art: '🐟', theme: 'mar'     },
];

const byId = Object.fromEntries(VOCAB.map(v => [v.id, v]));

const PHRASES = [
  { id: 'globo-cielo',      es: 'globo en el cielo',          en: 'balloon in the sky',
    chunks: [['v','globo'], ['t','en el cielo']] },
  { id: 'sandia-semillas',  es: 'la sandía tiene semillas',   en: 'the watermelon has seeds',
    chunks: [['v','sandia'], ['t','tiene semillas']] },
  { id: 'mariposa-flor',    es: 'mariposa en la flor',        en: 'butterfly on the flower',
    chunks: [['v','mariposa'], ['t','en la'], ['v','flor']] },
  { id: 'submarino-mar',    es: 'submarino en el mar',        en: 'submarine in the sea',
    chunks: [['v','submarino'], ['t','en el mar']] },
  { id: 'tren-rapido',      es: 'tren rápido',                en: 'fast train',
    chunks: [['v','tren'], ['t','rápido']] },
  { id: 'manzana-roja',     es: 'manzana roja',               en: 'red apple',
    chunks: [['v','manzana'], ['t','roja']] },
];

// ─── TTS hook ────────────────────────────────────────────────────────────────
function useTTS() {
  // [P15] rate ahora se lee de ref.current.rate (antes ignorado)
  const ref = React.useRef({ volume: 1, rate: 0.85, voice: 'es-MX', muted: false });

  const configure = React.useCallback((cfg) => {
    ref.current = { ...ref.current, ...cfg };
  }, []);

  const speak = React.useCallback((text, opts = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const { volume, rate, voice, muted } = ref.current;
    if (muted || volume <= 0) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang   = opts.lang  ?? voice ?? 'es-MX';
      u.rate   = opts.rate  ?? rate;   // [P15] usa rate del config, no 0.85 hardcoded
      u.pitch  = opts.pitch ?? 1.05;
      u.volume = volume;
      window.speechSynthesis.speak(u);
    } catch { /* noop */ }
  }, []);

  return { speak, configure };
}

// ─── Pictogram renderer ───────────────────────────────────────────────────────
function Picto({ id, size = 96, style = {} }) {
  const v = typeof id === 'string' ? byId[id] : id;
  if (!v) return null;
  if (v.art === 'submarine') return <Submarino size={size} style={style} />;
  return (
    <span
      role="img"
      aria-label={v.es}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      {v.art}
    </span>
  );
}

function Submarino({ size = 96, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-label="submarino">
      <rect x="49" y="14" width="3" height="14" fill="#3a4a5a" />
      <rect x="49" y="11" width="10" height="4" fill="#3a4a5a" />
      <rect x="38" y="28" width="20" height="14" rx="3" fill="#ffd166" />
      <rect x="10" y="42" width="80" height="32" rx="16" fill="#ff6b8b" />
      <circle cx="30" cy="58" r="6" fill="#fff8ec" />
      <circle cx="50" cy="58" r="6" fill="#fff8ec" />
      <circle cx="70" cy="58" r="6" fill="#fff8ec" />
      <circle cx="30" cy="58" r="3" fill="#5b8def" />
      <circle cx="50" cy="58" r="3" fill="#5b8def" />
      <circle cx="70" cy="58" r="3" fill="#5b8def" />
      <circle cx="92" cy="58" r="4" fill="#3a4a5a" />
    </svg>
  );
}

// ─── Memorama deck builder ─────────────────────────────────────────────────────
// [P16] Parámetro `i` de flatMap eliminado — sólo se usaba `id`
function buildMemoramaDeck(vocabIds) {
  const pairs = vocabIds.flatMap((id) => [
    { key: `${id}-a`, vocabId: id },
    { key: `${id}-b`, vocabId: id },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

// [P17] clamp() eliminado — no se usa en ningún archivo

Object.assign(window, {
  VOCAB, byId, PHRASES,
  useTTS, Picto, Submarino,
  buildMemoramaDeck,
});

// shared.jsx — vocabulary, TTS, common bits used by both directions

// Vocabulary curated for her interests: globos, mariposas, sandía, submarino,
// vehículos, frutas, verduras. ES primary, EN secondary.
// `art` is rendered by <Picto/> below — emoji placeholder for now; swap in
// ARASAAC pictograms or real photos in production.
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
  { id: 'submarino', es: 'submarino', en: 'submarine',  art: 'submarine', theme: 'mar' }, // custom svg
  { id: 'pez',       es: 'pez',       en: 'fish',       art: '🐟', theme: 'mar'     },
];

const byId = Object.fromEntries(VOCAB.map(v => [v.id, v]));

// Curated phrase recipes — the chips she can build into 2–3 word phrases.
// Each phrase is a list of {kind, id|text} segments. Vocab-id segments show
// the picto + word; text segments are connector words ("en", "el", "tiene", "y").
const PHRASES = [
  { id: 'globo-cielo', es: 'globo en el cielo',     en: 'balloon in the sky',
    chunks: [['v','globo'], ['t','en el cielo']] },
  { id: 'sandia-semillas', es: 'la sandía tiene semillas', en: 'the watermelon has seeds',
    chunks: [['v','sandia'], ['t','tiene semillas']] },
  { id: 'mariposa-flor', es: 'mariposa en la flor', en: 'butterfly on the flower',
    chunks: [['v','mariposa'], ['t','en la'], ['v','flor']] },
  { id: 'submarino-mar', es: 'submarino en el mar',  en: 'submarine in the sea',
    chunks: [['v','submarino'], ['t','en el mar']] },
  { id: 'tren-rapido',  es: 'tren rápido',           en: 'fast train',
    chunks: [['v','tren'], ['t','rápido']] },
  { id: 'manzana-roja', es: 'manzana roja',          en: 'red apple',
    chunks: [['v','manzana'], ['t','roja']] },
];

// ─── TTS hook ───────────────────────────────────────────────────────────────
function useTTS() {
  const ref = React.useRef({ volume: 1, voice: 'es-MX', muted: false });
  // expose a setter so tweaks can update
  const configure = React.useCallback((cfg) => { ref.current = { ...ref.current, ...cfg }; }, []);

  const speak = React.useCallback((text, opts = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const { volume, voice, muted } = ref.current;
    if (muted || volume <= 0) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang || voice || 'es-MX';
      u.rate = opts.rate ?? 0.85;
      u.pitch = opts.pitch ?? 1.05;
      u.volume = volume;
      window.speechSynthesis.speak(u);
    } catch (e) { /* noop */ }
  }, []);

  return { speak, configure };
}

// ─── Pictogram renderer ─────────────────────────────────────────────────────
// `art` is either an emoji string (rendered as text) or a key for a custom SVG.
function Picto({ id, size = 96, style = {} }) {
  const v = typeof id === 'string' ? byId[id] : id;
  if (!v) return null;
  if (v.art === 'submarine') return <Submarino size={size} style={style} />;
  return (
    <span
      role="img"
      aria-label={v.es}
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {v.art}
    </span>
  );
}

// Submarine composed from basic shapes (rounded rect body, circle window,
// rect tower, line periscope) — emoji has no submarine glyph.
function Submarino({ size = 96, style = {} }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={style} aria-label="submarino">
      {/* periscope */}
      <rect x="49" y="14" width="3" height="14" fill="#3a4a5a" />
      <rect x="49" y="11" width="10" height="4" fill="#3a4a5a" />
      {/* tower */}
      <rect x="38" y="28" width="20" height="14" rx="3" fill="#ffd166" />
      {/* body */}
      <rect x="10" y="42" width="80" height="32" rx="16" fill="#ff6b8b" />
      {/* portholes */}
      <circle cx="30" cy="58" r="6" fill="#fff8ec" />
      <circle cx="50" cy="58" r="6" fill="#fff8ec" />
      <circle cx="70" cy="58" r="6" fill="#fff8ec" />
      <circle cx="30" cy="58" r="3" fill="#5b8def" />
      <circle cx="50" cy="58" r="3" fill="#5b8def" />
      <circle cx="70" cy="58" r="3" fill="#5b8def" />
      {/* propeller */}
      <circle cx="92" cy="58" r="4" fill="#3a4a5a" />
    </svg>
  );
}

// ─── Memorama deck builder ──────────────────────────────────────────────────
// Returns shuffled list of {key, vocabId} pairs (each vocab item duplicated).
function buildMemoramaDeck(vocabIds) {
  const pairs = vocabIds.flatMap((id, i) => ([
    { key: `${id}-a`, vocabId: id, pairIdx: i },
    { key: `${id}-b`, vocabId: id, pairIdx: i },
  ]));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

// ─── small helpers ──────────────────────────────────────────────────────────
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

// Export everything to window for cross-script use
Object.assign(window, {
  VOCAB, byId, PHRASES,
  useTTS, Picto, Submarino,
  buildMemoramaDeck, clamp,
});

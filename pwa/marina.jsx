// marina.jsx — pantallas Marina: Home, Mira y di, Memorama, Frases

// [P9] Keyframes fuera de MarinaWaves — se inyectan una sola vez en el DOM,
// no se duplican en cada navegación entre pantallas.
(function injectMarinaStyles() {
  if (document.getElementById('marina-styles')) return;
  const el = document.createElement('style');
  el.id = 'marina-styles';
  el.textContent = `
    @keyframes marina-glow {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(80px,40px) scale(1.15); }
    }
    @keyframes marina-press {
      0%   { transform: scale(1); }
      50%  { transform: scale(0.96); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(el);
})();

const marinaTokens = {
  bg:           '#062a35',
  bgGrad:       'radial-gradient(ellipse at 30% 0%, #0d4858 0%, #062a35 60%, #03161c 100%)',
  surface:      '#0e3a48',
  surfaceLight: '#fff',
  ink:          '#f7f1e3',
  inkOnLight:   '#0a1f27',
  inkSoft:      'rgba(247,241,227,0.62)',
  primary:      '#ff6b8b',
  primarySoft:  '#ffd9e1',
  green:        '#38d9a9',
  greenSoft:    '#cdf5e8',
  gold:         '#ffd166',
  goldSoft:     '#fff0c2',
  coral:        '#ff9b71',
  shadow:       '0 10px 30px rgba(0,0,0,0.35)',
  shadowDeep:   '0 20px 60px rgba(0,0,0,0.5)',
  display:      '"Outfit","Bricolage Grotesque",system-ui,sans-serif',
  body:         '"Lexend",system-ui,sans-serif',
  radiusLg:     28,
  radiusMd:     20,
};

function MarinaShell({ children, noPadding = false }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: marinaTokens.bgGrad,
      fontFamily: marinaTokens.body,
      color: marinaTokens.ink,
      position: 'relative', overflow: 'hidden',
    }}>
      <MarinaWaves />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: noPadding ? 0 : 36 }}>
        {children}
      </div>
    </div>
  );
}

// [P9] MarinaWaves ya no tiene <style> propio — keyframes viven en marina-styles
function MarinaWaves() {
  return (
    <>
      <div style={{
        position: 'absolute', top: -120, left: '20%', width: 520, height: 520,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, rgba(56,217,169,0.25) 0%, transparent 60%)',
        filter: 'blur(20px)',
        animation: 'marina-glow 26s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: -80, width: 420, height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,107,139,0.22) 0%, transparent 60%)',
        filter: 'blur(20px)',
        animation: 'marina-glow 30s ease-in-out infinite alternate-reverse',
      }} />
      <svg style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 120,
        opacity: 0.18, pointerEvents: 'none',
      }} viewBox="0 0 1180 120" preserveAspectRatio="none">
        <path d="M0,60 Q295,20 590,60 T1180,60 L1180,120 L0,120 Z" fill="#38d9a9" />
        <path d="M0,80 Q295,50 590,80 T1180,80 L1180,120 L0,120 Z" fill="#38d9a9" opacity="0.5" />
      </svg>
    </>
  );
}

function MarinaTopBar({ onBack, title, right }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, height: 72 }}>
      <button onClick={onBack} aria-label="volver" style={{
        width: 64, height: 64, borderRadius: 32,
        border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.08)', color: marinaTokens.ink,
        fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 32,
      }}>←</button>
      <h1 style={{
        margin: 0, fontFamily: marinaTokens.display,
        fontWeight: 700, fontSize: 38, letterSpacing: -1, color: marinaTokens.ink,
      }}>{title}</h1>
      <div style={{ flex: 1 }} />
      {right}
    </header>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
// [P10] Tile 'sigue' marcado visualmente como deshabilitado y no navega
const HOME_TILES = [
  { id: 'mira',     label: 'Mira y di',  sub: 'palabras',         emoji: '👀', accent: '#ff6b8b', active: true  },
  { id: 'memorama', label: 'Memorama',   sub: 'encuentra el par', emoji: '🃏', accent: '#38d9a9', active: true  },
  { id: 'frases',   label: 'Frases',     sub: 'arma una frase',   emoji: '💬', accent: '#ffd166', active: true  },
  { id: 'sigue',    label: 'Sigue',      sub: 'próximamente',     emoji: '🐾', accent: '#ff9b71', active: false },
];

function MarinaHome({ onNavigate }) {
  return (
    <MarinaShell>
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 36 }}>
        <h1 style={{
          fontFamily: marinaTokens.display, fontWeight: 800,
          fontSize: 60, letterSpacing: -2, margin: 0, color: marinaTokens.ink,
        }}>Hola, Emi</h1>
        <span style={{ fontFamily: marinaTokens.body, fontWeight: 400, fontSize: 18, color: marinaTokens.inkSoft }}>
          ¿qué quieres jugar?
        </span>
        <div style={{ flex: 1 }} />
        <MarinaLangPill />
      </header>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 22, height: 'calc(100% - 110px)',
      }}>
        {HOME_TILES.map(tile => (
          <HomeTile key={tile.id} tile={tile} onNavigate={onNavigate} />
        ))}
      </div>
    </MarinaShell>
  );
}

// [P12] Feedback táctil con onPointerDown/onPointerUp — funciona en iOS touch
function HomeTile({ tile, onNavigate }) {
  const [pressed, setPressed] = React.useState(false);
  const handlePress = () => {
    if (!tile.active) return;
    onNavigate(tile.id);
  };
  return (
    <button
      onClick={handlePress}
      disabled={!tile.active}
      onPointerDown={() => tile.active && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        background: marinaTokens.surface,
        border: 'none', borderRadius: marinaTokens.radiusLg,
        boxShadow: marinaTokens.shadow,
        padding: 28, position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        cursor: tile.active ? 'pointer' : 'default',
        textAlign: 'left',
        fontFamily: marinaTokens.body, color: marinaTokens.ink,
        transition: 'transform .18s ease, opacity .18s ease',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        opacity: tile.active ? 1 : 0.45,
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: tile.accent, opacity: 0.18, filter: 'blur(8px)',
      }} />
      <div style={{
        width: 96, height: 96, borderRadius: 28,
        background: tile.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 56, lineHeight: 1, position: 'relative',
        boxShadow: `0 12px 28px ${tile.accent}55`,
      }}>{tile.emoji}</div>
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: marinaTokens.display, fontWeight: 700,
          fontSize: 40, lineHeight: 1.05, color: marinaTokens.ink,
        }}>{tile.label}</div>
        <div style={{ fontWeight: 400, fontSize: 17, color: marinaTokens.inkSoft, marginTop: 4 }}>
          {tile.sub}
        </div>
      </div>
    </button>
  );
}

function MarinaLangPill() {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 4,
      borderRadius: 99, background: 'rgba(255,255,255,0.08)',
      fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 16,
    }}>
      <span style={{ padding: '8px 16px', borderRadius: 99, background: marinaTokens.primary, color: '#fff' }}>ES</span>
      <span style={{ padding: '8px 16px', borderRadius: 99, color: marinaTokens.inkSoft }}>EN</span>
    </div>
  );
}

// ─── Mira y di ────────────────────────────────────────────────────────────────
// [P11] MIRA_SET fuera del componente — no se recrea en cada render
const MIRA_SET = ['sandia', 'submarino', 'mariposa', 'globo', 'pez', 'tren', 'manzana', 'flor'];

function MarinaMira({ onNavigate, speak }) {
  const [idx, setIdx]     = React.useState(0);
  const [showEn, setShowEn] = React.useState(false);
  const v = byId[MIRA_SET[idx]];

  // [P12] Feedback táctil en botones de navegación
  const NavBtn = ({ children, onClick }) => {
    const [pressed, setPressed] = React.useState(false);
    return (
      <button
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        style={{
          width: 80, height: 80, borderRadius: 40, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', color: marinaTokens.ink,
          fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 40,
          transition: 'transform .15s',
          transform: pressed ? 'scale(0.93)' : 'scale(1)',
        }}
      >{children}</button>
    );
  };

  return (
    <MarinaShell>
      <MarinaTopBar onBack={() => onNavigate('home')} title="Mira y di" />
      <div style={{
        height: 'calc(100% - 96px)', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch',
      }}>
        {/* Arte */}
        <div style={{
          background: 'linear-gradient(160deg, #ff6b8b 0%, #ff8fa8 100%)',
          borderRadius: marinaTokens.radiusLg,
          boxShadow: marinaTokens.shadowDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.18 }} viewBox="0 0 200 200">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i}
                cx={20 + (i % 4) * 50} cy={30 + Math.floor(i / 4) * 60}
                rx="3" ry="6" fill="#0a1f27"
                transform={`rotate(${(i * 37) % 180} ${20 + (i % 4) * 50} ${30 + Math.floor(i / 4) * 60})`}
              />
            ))}
          </svg>
          <Picto id={v.id} size={300} style={{ position: 'relative', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))' }} />
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 13,
              color: marinaTokens.green, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8,
            }}>{idx + 1} · {MIRA_SET.length} · español</div>
            <div style={{
              fontFamily: marinaTokens.display, fontWeight: 800,
              fontSize: 110, lineHeight: 0.95, color: marinaTokens.ink,
              letterSpacing: -3, marginBottom: 16,
            }}>{v.es}</div>
            <button onClick={() => setShowEn(!showEn)} style={{
              padding: '10px 20px', borderRadius: 99,
              border: showEn ? `2px solid ${marinaTokens.green}` : '2px solid rgba(247,241,227,0.2)',
              background: showEn ? marinaTokens.green : 'transparent',
              color: showEn ? marinaTokens.inkOnLight : marinaTokens.ink,
              fontFamily: marinaTokens.body, fontWeight: 700, fontSize: 15,
              cursor: 'pointer', transition: 'all .25s',
            }}>
              {showEn ? `EN · ${v.en}` : 'mostrar en inglés'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <NavBtn onClick={() => { setShowEn(false); setIdx((idx - 1 + MIRA_SET.length) % MIRA_SET.length); }}>‹</NavBtn>
            <button
              onClick={() => speak(showEn ? v.en : v.es, { lang: showEn ? 'en-US' : 'es-MX' })}
              style={{
                flex: 1, height: 96, borderRadius: 48,
                border: 'none', cursor: 'pointer',
                background: marinaTokens.primary, color: '#fff',
                fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 28,
                boxShadow: `0 12px 32px ${marinaTokens.primary}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}
            ><span style={{ fontSize: 36 }}>🔊</span> escucha</button>
            <NavBtn onClick={() => { setShowEn(false); setIdx((idx + 1) % MIRA_SET.length); }}>›</NavBtn>
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
            {MIRA_SET.map((_, i) => (
              <span key={i} style={{
                width: i === idx ? 32 : 10, height: 6, borderRadius: 99,
                background: i === idx ? marinaTokens.green : 'rgba(247,241,227,0.18)',
                transition: 'all .35s',
              }} />
            ))}
          </div>
        </div>
      </div>
    </MarinaShell>
  );
}

// ─── Memorama ─────────────────────────────────────────────────────────────────
const MEMORAMA_IDS = ['sandia','submarino','mariposa','globo','pez','tren','manzana','platano','uva','barco','coche','flor'];

function MarinaMemorama({ onNavigate, speak }) {
  const [deck, setDeck]       = React.useState(() => buildMemoramaDeck(MEMORAMA_IDS));
  const [flipped, setFlipped] = React.useState(new Set());
  const [matched, setMatched] = React.useState(new Set());
  const [busy, setBusy]       = React.useState(false);

  // [P13] Index por key para O(1) en onCard
  const deckIndex = React.useMemo(
    () => new Map(deck.map(c => [c.key, c])),
    [deck]
  );

  const reset = () => {
    setDeck(buildMemoramaDeck(MEMORAMA_IDS));
    setFlipped(new Set()); setMatched(new Set()); setBusy(false);
  };

  const onCard = (key, vocabId) => {
    if (busy || flipped.has(key) || matched.has(key)) return;
    const nf = new Set(flipped); nf.add(key);
    setFlipped(nf);
    speak(byId[vocabId].es);
    if (nf.size === 2) {
      setBusy(true);
      const [a, b] = [...nf];
      // [P13] O(1) con Map en lugar de deck.find()
      const aVoc = deckIndex.get(a).vocabId;
      const bVoc = deckIndex.get(b).vocabId;
      if (aVoc === bVoc) {
        setTimeout(() => {
          const m = new Set(matched); m.add(a); m.add(b);
          setMatched(m); setFlipped(new Set()); setBusy(false);
        }, 700);
      } else {
        setTimeout(() => { setFlipped(new Set()); setBusy(false); }, 1100);
      }
    }
  };

  const allDone = matched.size === deck.length;

  return (
    <MarinaShell>
      <MarinaTopBar onBack={() => onNavigate('home')} title="Memorama"
        right={(
          <>
            <div style={{
              padding: '10px 18px', borderRadius: 99,
              background: 'rgba(255,255,255,0.08)',
              fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 16, marginRight: 10,
            }}>
              <span style={{ color: marinaTokens.inkSoft }}>pares · </span>
              <span style={{ color: marinaTokens.green }}>{matched.size / 2}/{deck.length / 2}</span>
            </div>
            <button onClick={reset} style={{
              padding: '12px 22px', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: marinaTokens.primary, color: '#fff',
              fontFamily: marinaTokens.body, fontWeight: 700, fontSize: 15,
            }}>↻ otra vez</button>
          </>
        )}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
        gap: 10, height: 'calc(100% - 96px)',
      }}>
        {deck.map((c) => {
          const isFlipped = flipped.has(c.key) || matched.has(c.key);
          const isMatched = matched.has(c.key);
          return (
            <button key={c.key} onClick={() => onCard(c.key, c.vocabId)} disabled={isMatched}
              style={{
                position: 'relative', perspective: 1200,
                background: 'transparent', border: 'none', padding: 0,
                cursor: isMatched ? 'default' : 'pointer',
              }}>
              <div style={{
                position: 'relative', width: '100%', height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform .55s cubic-bezier(.4,.0,.2,1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Reverso */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: marinaTokens.radiusMd,
                  background: `linear-gradient(135deg, ${marinaTokens.green} 0%, #1fa888 100%)`,
                  boxShadow: marinaTokens.shadow,
                  backfaceVisibility: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '4px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 28,
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 28, color: '#fff',
                  }}>?</div>
                </div>
                {/* Frente */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: marinaTokens.radiusMd,
                  background: marinaTokens.surfaceLight,
                  boxShadow: marinaTokens.shadow,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  border: isMatched ? `3px solid ${marinaTokens.primary}` : '3px solid transparent',
                  opacity: isMatched ? 0.7 : 1,
                  transition: 'all .3s',
                }}>
                  <Picto id={c.vocabId} size={84} />
                  <div style={{
                    fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 18,
                    color: marinaTokens.inkOnLight, marginTop: 4,
                  }}>{byId[c.vocabId].es}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allDone && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(6,42,53,0.85)', zIndex: 10, backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: marinaTokens.surfaceLight, borderRadius: marinaTokens.radiusLg,
            padding: '40px 56px', boxShadow: marinaTokens.shadowDeep,
            textAlign: 'center', fontFamily: marinaTokens.display, color: marinaTokens.inkOnLight,
          }}>
            <div style={{ fontSize: 80 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 44 }}>¡muy bien!</div>
            <button onClick={reset} style={{
              marginTop: 20, padding: '14px 28px', borderRadius: 99,
              border: 'none', cursor: 'pointer',
              background: marinaTokens.primary, color: '#fff',
              fontFamily: marinaTokens.body, fontWeight: 700, fontSize: 18,
            }}>otra vez</button>
          </div>
        </div>
      )}
    </MarinaShell>
  );
}

// ─── Frases ───────────────────────────────────────────────────────────────────
function MarinaFrases({ onNavigate, speak }) {
  const [active, setActive] = React.useState(0);
  const [built, setBuilt]   = React.useState([]);
  const phrase = PHRASES[active];

  const reset = () => setBuilt([]);

  // [P14] isComplete usa Set para verificar que todos los índices
  // estén presentes, sin importar el orden de toque.
  const isComplete = built.length === phrase.chunks.length &&
    new Set(built).size === phrase.chunks.length;

  const tapChunk = (i) => {
    if (built.includes(i)) return;
    const next = [...built, i];
    setBuilt(next);
    const [kind, val] = phrase.chunks[i];
    speak(kind === 'v' ? byId[val].es : val);
    if (next.length === phrase.chunks.length) {
      setTimeout(() => speak(phrase.es, { rate: 0.9 }), 800);
    }
  };

  return (
    <MarinaShell>
      <MarinaTopBar onBack={() => onNavigate('home')} title="Frases" />

      {/* Tira de construcción */}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: marinaTokens.radiusLg,
        border: '1px dashed rgba(247,241,227,0.18)',
        padding: 20, minHeight: 140, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minHeight: 100 }}>
          {built.length === 0 && (
            <div style={{ color: marinaTokens.inkSoft, fontWeight: 400, fontSize: 18 }}>
              toca las piezas en orden…
            </div>
          )}
          {built.map((i, slotIdx) => {
            const [kind, val] = phrase.chunks[i];
            return (
              <div key={slotIdx} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: kind === 'v' ? marinaTokens.primary : marinaTokens.gold,
                color: kind === 'v' ? '#fff' : marinaTokens.inkOnLight,
                borderRadius: 18, padding: '10px 16px',
              }}>
                {kind === 'v' && (
                  <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 4, display: 'flex' }}>
                    <Picto id={val} size={42} />
                  </div>
                )}
                <span style={{ fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 26 }}>
                  {kind === 'v' ? byId[val].es : val}
                </span>
              </div>
            );
          })}
        </div>
        <button onClick={() => speak(phrase.es)} disabled={!isComplete} style={{
          width: 84, height: 84, borderRadius: 42,
          border: 'none', cursor: isComplete ? 'pointer' : 'default',
          background: isComplete ? marinaTokens.green : 'rgba(56,217,169,0.2)',
          color: isComplete ? marinaTokens.inkOnLight : marinaTokens.inkSoft,
          fontSize: 38, opacity: isComplete ? 1 : 0.6, transition: 'all .3s',
        }} aria-label="leer frase">🔊</button>
        <button onClick={reset} style={{
          width: 56, height: 56, borderRadius: 28,
          border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', color: marinaTokens.inkSoft,
          fontSize: 24, fontFamily: marinaTokens.display, fontWeight: 700,
        }} aria-label="borrar">×</button>
      </div>

      {/* Piezas disponibles */}
      <div style={{
        background: marinaTokens.surface,
        borderRadius: marinaTokens.radiusLg,
        boxShadow: marinaTokens.shadow,
        padding: 24, marginBottom: 18,
      }}>
        <div style={{
          fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 13,
          textTransform: 'uppercase', letterSpacing: 3,
          color: marinaTokens.inkSoft, marginBottom: 14,
        }}>piezas</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {phrase.chunks.map(([kind, val], i) => {
            const used = built.includes(i);
            return (
              <button key={i} onClick={() => tapChunk(i)} disabled={used} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: used ? 'rgba(255,255,255,0.04)' : '#fff',
                color: marinaTokens.inkOnLight,
                border: 'none', borderRadius: 22, padding: '14px 22px',
                cursor: used ? 'default' : 'pointer',
                opacity: used ? 0.35 : 1, transition: 'all .25s',
                boxShadow: used ? 'none' : '0 6px 18px rgba(0,0,0,0.28)',
              }}>
                {kind === 'v' && <Picto id={val} size={64} />}
                <span style={{ fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 28 }}>
                  {kind === 'v' ? byId[val].es : val}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de frase */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PHRASES.map((p, i) => (
          <button key={p.id} onClick={() => { setActive(i); setBuilt([]); }} style={{
            padding: '10px 18px', borderRadius: 99,
            border: 'none', cursor: 'pointer',
            background: i === active ? marinaTokens.green : 'rgba(255,255,255,0.06)',
            color: i === active ? marinaTokens.inkOnLight : marinaTokens.ink,
            fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 14,
            transition: 'all .25s',
          }}>{p.es}</button>
        ))}
      </div>
    </MarinaShell>
  );
}

Object.assign(window, {
  MarinaHome, MarinaMira, MarinaMemorama, MarinaFrases, marinaTokens,
});

// marina.jsx — Direction B: deep ocean + watermelon

const marinaTokens = {
  bg: '#062a35',
  bgGrad: 'radial-gradient(ellipse at 30% 0%, #0d4858 0%, #062a35 60%, #03161c 100%)',
  surface: '#0e3a48',
  surfaceLight: '#fff',
  ink: '#f7f1e3',
  inkOnLight: '#0a1f27',
  inkSoft: 'rgba(247,241,227,0.62)',
  primary: '#ff6b8b',     // watermelon pink
  primarySoft: '#ffd9e1',
  green: '#38d9a9',       // fresh teal-green
  greenSoft: '#cdf5e8',
  gold: '#ffd166',
  goldSoft: '#fff0c2',
  coral: '#ff9b71',
  shadow: '0 10px 30px rgba(0,0,0,0.35)',
  shadowDeep: '0 20px 60px rgba(0,0,0,0.5)',
  display: '"Outfit", "Bricolage Grotesque", system-ui, sans-serif',
  body: '"Lexend", system-ui, sans-serif',
  radiusLg: 28,
  radiusMd: 20,
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

// Caustics + a slow drifting glow.
function MarinaWaves() {
  return (
    <>
      <style>{`
        @keyframes marina-glow { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(80px,40px) scale(1.15)} }
        @keyframes marina-rise { 0%{transform:translateY(0)} 100%{transform:translateY(-120px)} }
      `}</style>
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
      {/* sea-floor light caustic line */}
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

// ─── Home ───────────────────────────────────────────────────────────────────
function MarinaHome({ onNavigate }) {
  const tiles = [
    { id: 'mira',     label: 'Mira y di',  sub: 'palabras',         emoji: '👀', accent: marinaTokens.primary },
    { id: 'memorama', label: 'Memorama',   sub: 'encuentra el par', emoji: '🃏', accent: marinaTokens.green   },
    { id: 'frases',   label: 'Frases',     sub: 'arma una frase',   emoji: '💬', accent: marinaTokens.gold    },
    { id: 'sigue',    label: 'Sigue',      sub: 'pronto',           emoji: '🐾', accent: marinaTokens.coral   },
  ];
  return (
    <MarinaShell>
      <header style={{ display:'flex', alignItems:'baseline', gap: 16, marginBottom: 36 }}>
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
        {tiles.map(t => (
          <button key={t.id} onClick={() => onNavigate(t.id)} style={{
            background: marinaTokens.surface,
            border: 'none', borderRadius: marinaTokens.radiusLg,
            boxShadow: marinaTokens.shadow,
            padding: 28, position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'space-between',
            cursor: 'pointer', textAlign: 'left',
            fontFamily: marinaTokens.body, color: marinaTokens.ink,
            transition: 'transform .25s ease',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = ''}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            {/* accent splash */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              borderRadius: '50%', background: t.accent, opacity: 0.18,
              filter: 'blur(8px)',
            }} />
            <div style={{
              width: 96, height: 96, borderRadius: 28,
              background: t.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56, lineHeight: 1, position: 'relative',
              boxShadow: `0 12px 28px ${t.accent}55`,
            }}>{t.emoji}</div>
            <div style={{ position: 'relative' }}>
              <div style={{
                fontFamily: marinaTokens.display, fontWeight: 700,
                fontSize: 40, lineHeight: 1.05, color: marinaTokens.ink,
              }}>{t.label}</div>
              <div style={{ fontWeight: 400, fontSize: 17, color: marinaTokens.inkSoft, marginTop: 4 }}>
                {t.sub}
              </div>
            </div>
          </button>
        ))}
      </div>
    </MarinaShell>
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

// ─── Mira y di ─────────────────────────────────────────────────────────────
function MarinaMira({ onNavigate, speak }) {
  const set = ['sandia', 'submarino', 'mariposa', 'globo', 'pez', 'tren', 'manzana', 'flor'];
  const [idx, setIdx] = React.useState(0);
  const [showEn, setShowEn] = React.useState(false);
  const v = byId[set[idx]];

  return (
    <MarinaShell>
      <MarinaTopBar onBack={() => onNavigate('home')} title="Mira y di" />

      <div style={{
        height: 'calc(100% - 96px)', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch',
      }}>
        {/* Big art on watermelon-coral surface */}
        <div style={{
          background: `linear-gradient(160deg, #ff6b8b 0%, #ff8fa8 100%)`,
          borderRadius: marinaTokens.radiusLg,
          boxShadow: marinaTokens.shadowDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* seed pattern */}
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.18 }} viewBox="0 0 200 200">
            {Array.from({length: 12}).map((_, i) => (
              <ellipse key={i}
                cx={20 + (i % 4) * 50} cy={30 + Math.floor(i/4) * 60}
                rx="3" ry="6" fill="#0a1f27" transform={`rotate(${(i*37)%180} ${20 + (i % 4) * 50} ${30 + Math.floor(i/4) * 60})`} />
            ))}
          </svg>
          <Picto id={v.id} size={300} style={{ position:'relative', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 13,
              color: marinaTokens.green, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8,
            }}>{idx + 1} · {set.length} · español</div>
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
            <button onClick={() => { setShowEn(false); setIdx((idx-1+set.length)%set.length); }} style={{
              width: 80, height: 80, borderRadius: 40, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.08)', color: marinaTokens.ink,
              fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 40,
            }}>‹</button>
            <button onClick={() => speak(showEn ? v.en : v.es, { lang: showEn ? 'en-US' : 'es-MX' })} style={{
              flex: 1, height: 96, borderRadius: 48,
              border: 'none', cursor: 'pointer',
              background: marinaTokens.primary, color: '#fff',
              fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 28,
              boxShadow: `0 12px 32px ${marinaTokens.primary}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}><span style={{ fontSize: 36 }}>🔊</span> escucha</button>
            <button onClick={() => { setShowEn(false); setIdx((idx+1)%set.length); }} style={{
              width: 80, height: 80, borderRadius: 40, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.08)', color: marinaTokens.ink,
              fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 40,
            }}>›</button>
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
            {set.map((_, i) => (
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

// ─── Memorama ──────────────────────────────────────────────────────────────
function MarinaMemorama({ onNavigate, speak }) {
  const themeIds = ['sandia', 'submarino', 'mariposa', 'globo', 'pez', 'tren', 'manzana', 'platano', 'uva', 'barco', 'coche', 'flor'];
  const [deck, setDeck] = React.useState(() => buildMemoramaDeck(themeIds));
  const [flipped, setFlipped] = React.useState(new Set());
  const [matched, setMatched] = React.useState(new Set());
  const [busy, setBusy] = React.useState(false);

  const reset = () => {
    setDeck(buildMemoramaDeck(themeIds));
    setFlipped(new Set()); setMatched(new Set()); setBusy(false);
  };

  const onCard = (key, vocabId) => {
    if (busy || flipped.has(key) || matched.has(key)) return;
    const newFlipped = new Set(flipped); newFlipped.add(key);
    setFlipped(newFlipped); speak(byId[vocabId].es);
    if (newFlipped.size === 2) {
      setBusy(true);
      const [a, b] = [...newFlipped];
      const aVoc = deck.find(c => c.key === a).vocabId;
      const bVoc = deck.find(c => c.key === b).vocabId;
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
              fontFamily: marinaTokens.body, fontWeight: 600, fontSize: 16,
              marginRight: 10,
            }}>
              <span style={{ color: marinaTokens.inkSoft }}>pares · </span>
              <span style={{ color: marinaTokens.green }}>{matched.size / 2}/{deck.length / 2}</span>
            </div>
            <button onClick={reset} style={{
              padding: '12px 22px', borderRadius: 99,
              border: 'none', cursor: 'pointer',
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
                {/* back — watermelon-rind feel */}
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
                {/* front */}
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
            textAlign: 'center', fontFamily: marinaTokens.display,
            color: marinaTokens.inkOnLight,
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

// ─── Frases ────────────────────────────────────────────────────────────────
function MarinaFrases({ onNavigate, speak }) {
  const [active, setActive] = React.useState(0);
  const [built, setBuilt]   = React.useState([]);
  const phrase = PHRASES[active];

  const reset = () => setBuilt([]);
  const isComplete = built.length === phrase.chunks.length &&
    built.every((b, i) => b === i);

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

      {/* Strip */}
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
                  <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 4, display:'flex' }}>
                    <Picto id={val} size={42} />
                  </div>
                )}
                <span style={{
                  fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 26,
                }}>{kind === 'v' ? byId[val].es : val}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => speak(phrase.es)} disabled={!isComplete} style={{
          width: 84, height: 84, borderRadius: 42,
          border: 'none', cursor: isComplete ? 'pointer' : 'default',
          background: isComplete ? marinaTokens.green : 'rgba(56,217,169,0.2)',
          color: isComplete ? marinaTokens.inkOnLight : marinaTokens.inkSoft,
          fontSize: 38, opacity: isComplete ? 1 : 0.6,
          transition: 'all .3s',
        }} aria-label="leer frase">🔊</button>
        <button onClick={reset} style={{
          width: 56, height: 56, borderRadius: 28,
          border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', color: marinaTokens.inkSoft,
          fontSize: 24, fontFamily: marinaTokens.display, fontWeight: 700,
        }} aria-label="borrar">×</button>
      </div>

      {/* Chunks */}
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
                <span style={{
                  fontFamily: marinaTokens.display, fontWeight: 700, fontSize: 28,
                }}>{kind === 'v' ? byId[val].es : val}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phrase picker */}
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

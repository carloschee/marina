// cielo.jsx — Direction A: warm storybook sky
// Cream + sky blue + coral. Bricolage Grotesque + Quicksand.

const cieloTokens = {
  bg: 'linear-gradient(180deg, #fff8ec 0%, #fde7c5 100%)',
  bgFlat: '#fff8ec',
  surface: '#ffffff',
  ink: '#2d2520',
  inkSoft: '#6b5b50',
  primary: '#5b8def',     // sky blue
  primarySoft: '#dde8ff',
  coral: '#f08778',
  coralSoft: '#ffe1da',
  gold: '#f0c069',
  goldSoft: '#fdedcb',
  green: '#7fbf6e',
  greenSoft: '#e1f3da',
  shadow: '0 8px 30px rgba(76, 56, 32, 0.10)',
  shadowDeep: '0 16px 50px rgba(76, 56, 32, 0.16)',
  display: '"Bricolage Grotesque", "Outfit", system-ui, sans-serif',
  body: '"Quicksand", system-ui, sans-serif',
  radiusLg: 32,
  radiusMd: 22,
  radiusSm: 14,
};

function CieloShell({ children, density = 'comfy', noPadding = false }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: cieloTokens.bg,
      fontFamily: cieloTokens.body,
      color: cieloTokens.ink,
      position: 'relative', overflow: 'hidden',
      borderRadius: 0,
    }}>
      <CieloAurora />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: noPadding ? 0 : 36 }}>
        {children}
      </div>
    </div>
  );
}

// Slow-drifting balloons + soft sun glow in the bg of the home view.
function CieloAurora() {
  return (
    <>
      <style>{`
        @keyframes cielo-drift-a { 0%{transform:translate(0,0)} 100%{transform:translate(40px,-30px)} }
        @keyframes cielo-drift-b { 0%{transform:translate(0,0)} 100%{transform:translate(-30px,-40px)} }
        @keyframes cielo-rise    { 0%{transform:translateY(0) rotate(-2deg)} 100%{transform:translateY(-20px) rotate(2deg)} }
      `}</style>
      <div style={{
        position: 'absolute', top: -120, right: -80, width: 380, height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #ffd9a8 0%, transparent 65%)',
        filter: 'blur(8px)', opacity: 0.7,
        animation: 'cielo-drift-a 18s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, left: -60, width: 320, height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 60% 60%, #ffc7bd 0%, transparent 65%)',
        filter: 'blur(8px)', opacity: 0.55,
        animation: 'cielo-drift-b 22s ease-in-out infinite alternate',
      }} />
    </>
  );
}

// ─── Home / Module picker ───────────────────────────────────────────────────
function CieloHome({ onNavigate, density = 'comfy' }) {
  const tiles = [
    { id: 'mira',      label: 'Mira y di',  sub: 'palabras',        emoji: '👀', bg: cieloTokens.primarySoft, fg: cieloTokens.primary },
    { id: 'memorama', label: 'Memorama',   sub: 'encuentra el par', emoji: '🃏', bg: cieloTokens.coralSoft,   fg: cieloTokens.coral   },
    { id: 'frases',   label: 'Frases',     sub: 'arma una frase',   emoji: '💬', bg: cieloTokens.goldSoft,    fg: '#a87411'           },
    { id: 'sigue',    label: 'Sigue',      sub: 'pronto',           emoji: '🐾', bg: cieloTokens.greenSoft,   fg: '#3d7a30'           },
  ];
  const cols = density === 'compact' ? 4 : 2;
  return (
    <CieloShell density={density}>
      <header style={{ display:'flex', alignItems:'baseline', gap: 16, marginBottom: 28 }}>
        <h1 style={{
          fontFamily: cieloTokens.display, fontWeight: 800,
          fontSize: 56, letterSpacing: -1.5, margin: 0,
          color: cieloTokens.ink,
        }}>Hola, Emi</h1>
        <span style={{ fontFamily: cieloTokens.body, fontWeight: 600, fontSize: 18, color: cieloTokens.inkSoft }}>
          ¿qué quieres jugar hoy?
        </span>
        <div style={{ flex: 1 }} />
        <CieloLangPill />
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 24, height: 'calc(100% - 110px)',
      }}>
        {tiles.map(t => (
          <button key={t.id} onClick={() => onNavigate(t.id)} style={{
            background: cieloTokens.surface,
            border: 'none',
            borderRadius: cieloTokens.radiusLg,
            boxShadow: cieloTokens.shadow,
            padding: 28,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'space-between',
            cursor: 'pointer', textAlign: 'left',
            transition: 'transform .25s ease, box-shadow .25s ease',
            fontFamily: cieloTokens.body,
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = ''}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <div style={{
              width: 96, height: 96, borderRadius: 28,
              background: t.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 56, lineHeight: 1,
            }}>{t.emoji}</div>
            <div>
              <div style={{
                fontFamily: cieloTokens.display, fontWeight: 700,
                fontSize: 38, color: cieloTokens.ink, lineHeight: 1.05,
              }}>{t.label}</div>
              <div style={{ fontWeight: 600, fontSize: 17, color: cieloTokens.inkSoft, marginTop: 4 }}>
                {t.sub}
              </div>
            </div>
          </button>
        ))}
      </div>
    </CieloShell>
  );
}

function CieloLangPill() {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 4,
      borderRadius: 99, background: cieloTokens.surface,
      boxShadow: cieloTokens.shadow, fontFamily: cieloTokens.body,
      fontWeight: 700, fontSize: 16,
    }}>
      <span style={{
        padding: '8px 16px', borderRadius: 99,
        background: cieloTokens.primary, color: '#fff',
      }}>ES</span>
      <span style={{ padding: '8px 16px', borderRadius: 99, color: cieloTokens.inkSoft }}>EN</span>
    </div>
  );
}

// ─── Mira y di — flashcard ───────────────────────────────────────────────────
function CieloMira({ onNavigate, speak }) {
  const set = ['globo', 'mariposa', 'sandia', 'submarino', 'manzana', 'tren', 'flor', 'pez'];
  const [idx, setIdx] = React.useState(0);
  const [showEn, setShowEn] = React.useState(false);
  const v = byId[set[idx]];

  const next = () => { setShowEn(false); setIdx((idx + 1) % set.length); };
  const prev = () => { setShowEn(false); setIdx((idx - 1 + set.length) % set.length); };

  return (
    <CieloShell>
      <CieloTopBar onBack={() => onNavigate('home')} title="Mira y di" />

      <div style={{
        height: 'calc(100% - 96px)', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center',
      }}>
        {/* Big art */}
        <div style={{
          background: cieloTokens.surface,
          borderRadius: cieloTokens.radiusLg,
          boxShadow: cieloTokens.shadowDeep,
          height: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 24,
            border: `2px dashed ${cieloTokens.goldSoft}`, borderRadius: 24,
            pointerEvents: 'none',
          }} />
          <Picto id={v.id} size={280} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontFamily: cieloTokens.body, fontWeight: 700,
              fontSize: 16, color: cieloTokens.inkSoft,
              textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8,
            }}>Español</div>
            <div style={{
              fontFamily: cieloTokens.display, fontWeight: 800,
              fontSize: 100, lineHeight: 1, color: cieloTokens.ink,
              letterSpacing: -3, marginBottom: 28,
            }}>{v.es}</div>

            <button onClick={() => setShowEn(!showEn)} style={{
              alignSelf: 'flex-start',
              padding: '10px 20px', borderRadius: 99,
              border: 'none', cursor: 'pointer',
              background: showEn ? cieloTokens.primary : cieloTokens.primarySoft,
              color: showEn ? '#fff' : cieloTokens.primary,
              fontFamily: cieloTokens.body, fontWeight: 800, fontSize: 16,
              transition: 'all .25s',
            }}>
              {showEn ? `english · ${v.en}` : 'mostrar en inglés'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <CieloIconBtn onClick={prev} ariaLabel="anterior">‹</CieloIconBtn>
            <button onClick={() => speak(showEn ? v.en : v.es, { lang: showEn ? 'en-US' : 'es-MX' })} style={{
              flex: 1, height: 96, borderRadius: 96,
              border: 'none', cursor: 'pointer',
              background: cieloTokens.coral, color: '#fff',
              fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 28,
              boxShadow: cieloTokens.shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'transform .15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = ''}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <span style={{ fontSize: 36 }}>🔊</span> escucha
            </button>
            <CieloIconBtn onClick={next} ariaLabel="siguiente">›</CieloIconBtn>
          </div>

          {/* dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {set.map((_, i) => (
              <span key={i} style={{
                width: i === idx ? 32 : 10, height: 10, borderRadius: 99,
                background: i === idx ? cieloTokens.primary : 'rgba(0,0,0,0.12)',
                transition: 'all .35s ease',
              }} />
            ))}
          </div>
        </div>
      </div>
    </CieloShell>
  );
}

function CieloIconBtn({ onClick, children, ariaLabel }) {
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      width: 80, height: 80, borderRadius: 40,
      border: 'none', cursor: 'pointer',
      background: cieloTokens.surface,
      boxShadow: cieloTokens.shadow,
      fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 44,
      color: cieloTokens.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

function CieloTopBar({ onBack, title }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, height: 72,
    }}>
      <button onClick={onBack} aria-label="volver" style={{
        width: 64, height: 64, borderRadius: 32,
        border: 'none', cursor: 'pointer',
        background: cieloTokens.surface,
        boxShadow: cieloTokens.shadow,
        fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 32,
        color: cieloTokens.ink,
      }}>←</button>
      <h1 style={{
        margin: 0, fontFamily: cieloTokens.display,
        fontWeight: 800, fontSize: 38, letterSpacing: -1,
        color: cieloTokens.ink,
      }}>{title}</h1>
    </header>
  );
}

// ─── Memorama ──────────────────────────────────────────────────────────────
function CieloMemorama({ onNavigate, speak }) {
  const themeIds = ['globo', 'mariposa', 'sandia', 'submarino', 'manzana', 'tren', 'pez', 'sol', 'flor', 'fresa', 'coche', 'avion'];
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
    setFlipped(newFlipped);
    speak(byId[vocabId].es);
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
    <CieloShell>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, height: 72 }}>
        <button onClick={() => onNavigate('home')} aria-label="volver" style={{
          width: 64, height: 64, borderRadius: 32,
          border: 'none', cursor: 'pointer',
          background: cieloTokens.surface, boxShadow: cieloTokens.shadow,
          fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 32,
        }}>←</button>
        <h1 style={{ margin: 0, fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 38, letterSpacing: -1 }}>
          Memorama
        </h1>
        <div style={{ flex: 1 }} />
        <div style={{
          padding: '10px 18px', borderRadius: 99,
          background: cieloTokens.surface, boxShadow: cieloTokens.shadow,
          fontFamily: cieloTokens.body, fontWeight: 800, fontSize: 18,
        }}>
          <span style={{ color: cieloTokens.inkSoft }}>pares · </span>
          <span style={{ color: cieloTokens.coral }}>{matched.size / 2}/{deck.length / 2}</span>
        </div>
        <button onClick={reset} style={{
          padding: '12px 22px', borderRadius: 99,
          border: 'none', cursor: 'pointer',
          background: cieloTokens.coral, color: '#fff',
          fontFamily: cieloTokens.body, fontWeight: 800, fontSize: 16,
          boxShadow: cieloTokens.shadow,
        }}>↻ otra vez</button>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
        gap: 12, height: 'calc(100% - 96px)',
      }}>
        {deck.map((c) => {
          const isFlipped = flipped.has(c.key) || matched.has(c.key);
          const isMatched = matched.has(c.key);
          return (
            <button key={c.key} onClick={() => onCard(c.key, c.vocabId)}
              disabled={isMatched}
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
                {/* back */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: cieloTokens.radiusMd,
                  background: `linear-gradient(135deg, ${cieloTokens.primary} 0%, #7aa6f7 100%)`,
                  boxShadow: cieloTokens.shadow,
                  backfaceVisibility: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 28,
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 28, color: '#fff',
                  }}>?</div>
                </div>
                {/* front */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: cieloTokens.radiusMd,
                  background: cieloTokens.surface,
                  boxShadow: cieloTokens.shadow,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  border: isMatched ? `3px solid ${cieloTokens.green}` : '3px solid transparent',
                  opacity: isMatched ? 0.7 : 1,
                  transition: 'opacity .3s, border-color .3s',
                }}>
                  <Picto id={c.vocabId} size={84} />
                  <div style={{
                    fontFamily: cieloTokens.display, fontWeight: 700, fontSize: 18,
                    color: cieloTokens.ink, marginTop: 4,
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
          background: 'rgba(255, 248, 236, 0.85)', zIndex: 10,
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: cieloTokens.surface, borderRadius: cieloTokens.radiusLg,
            padding: '40px 56px', boxShadow: cieloTokens.shadowDeep,
            textAlign: 'center', fontFamily: cieloTokens.display,
          }}>
            <div style={{ fontSize: 80 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 44, color: cieloTokens.ink }}>¡muy bien!</div>
            <button onClick={reset} style={{
              marginTop: 20, padding: '14px 28px', borderRadius: 99,
              border: 'none', cursor: 'pointer',
              background: cieloTokens.coral, color: '#fff',
              fontFamily: cieloTokens.body, fontWeight: 800, fontSize: 18,
            }}>otra vez</button>
          </div>
        </div>
      )}
    </CieloShell>
  );
}

// ─── Frases ────────────────────────────────────────────────────────────────
function CieloFrases({ onNavigate, speak }) {
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

  const switchPhrase = (i) => { setActive(i); setBuilt([]); };

  return (
    <CieloShell>
      <CieloTopBar onBack={() => onNavigate('home')} title="Frases" />

      {/* Strip — what's been built */}
      <div style={{
        background: cieloTokens.surface,
        borderRadius: cieloTokens.radiusLg,
        boxShadow: cieloTokens.shadow,
        padding: 20, minHeight: 140, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minHeight: 100 }}>
          {built.length === 0 && (
            <div style={{ color: cieloTokens.inkSoft, fontWeight: 600, fontSize: 18, fontStyle: 'italic' }}>
              toca las piezas de abajo en orden…
            </div>
          )}
          {built.map((i, slotIdx) => {
            const [kind, val] = phrase.chunks[i];
            return (
              <div key={slotIdx} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: kind === 'v' ? cieloTokens.primarySoft : cieloTokens.goldSoft,
                borderRadius: 18, padding: '10px 16px',
                animation: 'cielo-rise .35s ease-out',
              }}>
                {kind === 'v' && <Picto id={val} size={48} />}
                <span style={{
                  fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 28,
                  color: cieloTokens.ink,
                }}>{kind === 'v' ? byId[val].es : val}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => speak(phrase.es)} disabled={!isComplete} style={{
          width: 84, height: 84, borderRadius: 42,
          border: 'none', cursor: isComplete ? 'pointer' : 'default',
          background: isComplete ? cieloTokens.coral : cieloTokens.coralSoft,
          color: '#fff', fontSize: 38,
          opacity: isComplete ? 1 : 0.5,
          transition: 'all .3s',
        }} aria-label="leer frase">🔊</button>
        <button onClick={reset} style={{
          width: 56, height: 56, borderRadius: 28,
          border: 'none', cursor: 'pointer',
          background: cieloTokens.bgFlat, color: cieloTokens.inkSoft,
          fontSize: 24, fontFamily: cieloTokens.display, fontWeight: 700,
        }} aria-label="borrar">×</button>
      </div>

      {/* Chunks — pieces to tap */}
      <div style={{
        background: cieloTokens.surface,
        borderRadius: cieloTokens.radiusLg,
        boxShadow: cieloTokens.shadow,
        padding: 24, marginBottom: 20,
      }}>
        <div style={{
          fontFamily: cieloTokens.body, fontWeight: 700, fontSize: 14,
          textTransform: 'uppercase', letterSpacing: 2,
          color: cieloTokens.inkSoft, marginBottom: 14,
        }}>piezas</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {phrase.chunks.map(([kind, val], i) => {
            const used = built.includes(i);
            return (
              <button key={i} onClick={() => tapChunk(i)} disabled={used} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: used ? '#f4f0ea' : (kind === 'v' ? cieloTokens.primarySoft : cieloTokens.goldSoft),
                border: 'none', borderRadius: 22, padding: '14px 22px',
                cursor: used ? 'default' : 'pointer',
                opacity: used ? 0.4 : 1,
                transition: 'all .25s',
                boxShadow: used ? 'none' : '0 4px 14px rgba(76,56,32,0.10)',
              }}>
                {kind === 'v' && <Picto id={val} size={64} />}
                <span style={{
                  fontFamily: cieloTokens.display, fontWeight: 800, fontSize: 30,
                  color: cieloTokens.ink,
                }}>{kind === 'v' ? byId[val].es : val}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phrase picker */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {PHRASES.map((p, i) => (
          <button key={p.id} onClick={() => switchPhrase(i)} style={{
            padding: '10px 18px', borderRadius: 99,
            border: 'none', cursor: 'pointer',
            background: i === active ? cieloTokens.ink : cieloTokens.surface,
            color: i === active ? '#fff' : cieloTokens.ink,
            fontFamily: cieloTokens.body, fontWeight: 700, fontSize: 15,
            boxShadow: i === active ? 'none' : cieloTokens.shadow,
            transition: 'all .25s',
          }}>{p.es}</button>
        ))}
      </div>
    </CieloShell>
  );
}

Object.assign(window, {
  CieloHome, CieloMira, CieloMemorama, CieloFrases, cieloTokens,
});

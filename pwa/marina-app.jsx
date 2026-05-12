// marina-app.jsx — PWA entry, fullscreen Marina mount with screen navigation
// and locally-persisted Tweaks (palette / density / TTS settings).

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "density": "comfy",
  "ttsVolume": 0.9,
  "ttsRate": 0.85,
  "ttsMuted": false,
  "ttsLang": "es-MX"
}/*EDITMODE-END*/;

const PALETTES = {
  warm:    { pink: '#ff6b8b', green: '#38d9a9' },
  pastel:  { pink: '#ffa3b8', green: '#7be0c2' },
  vivid:   { pink: '#ff3d6a', green: '#0fbf8c' },
  neutral: { pink: '#d97c93', green: '#7da89a' },
};

// LocalStorage-backed tweaks (the design canvas version persists via host
// postMessage; standalone PWA needs its own store).
function useLocalTweaks(defaults) {
  const KEY = 'dotir.tweaks.v1';
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch { return defaults; }
  });
  const set = React.useCallback((keyOrObj, value) => {
    setState((prev) => {
      const patch = typeof keyOrObj === 'string' ? { [keyOrObj]: value } : keyOrObj;
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  return [state, set];
}

function MarinaApp() {
  const [t, setTweak] = useLocalTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('home');
  const tts = useTTS();

  // Keep TTS settings in sync
  React.useEffect(() => {
    tts.configure({
      volume: t.ttsMuted ? 0 : t.ttsVolume,
      rate: t.ttsRate,
      voice: t.ttsLang,
      muted: t.ttsMuted,
    });
  }, [t.ttsMuted, t.ttsVolume, t.ttsRate, t.ttsLang, tts]);

  // Re-apply palette to the marina tokens module
  React.useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.warm;
    if (typeof marinaTokens !== 'undefined') {
      marinaTokens.primary = p.pink;
      marinaTokens.green = p.green;
    }
  }, [t.palette]);

  const Screen = {
    home:     MarinaHome,
    mira:     MarinaMira,
    memorama: MarinaMemorama,
    frases:   MarinaFrases,
  }[screen] || MarinaHome;

  // Hidden 5-tap gesture in the corner unlocks the Tweaks panel (parent area).
  const [tapCount, setTapCount] = React.useState(0);
  const [showTweaks, setShowTweaks] = React.useState(false);
  const [pinInput, setPinInput] = React.useState('');
  const [pinError, setPinError] = React.useState(false);
  const PARENT_PIN = '1234'; // TODO: parent can change this in a future Ajustes screen

  React.useEffect(() => {
    if (tapCount >= 5) {
      setShowTweaks('pin');
      setTapCount(0);
    }
    if (tapCount > 0) {
      const t = setTimeout(() => setTapCount(0), 1500);
      return () => clearTimeout(t);
    }
  }, [tapCount]);

  return (
    <div className="dotir-stage">
      <Screen
        onNavigate={setScreen}
        density={t.density}
        speak={tts.speak}
      />
      {/* Hidden parent-area trigger — bottom-right corner */}
      <button
        onClick={() => setTapCount(c => c + 1)}
        aria-label="área de adultos"
        style={{
          position: 'absolute', right: 0, bottom: 0,
          width: 56, height: 56,
          background: 'transparent', border: 'none',
          cursor: 'default', opacity: 0,
        }}
      />
      {showTweaks === 'pin' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(3, 22, 28, 0.86)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            background: '#0e3a48', padding: 36, borderRadius: 28,
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            fontFamily: '"Lexend", system-ui, sans-serif', color: '#f7f1e3',
            minWidth: 340, textAlign: 'center',
          }}>
            <div style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
              Área de adultos
            </div>
            <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 22 }}>
              Ingresa el PIN para abrir ajustes
            </div>
            <input
              type="password" inputMode="numeric" pattern="[0-9]*"
              autoFocus value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (pinInput === PARENT_PIN) { setShowTweaks('open'); setPinInput(''); }
                  else setPinError(true);
                }
              }}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                border: pinError ? '2px solid #ff6b8b' : '2px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.25)', color: '#f7f1e3',
                fontSize: 22, fontFamily: 'inherit', textAlign: 'center',
                letterSpacing: 8, marginBottom: 16,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowTweaks(false); setPinInput(''); setPinError(false); }}
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: 99,
                  border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.08)', color: '#f7f1e3',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 15,
                }}>cancelar</button>
              <button onClick={() => {
                  if (pinInput === PARENT_PIN) { setShowTweaks('open'); setPinInput(''); }
                  else setPinError(true);
                }}
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: 99,
                  border: 'none', cursor: 'pointer',
                  background: '#38d9a9', color: '#0a1f27',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
                }}>abrir</button>
            </div>
            {pinError && (
              <div style={{ marginTop: 12, color: '#ff6b8b', fontSize: 13 }}>
                PIN incorrecto
              </div>
            )}
          </div>
        </div>
      )}
      {showTweaks === 'open' && (
        <TweaksPanel forceOpen onClose={() => setShowTweaks(false)}>
          <TweakSection label="Apariencia" />
          <TweakRadio label="Paleta" value={t.palette}
            options={['warm', 'pastel', 'vivid', 'neutral']}
            onChange={(v) => setTweak('palette', v)} />
          <TweakRadio label="Densidad" value={t.density}
            options={['compact', 'comfy']}
            onChange={(v) => setTweak('density', v)} />

          <TweakSection label="Voz (TTS)" />
          <TweakToggle label="Silenciar voz" value={t.ttsMuted}
            onChange={(v) => setTweak('ttsMuted', v)} />
          <TweakSlider label="Volumen" value={t.ttsVolume} min={0} max={1} step={0.05}
            onChange={(v) => setTweak('ttsVolume', v)} />
          <TweakSlider label="Velocidad" value={t.ttsRate} min={0.5} max={1.4} step={0.05}
            onChange={(v) => setTweak('ttsRate', v)} />
          <TweakRadio label="Idioma TTS" value={t.ttsLang}
            options={['es-MX', 'es-ES', 'en-US']}
            onChange={(v) => setTweak('ttsLang', v)} />
        </TweaksPanel>
      )}
    </div>
  );
}

function __mountDotir() {
  if (typeof MarinaHome === 'undefined' || typeof useTTS === 'undefined') {
    return setTimeout(__mountDotir, 30);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<MarinaApp />);
}
__mountDotir();

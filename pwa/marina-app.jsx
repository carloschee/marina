// marina-app.jsx — PWA entry, fullscreen Marina mount con navegación,
// tweaks persistidos en localStorage, y área de adultos PIN-gated.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "density": "comfy",
  "ttsVolume": 0.9,
  "ttsRate": 0.85,
  "ttsMuted": false,
  "ttsLang": "es-MX"
}/*EDITMODE-END*/;

const PALETTES = {
  warm:    { primary: '#ff6b8b', green: '#38d9a9' },
  pastel:  { primary: '#ffa3b8', green: '#7be0c2' },
  vivid:   { primary: '#ff3d6a', green: '#0fbf8c' },
  neutral: { primary: '#d97c93', green: '#7da89a' },
};

// [P4] KEY renombrado a 'marina.tweaks.v1' (ya no 'dotir')
// [P5] PIN leído de localStorage para que el padre pueda cambiarlo
//      desde la pantalla de ajustes sin tocar código.
const TWEAKS_KEY = 'marina.tweaks.v1';
const PIN_KEY    = 'marina.pin.v1';
const PIN_DEFAULT = '1234';

function useLocalTweaks(defaults) {
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(TWEAKS_KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch { return defaults; }
  });
  const set = React.useCallback((keyOrObj, value) => {
    setState((prev) => {
      const patch = typeof keyOrObj === 'string' ? { [keyOrObj]: value } : keyOrObj;
      const next = { ...prev, ...patch };
      try { localStorage.setItem(TWEAKS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  return [state, set];
}

// [P7] Paleta como React context — los componentes suscritos re-renderizan
// cuando cambia la paleta, sin mutar marinaTokens directamente.
const PaletteContext = React.createContext(PALETTES.warm);

function MarinaApp() {
  const [t, setTweak] = useLocalTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('home');
  const tts = useTTS();

  // Sincroniza TTS con tweaks
  React.useEffect(() => {
    tts.configure({
      volume: t.ttsMuted ? 0 : t.ttsVolume,
      rate:   t.ttsRate,
      voice:  t.ttsLang,
      muted:  t.ttsMuted,
    });
  }, [t.ttsMuted, t.ttsVolume, t.ttsRate, t.ttsLang]);

  // [P7] Paleta via context, no mutación de marinaTokens
  const palette = PALETTES[t.palette] || PALETTES.warm;

  const Screen = {
    home:     MarinaHome,
    mira:     MarinaMira,
    memorama: MarinaMemorama,
    frases:   MarinaFrases,
  }[screen] || MarinaHome;

  // Área de adultos: gesto 5 toques esquina inferior derecha
  const [tapCount, setTapCount] = React.useState(0);
  const [showTweaks, setShowTweaks] = React.useState(false); // false | 'pin' | 'open'
  const [pinInput, setPinInput]   = React.useState('');
  const [pinError, setPinError]   = React.useState(false);

  // [P5] PIN dinámico desde localStorage
  const parentPin = React.useMemo(() => {
    try { return localStorage.getItem(PIN_KEY) || PIN_DEFAULT; } catch { return PIN_DEFAULT; }
  }, [showTweaks]); // re-lee cuando se abre el panel por si se cambió

  React.useEffect(() => {
    if (tapCount >= 5) { setShowTweaks('pin'); setTapCount(0); }
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  const checkPin = () => {
    if (pinInput === parentPin) { setShowTweaks('open'); setPinInput(''); }
    else setPinError(true);
  };

  return (
    <PaletteContext.Provider value={palette}>
      <div className="dotir-stage">
        <Screen onNavigate={setScreen} density={t.density} speak={tts.speak} />

        {/* Trigger oculto — esquina inferior derecha */}
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

        {/* Modal PIN */}
        {showTweaks === 'pin' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(3,22,28,0.86)', backdropFilter: 'blur(12px)',
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
                onKeyDown={(e) => { if (e.key === 'Enter') checkPin(); }}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  border: pinError ? '2px solid #ff6b8b' : '2px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.25)', color: '#f7f1e3',
                  fontSize: 22, fontFamily: 'inherit', textAlign: 'center',
                  letterSpacing: 8, marginBottom: 16, boxSizing: 'border-box',
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
                <button onClick={checkPin}
                  style={{
                    flex: 1, padding: '12px 18px', borderRadius: 99,
                    border: 'none', cursor: 'pointer',
                    background: '#38d9a9', color: '#0a1f27',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: 15,
                  }}>abrir</button>
              </div>
              {pinError && (
                <div style={{ marginTop: 12, color: '#ff6b8b', fontSize: 13 }}>PIN incorrecto</div>
              )}
            </div>
          </div>
        )}

        {/* [P6 / P18] Panel de ajustes con forceOpen real */}
        {showTweaks === 'open' && (
          <MarinaAjustes
            t={t} setTweak={setTweak}
            onClose={() => setShowTweaks(false)}
            pinKey={PIN_KEY}
          />
        )}
      </div>
    </PaletteContext.Provider>
  );
}

// [P6 / P18] Panel de ajustes propio para modo PWA standalone.
// No depende del protocolo postMessage de TweaksPanel (diseñado para
// el design canvas, no para la app instalada).
function MarinaAjustes({ t, setTweak, onClose, pinKey }) {
  const [newPin, setNewPin]       = React.useState('');
  const [pinMsg, setPinMsg]       = React.useState('');

  const savePin = () => {
    if (!/^\d{4,8}$/.test(newPin)) { setPinMsg('El PIN debe tener 4-8 dígitos'); return; }
    try { localStorage.setItem(pinKey, newPin); } catch {}
    setNewPin(''); setPinMsg('PIN guardado ✓');
    setTimeout(() => setPinMsg(''), 2000);
  };

  const s = {
    overlay: {
      position: 'absolute', inset: 0,
      background: 'rgba(3,22,28,0.9)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10001,
    },
    panel: {
      background: '#0e3a48', borderRadius: 28,
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      fontFamily: '"Lexend", system-ui, sans-serif', color: '#f7f1e3',
      width: 480, maxHeight: '90%', overflow: 'auto',
      padding: 36,
    },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: 26, margin: '0 0 24px' },
    section: { fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(247,241,227,0.45)', margin: '24px 0 10px' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    label: { fontWeight: 500, fontSize: 15 },
    seg: { display: 'flex', gap: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, padding: 3 },
    segBtn: (active) => ({
      padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
      background: active ? '#38d9a9' : 'transparent',
      color: active ? '#0a1f27' : '#f7f1e3',
      fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
    }),
    toggle: (on) => ({
      width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
      background: on ? '#38d9a9' : 'rgba(255,255,255,0.15)',
      position: 'relative', flexShrink: 0, transition: 'background .2s',
    }),
    thumb: (on) => ({
      position: 'absolute', top: 3, left: on ? 23 : 3,
      width: 18, height: 18, borderRadius: 99,
      background: '#fff', transition: 'left .2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    }),
    slider: { width: '100%', accentColor: '#38d9a9', marginTop: 6 },
    input: {
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid rgba(255,255,255,0.12)',
      background: 'rgba(0,0,0,0.2)', color: '#f7f1e3',
      fontFamily: 'inherit', fontSize: 15, boxSizing: 'border-box',
      marginTop: 8,
    },
    btn: (primary) => ({
      padding: '11px 20px', borderRadius: 99, border: 'none', cursor: 'pointer',
      background: primary ? '#38d9a9' : 'rgba(255,255,255,0.08)',
      color: primary ? '#0a1f27' : '#f7f1e3',
      fontFamily: 'inherit', fontWeight: 700, fontSize: 14, marginTop: 8,
    }),
  };

  const Toggle = ({ value, onChange }) => (
    <button style={s.toggle(value)} onClick={() => onChange(!value)} role="switch" aria-checked={value}>
      <i style={s.thumb(value)} />
    </button>
  );

  const Seg = ({ value, options, onChange }) => (
    <div style={s.seg}>
      {options.map(o => (
        <button key={o} style={s.segBtn(value === o)} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );

  return (
    <div style={s.overlay}>
      <div style={s.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={s.h2}>Ajustes</div>
          <button onClick={onClose} style={{ ...s.btn(false), marginTop: 0, fontSize: 22, padding: '4px 12px' }}>×</button>
        </div>

        <div style={s.section}>Apariencia</div>
        <div style={s.row}>
          <span style={s.label}>Paleta</span>
          <Seg value={t.palette} options={['warm','pastel','vivid','neutral']} onChange={v => setTweak('palette', v)} />
        </div>
        <div style={s.row}>
          <span style={s.label}>Densidad</span>
          <Seg value={t.density} options={['compact','comfy']} onChange={v => setTweak('density', v)} />
        </div>

        <div style={s.section}>Voz (TTS)</div>
        <div style={s.row}>
          <span style={s.label}>Silenciar voz</span>
          <Toggle value={t.ttsMuted} onChange={v => setTweak('ttsMuted', v)} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ ...s.row, marginBottom: 4 }}>
            <span style={s.label}>Volumen</span>
            <span style={{ opacity: 0.5, fontSize: 13 }}>{Math.round(t.ttsVolume * 100)}%</span>
          </div>
          <input type="range" style={s.slider} min={0} max={1} step={0.05}
            value={t.ttsVolume} onChange={e => setTweak('ttsVolume', +e.target.value)} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ ...s.row, marginBottom: 4 }}>
            <span style={s.label}>Velocidad</span>
            <span style={{ opacity: 0.5, fontSize: 13 }}>{t.ttsRate}×</span>
          </div>
          <input type="range" style={s.slider} min={0.5} max={1.4} step={0.05}
            value={t.ttsRate} onChange={e => setTweak('ttsRate', +e.target.value)} />
        </div>
        <div style={s.row}>
          <span style={s.label}>Idioma TTS</span>
          <Seg value={t.ttsLang} options={['es-MX','es-ES','en-US']} onChange={v => setTweak('ttsLang', v)} />
        </div>

        <div style={s.section}>Seguridad</div>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 8 }}>
          Cambiar PIN (4–8 dígitos)
        </div>
        <input
          type="password" inputMode="numeric" pattern="[0-9]*"
          placeholder="nuevo PIN" value={newPin}
          onChange={e => { setNewPin(e.target.value); setPinMsg(''); }}
          style={s.input}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={savePin} style={s.btn(true)}>Guardar PIN</button>
        </div>
        {pinMsg && <div style={{ marginTop: 8, fontSize: 13, color: pinMsg.includes('✓') ? '#38d9a9' : '#ff6b8b' }}>{pinMsg}</div>}
      </div>
    </div>
  );
}

// [P8] Montaje vía polling real contra MarinaHome + useTTS,
// sin setTimeout arbitrario de 30ms que podía montar antes de tiempo.
function __mountMarina() {
  if (typeof MarinaHome === 'undefined' || typeof useTTS === 'undefined') {
    return setTimeout(__mountMarina, 50);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<MarinaApp />);
}
__mountMarina();

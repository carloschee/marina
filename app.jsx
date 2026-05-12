// app.jsx — DesignCanvas + tweaks wiring + interactive prototype mounting

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "density": "comfy",
  "ttsVolume": 0.9,
  "ttsRate": 0.85,
  "ttsMuted": false,
  "ttsLang": "es-MX"
}/*EDITMODE-END*/;

// Per-direction palette tweaks (applied via CSS vars on the artboard root)
const PALETTES = {
  warm:    { cieloPrimary: '#5b8def', cieloCoral: '#f08778', marinaPink: '#ff6b8b', marinaGreen: '#38d9a9' },
  pastel:  { cieloPrimary: '#a3b9ff', cieloCoral: '#ffa99d', marinaPink: '#ffa3b8', marinaGreen: '#7be0c2' },
  vivid:   { cieloPrimary: '#3a6df0', cieloCoral: '#ff5f4a', marinaPink: '#ff3d6a', marinaGreen: '#0fbf8c' },
  neutral: { cieloPrimary: '#6b7a8f', cieloCoral: '#c89890', marinaPink: '#d97c93', marinaGreen: '#7da89a' },
};

// A self-contained interactive app with home + 3 modules + tweakable density.
// Used inside each artboard.
function MiniApp({ direction, initialScreen = 'home', density, speak }) {
  const [screen, setScreen] = React.useState(initialScreen);
  const onNavigate = React.useCallback((s) => setScreen(s), []);

  const components = direction === 'cielo'
    ? { home: CieloHome, mira: CieloMira, memorama: CieloMemorama, frases: CieloFrases }
    : { home: MarinaHome, mira: MarinaMira, memorama: MarinaMemorama, frases: MarinaFrases };

  // 'sigue' is shown as a "soon" tile on home — no screen yet
  const Comp = components[screen] || components.home;

  return <Comp onNavigate={onNavigate} density={density} speak={speak} />;
}

// Wrap the artboard's content. The artboard is a fixed 1180×820 frame
// representing iPad Air 4 landscape (CSS px). Content fills it.
function Artboard({ children, palette }) {
  // Inject palette CSS vars so tokens can read them. (We don't actually
  // wire tokens to vars here — keeping it simple — but the palette setter
  // does affect freshly-rendered components when their token references
  // change at runtime via the swatches below.)
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {children}
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tts = useTTS();

  React.useEffect(() => {
    tts.configure({
      volume: t.ttsMuted ? 0 : t.ttsVolume,
      voice: t.ttsLang,
      muted: t.ttsMuted,
    });
  }, [t.ttsMuted, t.ttsVolume, t.ttsLang, tts]);

  // Apply palette swap by mutating tokens directly (so all subsequent
  // re-renders pick up new accents).
  React.useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.warm;
    if (typeof cieloTokens !== 'undefined') {
      cieloTokens.primary = p.cieloPrimary;
      cieloTokens.coral = p.cieloCoral;
    }
    if (typeof marinaTokens !== 'undefined') {
      marinaTokens.primary = p.marinaPink;
      marinaTokens.green = p.marinaGreen;
    }
    // Force a small re-render of children by bumping a key on the canvas.
    setRenderKey(k => k + 1);
  }, [t.palette]);

  const [renderKey, setRenderKey] = React.useState(0);

  return (
    <>
      <DesignCanvas key={renderKey}>
        <DCSection id="marina" title="Marina"
          subtitle="deep ocean + watermelon · teal + watermelon pink + fresh green · Outfit + Lexend">
          <DCArtboard id="marina-home" label="Inicio" width={1180} height={820}>
            <Artboard><MiniApp direction="marina" initialScreen="home" density={t.density} speak={tts.speak} /></Artboard>
          </DCArtboard>
          <DCArtboard id="marina-mira" label="Mira y di" width={1180} height={820}>
            <Artboard><MiniApp direction="marina" initialScreen="mira" density={t.density} speak={tts.speak} /></Artboard>
          </DCArtboard>
          <DCArtboard id="marina-memorama" label="Memorama" width={1180} height={820}>
            <Artboard><MiniApp direction="marina" initialScreen="memorama" density={t.density} speak={tts.speak} /></Artboard>
          </DCArtboard>
          <DCArtboard id="marina-frases" label="Frases" width={1180} height={820}>
            <Artboard><MiniApp direction="marina" initialScreen="frases" density={t.density} speak={tts.speak} /></Artboard>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Apariencia" />
        <TweakColor label="Paleta de acentos"
          value={(() => {
            const m = {
              warm:    ['#5b8def', '#f08778', '#ff6b8b', '#38d9a9'],
              pastel:  ['#a3b9ff', '#ffa99d', '#ffa3b8', '#7be0c2'],
              vivid:   ['#3a6df0', '#ff5f4a', '#ff3d6a', '#0fbf8c'],
              neutral: ['#6b7a8f', '#c89890', '#d97c93', '#7da89a'],
            };
            return m[t.palette] || m.warm;
          })()}
          options={[
            ['#5b8def', '#f08778', '#ff6b8b', '#38d9a9'],
            ['#a3b9ff', '#ffa99d', '#ffa3b8', '#7be0c2'],
            ['#3a6df0', '#ff5f4a', '#ff3d6a', '#0fbf8c'],
            ['#6b7a8f', '#c89890', '#d97c93', '#7da89a'],
          ]}
          onChange={(v) => {
            const keys = ['warm','pastel','vivid','neutral'];
            const idx = [
              ['#5b8def', '#f08778', '#ff6b8b', '#38d9a9'],
              ['#a3b9ff', '#ffa99d', '#ffa3b8', '#7be0c2'],
              ['#3a6df0', '#ff5f4a', '#ff3d6a', '#0fbf8c'],
              ['#6b7a8f', '#c89890', '#d97c93', '#7da89a'],
            ].findIndex(p => JSON.stringify(p) === JSON.stringify(v));
            setTweak('palette', keys[idx] ?? 'warm');
          }}
        />
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
    </>
  );
}

// useTweaks needs to be wrapped because we need a custom palette swatch
// onChange that includes the index. Re-implement minimally if needed.
// (TweakColor's onChange signature is (value, index) — confirm in the lib.)

function __mountDotir() {
  if (typeof DesignCanvas === 'undefined' || typeof CieloHome === 'undefined' ||
      typeof MarinaHome === 'undefined' || typeof useTweaks === 'undefined') {
    return setTimeout(__mountDotir, 30);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
__mountDotir();

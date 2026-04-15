'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DRINKS, AMBIENCES,
  RANDOM_EVENTS,
  type DrinkId, type AmbienceId, type DrinkState, type Drink,
} from './data';

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({ onStart }: { onStart: (d: DrinkId, a: AmbienceId) => void }) {
  const [drink, setDrink] = useState<DrinkId>('soju');
  const [ambience, setAmbience] = useState<AmbienceId>('pocha');

  const drinkIds: DrinkId[] = ['soju', 'beer', 'whiskey', 'yangju', 'soft'];
  const ambienceIds: AmbienceId[] = ['pocha', 'hof', 'bar', 'home'];

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-center text-white/90 text-3xl font-light tracking-widest mb-2">술자리</h1>
        <p className="text-center text-white/30 text-sm mb-12 tracking-wider">오늘 뭐 마실까</p>

        <p className="text-white/40 text-xs tracking-widest mb-3 uppercase">음료</p>
        <div className="grid grid-cols-5 gap-2 mb-8">
          {drinkIds.map((id) => (
            <button
              key={id}
              onClick={() => setDrink(id)}
              className={`py-3 rounded-lg text-sm transition-all duration-200 ${
                drink === id
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
              }`}
            >
              {DRINKS[id].name}
            </button>
          ))}
        </div>

        <p className="text-white/40 text-xs tracking-widest mb-3 uppercase">분위기</p>
        <div className="grid grid-cols-4 gap-2 mb-12">
          {ambienceIds.map((id) => (
            <button
              key={id}
              onClick={() => setAmbience(id)}
              className={`py-3 rounded-lg text-sm transition-all duration-200 ${
                ambience === id
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
              }`}
            >
              {AMBIENCES[id].name}
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onStart(drink, ambience)}
          className="w-full py-4 bg-white/10 border border-white/20 text-white rounded-xl text-base tracking-widest hover:bg-white/15 transition-all"
        >
          자리에 앉는다
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Glass SVG ────────────────────────────────────────────────────────────────

function GlassVisual({ drink, fillLevel, state }: {
  drink: Drink; fillLevel: number; state: DrinkState;
}) {
  const { glassType, liquidColor, foamy } = drink;
  const tiltDeg = state === 'drinking' ? -35 : state === 'lifted' ? -12 : 0;

  const renderGlass = () => {
    if (glassType === 'shot') return (
      <svg viewBox="0 0 60 100" className="w-14 h-24" overflow="visible">
        <clipPath id="shot-clip"><path d="M10 5 L50 5 L44 95 L16 95 Z" /></clipPath>
        {fillLevel > 0 && (
          <rect x="0" y={5 + 90 * (1 - fillLevel)} width="60" height={90 * fillLevel}
            fill={liquidColor} clipPath="url(#shot-clip)" />
        )}
        <path d="M10 5 L50 5 L44 95 L16 95 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      </svg>
    );
    if (glassType === 'beer') return (
      <svg viewBox="0 0 70 120" className="w-16 h-28" overflow="visible">
        <clipPath id="beer-clip"><path d="M15 10 L55 10 L50 110 L20 110 Z" /></clipPath>
        {fillLevel > 0 && (
          <>
            <rect x="0" y={10 + 100 * (1 - fillLevel)} width="70" height={100 * fillLevel}
              fill={liquidColor} clipPath="url(#beer-clip)" />
            {foamy && fillLevel > 0.25 && (
              <ellipse cx="35" cy={10 + 100 * (1 - fillLevel) + 5}
                rx="18" ry="7" fill="rgba(255,255,255,0.85)" clipPath="url(#beer-clip)" />
            )}
          </>
        )}
        <path d="M15 10 L55 10 L50 110 L20 110 Z" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        {/* handle */}
        <path d="M55 30 Q72 30 72 55 Q72 80 55 80" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
    if (glassType === 'rocks') return (
      <svg viewBox="0 0 80 80" className="w-20 h-20" overflow="visible">
        <clipPath id="rocks-clip"><rect x="10" y="5" width="60" height="70" rx="4" /></clipPath>
        {fillLevel > 0 && (
          <>
            <rect x="0" y={5 + 70 * (1 - fillLevel)} width="80" height={70 * fillLevel}
              fill={liquidColor} clipPath="url(#rocks-clip)" />
            <rect x="18" y={5 + 70 * (1 - fillLevel) + 6} width="14" height="12" rx="2"
              fill="rgba(200,230,255,0.55)" clipPath="url(#rocks-clip)" />
            <rect x="36" y={5 + 70 * (1 - fillLevel) + 3} width="12" height="10" rx="2"
              fill="rgba(200,230,255,0.45)" clipPath="url(#rocks-clip)" />
          </>
        )}
        <rect x="10" y="5" width="60" height="70" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </svg>
    );
    if (glassType === 'highball') return (
      <svg viewBox="0 0 60 110" className="w-14 h-28" overflow="visible">
        <clipPath id="hb-clip"><rect x="8" y="5" width="44" height="100" rx="4" /></clipPath>
        {fillLevel > 0 && (
          <rect x="0" y={5 + 100 * (1 - fillLevel)} width="60" height={100 * fillLevel}
            fill={liquidColor} clipPath="url(#hb-clip)" />
        )}
        <rect x="8" y="5" width="44" height="100" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </svg>
    );
    // cup (soft drink)
    return (
      <svg viewBox="0 0 70 100" className="w-16 h-24" overflow="visible">
        <clipPath id="cup-clip"><path d="M12 8 L58 8 L52 92 L18 92 Z" /></clipPath>
        {fillLevel > 0 && (
          <rect x="0" y={8 + 84 * (1 - fillLevel)} width="70" height={84 * fillLevel}
            fill={liquidColor} clipPath="url(#cup-clip)" />
        )}
        <path d="M12 8 L58 8 L52 92 L18 92 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <rect x="46" y="0" width="3" height="55" rx="1.5" fill="rgba(255,100,100,0.7)" />
      </svg>
    );
  };

  return (
    <motion.div
      animate={{ rotate: tiltDeg, y: state === 'lifted' || state === 'drinking' ? -18 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformOrigin: 'bottom center' }}
    >
      {renderGlass()}
    </motion.div>
  );
}

// ─── Bottle Visual ─────────────────────────────────────────────────────────────

function BottleVisual({ drink, pouring }: { drink: Drink; pouring: boolean }) {
  return (
    <div className="relative">
      <motion.div
        animate={{ rotate: pouring ? -50 : 0, x: pouring ? 28 : 0, y: pouring ? -8 : 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 40 120" className="w-10 h-28" overflow="visible">
          <clipPath id="bottle-liq">
            <path d="M8 22 L32 22 L34 112 L6 112 Z" />
          </clipPath>
          <rect x="6" y="110" width="28" height="6" rx="2" fill={drink.bottleColor} />
          <path d="M8 22 L32 22 L34 112 L6 112 Z" fill={drink.bottleColor} opacity="0.85" />
          <rect x="14" y="0" width="12" height="22" rx="3" fill={drink.bottleColor} opacity="0.8" />
          {/* liquid inside */}
          <rect x="0" y="55" width="40" height="60" fill={drink.liquidColor} clipPath="url(#bottle-liq)" />
          {/* label */}
          <rect x="10" y="52" width="20" height="28" rx="2" fill="rgba(255,255,255,0.12)" />
          <text x="20" y="70" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="4.5" fontWeight="bold">
            {drink.label}
          </text>
        </svg>
      </motion.div>

      {/* pour stream */}
      <AnimatePresence>
        {pouring && (
          <motion.div
            key="pour"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.8, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            style={{
              transformOrigin: 'top',
              background: drink.liquidColor,
              position: 'absolute',
              bottom: -24,
              left: '50%',
              marginLeft: -2,
              width: 4,
              height: 28,
              borderRadius: 2,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Action Button ─────────────────────────────────────────────────────────────

function ActionBtn({ onClick, disabled, label, active, highlight }: {
  onClick: () => void; disabled: boolean; label: string; active?: boolean; highlight?: boolean;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      className={`py-4 rounded-xl text-sm tracking-wider transition-all duration-200 border ${
        disabled
          ? 'bg-white/[0.03] border-white/5 text-white/15 cursor-not-allowed'
          : active
          ? 'bg-white/25 border-white/40 text-white shadow-lg'
          : highlight
          ? 'bg-white/15 border-white/30 text-white hover:bg-white/20'
          : 'bg-white/[0.07] border-white/15 text-white/70 hover:bg-white/12'
      }`}
    >
      {label}
    </motion.button>
  );
}

// ─── Main POV Screen ───────────────────────────────────────────────────────────

function MainScreen({ drinkId, ambienceId, onBack }: {
  drinkId: DrinkId; ambienceId: AmbienceId; onBack: () => void;
}) {
  const drink = DRINKS[drinkId];
  const ambience = AMBIENCES[ambienceId];

  const [glassState, setGlassState] = useState<DrinkState>('empty');
  const [fillLevel, setFillLevel] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [statusText, setStatusText] = useState(ambience.ambientText);
  const [flashKey, setFlashKey] = useState(0);
  const [newSnack, setNewSnack] = useState('');
  const [toasting, setToasting] = useState(false);
  const [screenTilt, setScreenTilt] = useState(0);

  const flash = useCallback((text: string) => {
    setStatusText(text);
    setFlashKey((k) => k + 1);
  }, []);

  const getMoodLine = useCallback((count: number) => {
    const idx = Math.min(count, drink.moodLines.length - 1);
    return drink.moodLines[idx];
  }, [drink]);

  const triggerRandomEvent = useCallback((currentFill: number) => {
    if (Math.random() > 0.4) return;
    const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    if (ev.effect === 'refill' && currentFill < 0.2) {
      setFillLevel(0.9);
      flash(ev.text);
    } else if (ev.effect === 'snack') {
      setNewSnack('안주가 새로 나왔다.');
      flash(ev.text);
      setTimeout(() => setNewSnack(''), 3000);
    } else if (ev.effect === 'toast') {
      setToasting(true);
      flash(ev.text);
      setTimeout(() => setToasting(false), 1400);
    } else {
      flash(ambience.reactionTone[Math.floor(Math.random() * ambience.reactionTone.length)]);
    }
  }, [ambience, flash]);

  const handlePour = () => {
    if (glassState === 'lifted' || glassState === 'drinking') return;
    setPouring(true);
    setGlassState('poured');
    flash('따른다 —');
    setTimeout(() => {
      setFillLevel((f) => Math.min(f + 0.85, 1));
      setPouring(false);
    }, 1000);
  };

  const handleLift = () => {
    if (fillLevel === 0) { flash('잔이 비었다. 먼저 따라야지.'); return; }
    if (glassState === 'lifted') return;
    setGlassState('lifted');
    flash(drink.liftLabel);
  };

  const handleDrink = () => {
    if (glassState !== 'lifted') { flash('잔을 먼저 들어야지.'); return; }
    setGlassState('drinking');
    const sip = Math.min(fillLevel, 0.35 + Math.random() * 0.25);
    flash(drink.drinkLabel + ' —');
    setScreenTilt(drinkCount % 2 === 0 ? 1.2 : -1.2);
    setTimeout(() => {
      const next = Math.max(fillLevel - sip, 0);
      setFillLevel(next);
      const newCount = drinkCount + 1;
      setDrinkCount(newCount);
      flash(getMoodLine(newCount - 1));
      setGlassState(next <= 0.05 ? 'empty' : 'poured');
      setScreenTilt(0);
      triggerRandomEvent(next);
    }, 800);
  };

  const handleToast = () => {
    if (fillLevel === 0) { flash('잔이 비었는데 건배?'); return; }
    setToasting(true);
    flash(drink.toastLabel);
    setScreenTilt(2);
    setTimeout(() => {
      setToasting(false);
      setScreenTilt(0);
      flash(ambience.reactionTone[Math.floor(Math.random() * ambience.reactionTone.length)]);
      setFillLevel((f) => Math.max(f - 0.1, 0));
    }, 1200);
  };

  const drunkLevel = Math.min(Math.floor(drinkCount / 3), 3);
  const blurAmount = drunkLevel * 0.25;

  return (
    <motion.div
      animate={{ rotate: screenTilt }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`min-h-screen bg-gradient-to-b ${ambience.bg} flex flex-col overflow-hidden select-none relative`}
      style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined }}
    >
      {/* ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${ambience.lightColor}, transparent)` }}
      />

      {/* top bar */}
      <div className="relative z-10 flex justify-between items-center px-5 pt-8 pb-2">
        <button
          onClick={onBack}
          className="text-white/25 text-xs tracking-wider hover:text-white/50 transition-colors"
        >
          ← 나가기
        </button>
        <span className="text-white/20 text-xs">{ambience.name} · {drink.name}</span>
        {drinkCount > 0 && (
          <span className="text-white/25 text-xs">{drinkCount}잔째</span>
        )}
      </div>

      {/* status text */}
      <div className="min-h-12 flex items-center justify-center px-8 mt-2 mb-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={flashKey}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-white/45 text-sm tracking-wide leading-relaxed text-center"
          >
            {statusText}
          </motion.p>
        </AnimatePresence>
      </div>
      {newSnack && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/25 text-xs mb-1"
        >
          {newSnack}
        </motion.p>
      )}

      {/* table scene */}
      <div className="flex-1 flex flex-col items-center justify-end">
        {/* table surface */}
        <div
          className="w-full relative"
          style={{ background: `linear-gradient(to bottom, ${ambience.tableColor}99, ${ambience.tableColor}ee)` }}
        >
          {/* snack */}
          <div className="absolute right-6 top-3">
            <div className="w-16 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center">
              <span className="text-white/25 text-xs text-center leading-tight px-1">
                {ambience.snack.split(',')[0].trim()}
              </span>
            </div>
          </div>

          {/* bottle + glass */}
          <div className="flex items-end justify-center gap-10 pt-10 pb-5 px-6">
            <BottleVisual drink={drink} pouring={pouring} />

            <div className="flex flex-col items-center gap-2">
              <GlassVisual drink={drink} fillLevel={fillLevel} state={glassState} />
              {/* fill dots */}
              <div className="flex gap-1.5">
                {[0.2, 0.45, 0.7, 0.95].map((lvl) => (
                  <div
                    key={lvl}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      fillLevel >= lvl ? 'bg-white/50' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* toast ghost glass */}
            <AnimatePresence>
              {toasting && (
                <motion.div
                  key="toast-glass"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 0.7, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-10 bottom-12"
                >
                  <svg viewBox="0 0 40 80" className="w-8 h-16">
                    <clipPath id="tg-clip"><path d="M6 5 L34 5 L30 75 L10 75 Z" /></clipPath>
                    <rect x="0" y="15" width="40" height="65" fill="rgba(180,180,255,0.35)" clipPath="url(#tg-clip)" />
                    <path d="M6 5 L34 5 L30 75 L10 75 Z" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* action buttons */}
        <div className="w-full max-w-sm px-4 mt-4 grid grid-cols-2 gap-3">
          <ActionBtn
            onClick={handlePour}
            disabled={pouring || glassState === 'lifted' || glassState === 'drinking'}
            label={drink.pourLabel}
            active={pouring}
          />
          <ActionBtn
            onClick={handleLift}
            disabled={glassState === 'lifted' || glassState === 'drinking' || fillLevel === 0}
            label={drink.liftLabel}
            active={glassState === 'lifted'}
          />
          <ActionBtn
            onClick={handleDrink}
            disabled={glassState !== 'lifted'}
            label={drink.drinkLabel}
            active={glassState === 'drinking'}
            highlight
          />
          <ActionBtn
            onClick={handleToast}
            disabled={fillLevel === 0 || toasting}
            label={drink.toastLabel}
            active={toasting}
          />
        </div>

        <button
          onClick={onBack}
          className="mt-4 mb-6 text-white/18 text-xs tracking-widest hover:text-white/35 transition-colors"
        >
          술 바꾸기
        </button>
      </div>
    </motion.div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<'start' | 'main'>('start');
  const [drinkId, setDrinkId] = useState<DrinkId>('soju');
  const [ambienceId, setAmbienceId] = useState<AmbienceId>('pocha');

  const handleStart = (d: DrinkId, a: AmbienceId) => {
    setDrinkId(d);
    setAmbienceId(a);
    setScreen('main');
  };

  return (
    <AnimatePresence mode="wait">
      {screen === 'start' ? (
        <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <StartScreen onStart={handleStart} />
        </motion.div>
      ) : (
        <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MainScreen drinkId={drinkId} ambienceId={ambienceId} onBack={() => setScreen('start')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DRINKS, RANDOM_EVENTS, type Drink, type DrinkId, type DrinkState } from './data';

const DRINK_SCENES: Record<DrinkId, {
  name: string;
  bg: string;
  tableColor: string;
  lightColor: string;
  ambientText: string;
  snack: string;
  reactionTone: string[];
}> = {
  soju: {
    name: '포차',
    bg: 'from-amber-950 via-orange-950 to-stone-950',
    tableColor: '#4a2f1c',
    lightColor: 'rgba(249,115,22,0.85)',
    ambientText: '주황 천막 아래, 소주병과 소주잔이 테이블 위에 놓여 있다.',
    snack: '계란말이, 어묵탕',
    reactionTone: ['옆 테이블 웃음소리가 번진다.', '포차 안쪽 열기가 조금 더 오른다.', '소주 향이 공기 사이로 가볍게 돈다.'],
  },
  beer: {
    name: '호프집',
    bg: 'from-yellow-950 via-amber-900 to-stone-950',
    tableColor: '#4a3418',
    lightColor: 'rgba(251,191,36,0.9)',
    ambientText: '호프집 네온 아래, 맥주 거품이 천천히 살아난다.',
    snack: '치킨, 감자튀김',
    reactionTone: ['네온 간판 빛이 잔에 번진다.', '호프집 특유의 북적임이 살아난다.', '튀김 냄새가 은근하게 스민다.'],
  },
  whiskey: {
    name: '재즈 바',
    bg: 'from-stone-950 via-amber-950 to-neutral-950',
    tableColor: '#2f231b',
    lightColor: 'rgba(217,119,6,0.7)',
    ambientText: '낮은 조명 아래, 묵직한 병과 록스 글라스가 조용히 놓여 있다.',
    snack: '치즈 플레이트, 견과류',
    reactionTone: ['얼음이 잔 안에서 낮게 부딪힌다.', '오크 향이 천천히 길게 남는다.', '음악과 함께 템포가 가라앉는다.'],
  },
  yangju: {
    name: '호텔 라운지',
    bg: 'from-slate-950 via-blue-950 to-slate-900',
    tableColor: '#1f2937',
    lightColor: 'rgba(148,163,184,0.7)',
    ambientText: '유리창 너머 야경과 함께 긴 잔과 양주병이 정갈하게 놓여 있다.',
    snack: '카나페, 치즈',
    reactionTone: ['창밖 불빛이 잔 표면에 길게 비친다.', '라운지 조명이 병의 윤곽을 부드럽게 감싼다.', '조용한 공간이 더 깊어지는 느낌이다.'],
  },
  soft: {
    name: '분식집',
    bg: 'from-red-950 via-rose-950 to-zinc-950',
    tableColor: '#5b2a24',
    lightColor: 'rgba(248,113,113,0.85)',
    ambientText: '분식집 조명 아래, 콜라 캔과 종이컵이 트레이 옆에 놓여 있다.',
    snack: '떡볶이, 튀김',
    reactionTone: ['탄산 소리가 톡 하고 올라온다.', '트레이 위 음식 냄새가 같이 퍼진다.', '분식집 특유의 편한 분위기가 살아난다.'],
  },
};

function GlassVisual({ drink, fillLevel, state }: { drink: Drink; fillLevel: number; state: DrinkState }) {
  const anim = state === 'drinking'
    ? { scale: 1.72, y: -220, rotate: -36, x: 6 }
    : state === 'toasting'
    ? { scale: 1.14, y: -22, rotate: 10, x: -28 }
    : { scale: 1, y: 0, rotate: 0, x: 0 };

  if (drink.glassType === 'shot') {
    return (
      <motion.svg viewBox="0 0 70 110" className="w-64 h-[25rem]" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="shot-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.28)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
          <clipPath id="shot-clip"><path d="M14 14 Q35 6 56 14 L49 98 Q35 105 21 98 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={14 + 84 * (1 - fillLevel)} width="70" height={84 * fillLevel} fill={drink.liquidColor} clipPath="url(#shot-clip)" />}
        <ellipse cx="35" cy="14" rx="21" ry="5.5" fill="rgba(255,255,255,0.22)" />
        <path d="M14 14 Q35 6 56 14 L49 98 Q35 105 21 98 Z" fill="url(#shot-body)" stroke="rgba(255,255,255,0.62)" strokeWidth="2.4" />
        <path d="M22 98 H48" stroke="rgba(255,255,255,0.48)" strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (drink.glassType === 'beer') {
    return (
      <motion.svg viewBox="0 0 78 130" className="w-72 h-[28rem]" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="beer-glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.25)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
          <clipPath id="beer-clip"><path d="M16 16 L58 16 L54 116 L22 116 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={16 + 100 * (1 - fillLevel)} width="78" height={100 * fillLevel} fill={drink.liquidColor} clipPath="url(#beer-clip)" />}
        {fillLevel > 0.15 && drink.foamy && <ellipse cx="37" cy={16 + 100 * (1 - fillLevel) + 6} rx="22" ry="8" fill="rgba(255,255,255,0.94)" />}
        <path d="M16 16 L58 16 L54 116 L22 116 Z" fill="url(#beer-glass)" stroke="rgba(255,255,255,0.52)" strokeWidth="2.2" />
        <path d="M59 34 Q76 34 76 66 Q76 98 59 98" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="6" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (drink.glassType === 'rocks') {
    return (
      <motion.svg viewBox="0 0 86 86" className="w-72 h-72" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs><clipPath id="rocks-clip"><rect x="12" y="8" width="62" height="70" rx="6" /></clipPath></defs>
        {fillLevel > 0 && <rect x="0" y={8 + 70 * (1 - fillLevel)} width="86" height={70 * fillLevel} fill={drink.liquidColor} clipPath="url(#rocks-clip)" />}
        <rect x="12" y="8" width="62" height="70" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
      </motion.svg>
    );
  }

  if (drink.glassType === 'highball') {
    return (
      <motion.svg viewBox="0 0 64 120" className="w-60 h-[24rem]" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs><clipPath id="highball-clip"><rect x="10" y="8" width="44" height="104" rx="6" /></clipPath></defs>
        {fillLevel > 0 && <rect x="0" y={8 + 104 * (1 - fillLevel)} width="64" height={104 * fillLevel} fill={drink.liquidColor} clipPath="url(#highball-clip)" />}
        <rect x="10" y="8" width="44" height="104" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.48)" strokeWidth="2.2" />
      </motion.svg>
    );
  }

  return (
    <motion.svg viewBox="0 0 74 110" className="w-72 h-[25rem]" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
      <defs><clipPath id="cup-clip"><path d="M14 10 L60 10 L54 100 L20 100 Z" /></clipPath></defs>
      {fillLevel > 0 && <rect x="0" y={10 + 90 * (1 - fillLevel)} width="74" height={90 * fillLevel} fill={drink.liquidColor} clipPath="url(#cup-clip)" />}
      <path d="M14 10 L60 10 L54 100 L20 100 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.48)" strokeWidth="2.2" />
      <rect x="49" y="0" width="4" height="62" rx="2" fill="rgba(255,140,140,0.8)" />
    </motion.svg>
  );
}
function BottleVisual({ drink, pouring }: { drink: Drink; pouring: boolean }) {
  const motionProps = {
    animate: { rotate: pouring ? -44 : 0, x: pouring ? 88 : 0, y: pouring ? -12 : 0 },
    transition: { type: 'spring' as const, stiffness: 180, damping: 20 },
    style: { transformOrigin: 'bottom center' as const },
  };

  if (drink.id === 'soju') {
    return (
      <div className="relative">
        <motion.div {...motionProps}>
          <svg viewBox="0 0 58 150" className="w-40 h-[30rem]" overflow="visible">
            <defs>
              <linearGradient id="soju-bottle" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5bef8d" /><stop offset="100%" stopColor="#159947" /></linearGradient>
              <clipPath id="soju-liquid"><path d="M14 24 H44 L48 128 Q46 144 29 144 Q12 144 10 128 Z" /></clipPath>
            </defs>
            <rect x="21" y="2" width="16" height="12" rx="2" fill="#0f9f4a" />
            <rect x="18" y="12" width="22" height="15" rx="4" fill="#0b7a38" />
            <path d="M14 24 H44 L48 128 Q46 144 29 144 Q12 144 10 128 Z" fill="url(#soju-bottle)" />
            <rect x="0" y="82" width="58" height="74" fill="rgba(220,240,255,0.28)" clipPath="url(#soju-liquid)" />
            <ellipse cx="29" cy="26" rx="15" ry="4.2" fill="rgba(255,255,255,0.16)" />
            <rect x="15" y="66" width="28" height="44" rx="8" fill="#f5f7ed" opacity="0.97" />
            <text x="29" y="90" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="700">참이슬</text>
            <text x="29" y="102" textAnchor="middle" fill="#166534" fontSize="4.8" fontWeight="700">후레쉬</text>
          </svg>
        </motion.div>
        <AnimatePresence>
          {pouring && <motion.div key="soju-pour" initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 0.9, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0 }} transition={{ duration: 0.22 }} style={{ transformOrigin: 'top', background: 'rgba(220,240,255,0.82)', position: 'absolute', bottom: 58, left: 'calc(100% + 8px)', width: 12, height: 128, borderRadius: 999, boxShadow: '0 0 20px rgba(220,240,255,0.35)' }} />}
        </AnimatePresence>
      </div>
    );
  }

  const body = drink.id === 'beer'
    ? <svg viewBox="0 0 52 140" className="w-36 h-[28rem]" overflow="visible"><rect x="20" y="0" width="12" height="10" rx="2" fill="#fbbf24" /><rect x="17" y="10" width="18" height="11" rx="3" fill="#7c4a12" /><path d="M15 20 H37 L40 120 Q40 132 26 132 Q12 132 12 120 Z" fill="#754312" /><rect x="16" y="74" width="20" height="34" rx="4" fill="#f8ebc8" opacity="0.9" /><text x="26" y="92" textAnchor="middle" fill="#7c4a12" fontSize="6" fontWeight="700">맥주</text></svg>
    : drink.id === 'whiskey'
    ? <svg viewBox="0 0 68 140" className="w-40 h-[28rem]" overflow="visible"><rect x="26" y="0" width="16" height="15" rx="2" fill="#d4a017" /><path d="M16 18 H52 V42 L58 52 V120 Q58 134 34 134 Q10 134 10 120 V52 L16 42 Z" fill="#593116" /><rect x="18" y="58" width="32" height="40" rx="4" fill="#efe2b8" opacity="0.92" /><text x="34" y="76" textAnchor="middle" fill="#4a2c14" fontSize="5.8" fontWeight="700">위스키</text></svg>
    : drink.id === 'yangju'
    ? <svg viewBox="0 0 62 140" className="w-40 h-[28rem]" overflow="visible"><rect x="24" y="0" width="14" height="14" rx="2" fill="#d1d5db" /><path d="M18 18 H44 L48 120 Q48 134 31 134 Q14 134 14 120 Z" fill="#18314f" /><rect x="18" y="60" width="26" height="42" rx="4" fill="#e8ecf3" opacity="0.9" /><text x="31" y="82" textAnchor="middle" fill="#1e293b" fontSize="5.2" fontWeight="700">양주</text></svg>
    : <svg viewBox="0 0 54 140" className="w-36 h-[28rem]" overflow="visible"><rect x="10" y="12" width="34" height="108" rx="10" fill="#c81e1e" /><rect x="12" y="8" width="30" height="10" rx="5" fill="#d1d5db" /><text x="27" y="72" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="7.5" fontWeight="700">콜라</text></svg>;

  return <motion.div {...motionProps}>{body}</motion.div>;
}

function ActionBtn({ onClick, disabled, label, active, highlight }: { onClick: () => void; disabled: boolean; label: string; active?: boolean; highlight?: boolean }) {
  return (
    <motion.button whileTap={disabled ? {} : { scale: 0.95 }} onClick={onClick} disabled={disabled} className={`py-5 rounded-2xl text-lg font-medium tracking-wide transition-all duration-200 border ${disabled ? 'bg-white/[0.04] border-white/5 text-white/20 cursor-not-allowed' : active ? 'bg-white/28 border-white/40 text-white shadow-lg' : highlight ? 'bg-white/16 border-white/28 text-white hover:bg-white/20' : 'bg-white/[0.08] border-white/15 text-white/75 hover:bg-white/14'}`}>
      {label}
    </motion.button>
  );
}

function SceneDecor({ drinkId }: { drinkId: DrinkId }) {
  if (drinkId === 'soju') return <><div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(255,189,89,0.3),transparent_62%)]" /><div className="absolute right-10 top-21 text-[11px] tracking-[0.35em] text-red-100/35">포차</div></>;
  if (drinkId === 'beer') return <><div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.22),transparent_60%)]" /><div className="absolute right-14 top-17 text-base tracking-[0.3em] text-yellow-100/45">호프</div></>;
  if (drinkId === 'whiskey') return <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.18),transparent_58%)]" />;
  if (drinkId === 'yangju') return <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_60%)]" />;
  return <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.18),transparent_60%)]" />;
}
function MainScreen() {
  const [currentDrink, setCurrentDrink] = useState<DrinkId>('soju');
  const [glassState, setGlassState] = useState<DrinkState>('empty');
  const [fillLevel, setFillLevel] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [autoRefillPending, setAutoRefillPending] = useState(false);
  const [isCheersing, setIsCheersing] = useState(false);
  const [statusText, setStatusText] = useState(DRINK_SCENES.soju.ambientText);
  const [flashKey, setFlashKey] = useState(0);
  const [newSnack, setNewSnack] = useState('');
  const [screenTilt, setScreenTilt] = useState(0);
  const [drinkChanging, setDrinkChanging] = useState(false);
  const autoRefillScheduled = useRef(false);

  const drink = DRINKS[currentDrink];
  const scene = DRINK_SCENES[currentDrink];
  const drinkIds: DrinkId[] = ['soju', 'beer', 'whiskey', 'yangju', 'soft'];
  const blurAmount = Math.min(Math.floor(drinkCount / 3), 3) * 0.3;

  const flash = useCallback((text: string) => {
    setStatusText(text);
    setFlashKey((prev) => prev + 1);
  }, []);

  const triggerRandomEvent = useCallback(() => {
    if (Math.random() > 0.35) return;
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    if (event.effect === 'snack') {
      setNewSnack('안주가 새로 도착했다.');
      flash(event.text);
      setTimeout(() => setNewSnack(''), 2800);
      return;
    }
    if (event.effect === 'toast') {
      setIsCheersing(true);
      flash(event.text);
      setTimeout(() => setIsCheersing(false), 1400);
      return;
    }
    flash(scene.reactionTone[Math.floor(Math.random() * scene.reactionTone.length)]);
  }, [flash, scene.reactionTone]);

  useEffect(() => {
    if (fillLevel <= 0.05 && glassState === 'empty' && !drinkChanging && !autoRefillScheduled.current) {
      autoRefillScheduled.current = true;
      const t1 = setTimeout(() => { setAutoRefillPending(true); setIsPouring(true); flash(drink.pourLabel); }, 450);
      const t2 = setTimeout(() => {
        setFillLevel(0.92); setGlassState('poured'); setIsPouring(false); setAutoRefillPending(false); autoRefillScheduled.current = false; flash(scene.ambientText);
      }, 1450);
      return () => { clearTimeout(t1); clearTimeout(t2); autoRefillScheduled.current = false; };
    }
  }, [drink.pourLabel, drinkChanging, fillLevel, flash, glassState, scene.ambientText]);

  const handleShot = () => {
    if (fillLevel === 0) return flash('잔이 비어 있어서 원샷할 수 없다.');
    if (glassState === 'drinking') return;
    setGlassState('drinking');
    flash('원샷 -');
    setScreenTilt(drinkCount % 2 === 0 ? 2.3 : -2.3);
    setTimeout(() => {
      const nextCount = drinkCount + 1;
      setFillLevel(0); setDrinkCount(nextCount); setGlassState('empty'); setScreenTilt(0); flash(drink.moodLines[Math.min(nextCount - 1, drink.moodLines.length - 1)]); triggerRandomEvent();
    }, 980);
  };

  const handleSip = () => {
    if (fillLevel === 0 || glassState === 'drinking') return;
    setGlassState('drinking');
    flash('한모금 -');
    setScreenTilt(drinkCount % 2 === 0 ? 1.4 : -1.4);
    setTimeout(() => {
      const next = Math.max(fillLevel - Math.min(fillLevel, 0.2), 0);
      const nextCount = drinkCount + 1;
      setFillLevel(next); setDrinkCount(nextCount); setGlassState(next <= 0.05 ? 'empty' : 'poured'); setScreenTilt(0); flash(drink.moodLines[Math.min(nextCount - 1, drink.moodLines.length - 1)]); triggerRandomEvent();
    }, 860);
  };

  const handleToast = () => {
    if (fillLevel === 0) return flash('잔이 비어 있어서 짠할 수 없다.');
    if (isCheersing || glassState === 'drinking') return;
    setIsCheersing(true); setGlassState('toasting'); setScreenTilt(2.8); flash('짠!');
    setTimeout(() => { setIsCheersing(false); setGlassState('poured'); setScreenTilt(0); setFillLevel((prev) => Math.max(prev - 0.06, 0)); flash(scene.reactionTone[Math.floor(Math.random() * scene.reactionTone.length)]); }, 1350);
  };

  const handleChangeDrink = (id: DrinkId) => {
    if (id === currentDrink || drinkChanging) return;
    setDrinkChanging(true); autoRefillScheduled.current = false; setAutoRefillPending(false); setIsPouring(false);
    setTimeout(() => { setCurrentDrink(id); setGlassState('empty'); setFillLevel(0); setStatusText(DRINK_SCENES[id].ambientText); setFlashKey((prev) => prev + 1); setDrinkChanging(false); }, 280);
  };

  return (
    <motion.div animate={{ rotate: screenTilt }} transition={{ type: 'spring', stiffness: 280, damping: 22 }} className={`min-h-screen bg-gradient-to-b ${scene.bg} flex flex-col overflow-hidden relative`} style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined }}>
      <SceneDecor drinkId={currentDrink} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24rem] h-56 rounded-full opacity-25" style={{ background: `radial-gradient(ellipse, ${scene.lightColor}, transparent)` }} />
      <div className="relative z-10 flex justify-between items-center px-6 pt-8 pb-3"><span className="text-white/25 text-base tracking-[0.25em]">{scene.name}</span><span className="text-white/35 text-lg font-medium">{drink.name}</span>{drinkCount > 0 && <span className="text-white/28 text-base">{drinkCount}잔째</span>}</div>
      <div className="min-h-16 flex items-center justify-center px-8 mt-1 mb-2"><AnimatePresence mode="wait"><motion.p key={flashKey} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="text-white/60 text-lg tracking-wide leading-relaxed text-center">{statusText}</motion.p></AnimatePresence></div>
      {newSnack && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/35 text-base mb-2">{newSnack}</motion.p>}
      <div className="w-full px-5 mt-2"><div className="flex gap-3 justify-center flex-wrap">{drinkIds.map((id) => <motion.button key={id} whileTap={{ scale: 0.95 }} onClick={() => handleChangeDrink(id)} className={`px-5 py-3 rounded-full text-base font-medium transition-all duration-200 border ${currentDrink === id ? 'bg-white/18 border-white/30 text-white/90' : 'bg-white/[0.05] border-white/10 text-white/40 hover:bg-white/10 hover:text-white/65'}`}>{DRINKS[id].name}</motion.button>)}</div></div>
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className="w-full relative" style={{ background: `linear-gradient(to bottom, ${scene.tableColor}99, ${scene.tableColor}f2)` }}>
          <div className="absolute right-5 top-4"><div className="w-32 h-16 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center"><span className="text-white/30 text-base text-center leading-tight px-2">{scene.snack.split(',')[0].trim()}</span></div></div>
          <AnimatePresence>{autoRefillPending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.55, 0.2] }} transition={{ repeat: Infinity, duration: 1.1 }} exit={{ opacity: 0 }} className="absolute top-4 left-6 text-white/35 text-base tracking-[0.2em]">자동 리필 중</motion.div>}</AnimatePresence>
          <div className="flex items-end justify-center gap-28 pt-16 pb-12 px-6">
            <AnimatePresence mode="wait"><motion.div key={`bottle-${currentDrink}`} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.88 : 1 }} transition={{ duration: 0.25 }}><BottleVisual drink={drink} pouring={isPouring} /></motion.div></AnimatePresence>
            <div className="flex flex-col items-center gap-5"><AnimatePresence mode="wait"><motion.div key={`glass-${currentDrink}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.85 : 1 }} transition={{ duration: 0.25 }}><GlassVisual drink={drink} fillLevel={fillLevel} state={glassState} /></motion.div></AnimatePresence><div className="flex gap-3">{[0.2, 0.45, 0.7, 0.95].map((level) => <div key={level} className={`w-3 h-3 rounded-full transition-all duration-500 ${fillLevel >= level ? 'bg-white/55' : 'bg-white/10'}`} />)}</div></div>
            <AnimatePresence>{isCheersing && <motion.div initial={{ opacity: 0, x: 48, scale: 0.7, rotate: -16 }} animate={{ opacity: 0.72, x: 0, scale: 1.12, rotate: -8 }} exit={{ opacity: 0, x: 48, scale: 0.7, rotate: -16 }} transition={{ type: 'spring', stiffness: 340, damping: 18 }} style={{ position: 'absolute', right: 22, bottom: 52 }}><svg viewBox="0 0 46 86" className="w-16 h-28"><clipPath id="toast-ghost-clip"><path d="M7 8 Q23 2 39 8 L34 78 Q23 84 12 78 Z" /></clipPath><rect x="0" y="18" width="46" height="68" fill="rgba(180,180,255,0.34)" clipPath="url(#toast-ghost-clip)" /><path d="M7 8 Q23 2 39 8 L34 78 Q23 84 12 78 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" /></svg></motion.div>}</AnimatePresence>
          </div>
        </div>
        <div className="w-full max-w-2xl px-5 mt-5 grid grid-cols-3 gap-4"><ActionBtn onClick={handleShot} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="원샷" active={glassState === 'drinking'} /><ActionBtn onClick={handleSip} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="한모금" active={glassState === 'drinking'} highlight /><ActionBtn onClick={handleToast} disabled={fillLevel === 0 || isCheersing || glassState === 'drinking' || autoRefillPending} label="짠!" active={isCheersing} /></div>
      </div>
    </motion.div>
  );
}

export default function App() {
  return <MainScreen />;
}

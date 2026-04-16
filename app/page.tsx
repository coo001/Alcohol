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
    name: '막걸리집',
    bg: 'from-stone-950 via-yellow-950 to-neutral-950',
    tableColor: '#4a3a22',
    lightColor: 'rgba(250,204,21,0.62)',
    ambientText: '나무 테이블 위에 막걸리 병과 잔이 전 접시 옆에 놓여 있다.',
    snack: '파전, 두부김치',
    reactionTone: ['막걸리 잔이 뽀얗게 차오른다.', '파전 냄새가 테이블 위로 퍼진다.', '편하고 구수한 분위기가 살아난다.'],
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
      <motion.svg viewBox="0 0 92 100" className="w-56 h-72" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="shot-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.34)" /><stop offset="72%" stopColor="rgba(255,255,255,0.09)" /><stop offset="100%" stopColor="rgba(255,255,255,0.22)" /></linearGradient>
          <clipPath id="shot-clip"><path d="M23 18 Q46 9 69 18 L62 78 H30 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={18 + 58 * (1 - fillLevel)} width="92" height={58 * fillLevel} fill={drink.liquidColor} clipPath="url(#shot-clip)" />}
        <ellipse cx="46" cy="18" rx="23" ry="7" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
        <path d="M23 18 Q46 9 69 18 L62 78 H30 Z" fill="url(#shot-body)" stroke="rgba(255,255,255,0.66)" strokeWidth="2.4" />
        <path d="M30 78 H62" stroke="rgba(255,255,255,0.52)" strokeWidth="5" strokeLinecap="round" />
        <path d="M34 83 H58" stroke="rgba(0,0,0,0.22)" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 25 C31 40 32 61 36 74" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
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
      <motion.svg viewBox="0 0 96 82" className="w-72 h-72" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="rocks-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.26)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
          <clipPath id="rocks-clip"><path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={13 + 58 * (1 - fillLevel)} width="96" height={58 * fillLevel} fill={drink.liquidColor} clipPath="url(#rocks-clip)" />}
        {fillLevel > 0.18 && <><rect x="31" y="31" width="16" height="14" rx="3" fill="rgba(220,240,255,0.45)" clipPath="url(#rocks-clip)" /><rect x="50" y="27" width="14" height="13" rx="3" fill="rgba(220,240,255,0.38)" clipPath="url(#rocks-clip)" /></>}
        <path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" fill="url(#rocks-body)" stroke="rgba(255,255,255,0.54)" strokeWidth="2.6" />
        <path d="M23 70 Q48 77 73 70" stroke="rgba(255,255,255,0.36)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M26 15 C23 32 23 56 28 69" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeLinecap="round" />
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

  if (drink.id === 'yangju') {
    return (
      <motion.svg viewBox="0 0 96 78" className="w-72 h-[21rem]" overflow="visible" animate={anim} transition={{ type: 'spring', stiffness: 250, damping: 18 }} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="makgeolli-bowl" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f2eee4" /><stop offset="45%" stopColor="#b8b1a2" /><stop offset="100%" stopColor="#777165" /></linearGradient>
          <linearGradient id="makgeolli-metal-shine" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.55)" /><stop offset="45%" stopColor="rgba(255,255,255,0.08)" /><stop offset="100%" stopColor="rgba(0,0,0,0.18)" /></linearGradient>
          <clipPath id="makgeolli-clip"><path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" /></clipPath>
        </defs>
        <path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" fill="url(#makgeolli-bowl)" stroke="rgba(245,245,235,0.52)" strokeWidth="2.6" />
        <path d="M18 27 Q48 18 78 27 L72 58 Q65 68 48 68 Q31 68 24 58 Z" fill="url(#makgeolli-metal-shine)" opacity="0.72" />
        {fillLevel > 0 && <rect x="0" y={25 + 34 * (1 - fillLevel)} width="96" height={34 * fillLevel} fill={drink.liquidColor} opacity="0.9" clipPath="url(#makgeolli-clip)" />}
        <ellipse cx="48" cy={25 + 34 * (1 - fillLevel)} rx="27" ry="7" fill="rgba(255,250,230,0.75)" clipPath="url(#makgeolli-clip)" />
        <ellipse cx="48" cy="23" rx="36" ry="12" fill="none" stroke="#ece7da" strokeWidth="5" />
        <ellipse cx="48" cy="23" rx="29" ry="8" fill="none" stroke="rgba(80,76,68,0.42)" strokeWidth="1.8" />
        <path d="M23 60 Q48 72 73 60" stroke="rgba(50,46,40,0.22)" strokeWidth="4" fill="none" />
        <path d="M28 31 C25 42 27 53 33 62" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
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
    animate: { rotate: pouring ? 36 : 0, x: pouring ? 10 : 0, y: pouring ? -10 : 0 },
    transition: { type: 'spring' as const, stiffness: 180, damping: 20 },
    style: { transformOrigin: 'bottom center' as const },
  };

  if (drink.id === 'soju') {
    return (
      <div className="relative">
        <motion.div {...motionProps}>
          <svg viewBox="0 0 68 152" className="w-40 h-[30rem]" overflow="visible">
            <defs>
              <linearGradient id="soju-bottle" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a8f6bd" /><stop offset="42%" stopColor="#53d979" /><stop offset="100%" stopColor="#119348" /></linearGradient>
              <linearGradient id="soju-glass-shine" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.45)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
              <clipPath id="soju-liquid"><path d="M12 48 C14 37 24 34 26 25 H42 C44 34 54 37 56 48 L58 142 H10 L12 48 Z" /></clipPath>
            </defs>
            <rect x="26" y="1" width="16" height="8" rx="2" fill="#067238" />
            <rect x="24" y="8" width="20" height="18" rx="4" fill="#0b8c41" />
            <path d="M12 48 C14 37 24 34 26 25 H42 C44 34 54 37 56 48 L58 142 H10 L12 48 Z" fill="url(#soju-bottle)" />
            <path d="M15 49 C18 41 25 38 28 30 H40 C43 38 50 41 53 49" fill="none" stroke="rgba(255,255,255,0.23)" strokeWidth="2" />
            <rect x="0" y="82" width="68" height="76" fill="rgba(220,245,255,0.24)" clipPath="url(#soju-liquid)" />
            <ellipse cx="34" cy="48" rx="22" ry="6" fill="rgba(255,255,255,0.16)" />
            <path d="M19 61 H49 Q53 61 53 66 V112 Q53 117 48 117 H20 Q15 117 15 112 V66 Q15 61 19 61 Z" fill="#f8fbef" opacity="0.98" />
            <path d="M24 71 C29 62 39 62 44 71 C47 79 42 87 34 92 C26 87 21 79 24 71 Z" fill="#70d2e8" opacity="0.72" />
            <text x="34" y="100" textAnchor="middle" fill="#116432" fontSize="7.6" fontWeight="900">침이슬</text>
            <text x="34" y="110" textAnchor="middle" fill="#2b8a3e" fontSize="4.4" fontWeight="700">fresh</text>
            <path d="M20 50 C17 72 18 112 24 139" stroke="url(#soju-glass-shine)" strokeWidth="4" strokeLinecap="round" />
            <rect x="14" y="141" width="40" height="7" rx="2" fill="rgba(8,93,45,0.42)" />
            <path d="M12 142 H58" stroke="rgba(255,255,255,0.26)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    );
  }

  const body = drink.id === 'beer'
    ? <svg viewBox="0 0 62 154" className="w-36 h-[28rem]" overflow="visible"><defs><linearGradient id="terra-like" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#27b766" /><stop offset="45%" stopColor="#0d7d49" /><stop offset="100%" stopColor="#064d32" /></linearGradient><clipPath id="beer-neck-label"><rect x="22" y="20" width="18" height="18" rx="3" /></clipPath></defs><rect x="23" y="0" width="16" height="10" rx="2" fill="#e9c84b" /><rect x="21" y="9" width="20" height="34" rx="5" fill="#0b6b3d" /><rect x="22" y="20" width="18" height="18" rx="3" fill="#f4ead4" /><text x="31" y="32" textAnchor="middle" fill="#0d6b40" fontSize="4.4" fontWeight="900" clipPath="url(#beer-neck-label)">T</text><path d="M17 43 C20 38 23 36 25 33 H37 C39 36 42 38 45 43 L49 124 Q50 142 31 146 Q12 142 13 124 Z" fill="url(#terra-like)" /><rect x="14" y="66" width="34" height="48" rx="5" fill="#f7edd8" opacity="0.98" /><path d="M19 72 H43 L39 90 H23 Z" fill="#0d7d49" opacity="0.95" /><text x="31" y="103" textAnchor="middle" fill="#0a6f41" fontSize="9" fontWeight="900">태라</text><text x="31" y="111" textAnchor="middle" fill="#b08a22" fontSize="3.8" fontWeight="800">LAGER</text><path d="M20 46 C18 67 18 110 24 134" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeLinecap="round" /><ellipse cx="31" cy="147" rx="19" ry="5" fill="rgba(0,0,0,0.15)" /></svg>
    : drink.id === 'whiskey'
    ? <svg viewBox="0 0 74 146" className="w-40 h-[28rem]" overflow="visible"><defs><linearGradient id="beam-like" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8a4f22" /><stop offset="100%" stopColor="#3b1f0c" /></linearGradient></defs><rect x="28" y="0" width="18" height="14" rx="2" fill="#111827" /><rect x="25" y="13" width="24" height="18" rx="4" fill="#5a2d12" /><path d="M14 34 H60 V126 Q60 140 37 140 Q14 140 14 126 Z" fill="url(#beam-like)" /><rect x="18" y="54" width="38" height="54" rx="3" fill="#f8f1df" opacity="0.98" /><circle cx="37" cy="63" r="6" fill="#b91c1c" opacity="0.9" /><text x="37" y="84" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="900">진빔</text><text x="37" y="96" textAnchor="middle" fill="#b91c1c" fontSize="4.2" fontWeight="800">KENTUCKY</text><path d="M21 40 C18 66 19 104 24 132" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" /></svg>
    : drink.id === 'yangju'
    ? <svg viewBox="0 0 74 146" className="w-40 h-[28rem]" overflow="visible"><defs><linearGradient id="mak-bottle" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#fff9e8" /><stop offset="100%" stopColor="#d9ceb2" /></linearGradient></defs><rect x="22" y="2" width="30" height="16" rx="6" fill="#e7dcc2" /><path d="M17 18 H57 L62 116 Q62 136 37 136 Q12 136 12 116 Z" fill="url(#mak-bottle)" stroke="rgba(120,92,45,0.35)" strokeWidth="2" /><rect x="16" y="82" width="42" height="42" fill="rgba(245,238,214,0.9)" /><rect x="18" y="52" width="38" height="36" rx="8" fill="#fff7df" opacity="0.98" /><path d="M22 60 H52" stroke="#7c5c22" strokeWidth="1" opacity="0.35" /><text x="37" y="74" textAnchor="middle" fill="#7c5c22" fontSize="7" fontWeight="800">막걸리</text><text x="37" y="84" textAnchor="middle" fill="#9a7b39" fontSize="4.2" fontWeight="700">생</text><ellipse cx="37" cy="138" rx="23" ry="5" fill="rgba(0,0,0,0.16)" /></svg>
    : <svg viewBox="0 0 58 146" className="w-36 h-[28rem]" overflow="visible"><defs><linearGradient id="cola-can" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ef4444" /><stop offset="52%" stopColor="#b91c1c" /><stop offset="100%" stopColor="#7f1d1d" /></linearGradient></defs><rect x="10" y="12" width="38" height="116" rx="11" fill="url(#cola-can)" /><ellipse cx="29" cy="13" rx="18" ry="6" fill="#e5e7eb" /><rect x="21" y="8" width="16" height="3" rx="1.5" fill="#9ca3af" /><ellipse cx="29" cy="128" rx="18" ry="6" fill="#991b1b" /><path d="M14 42 C26 28 37 34 45 23" stroke="rgba(255,255,255,0.82)" strokeWidth="5" fill="none" strokeLinecap="round" /><text x="29" y="82" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">코라</text><text x="29" y="95" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="4.5" fontWeight="700">CLASSIC</text></svg>;

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
  if (drinkId === 'soju') return <><div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,189,89,0.3),transparent_62%)]" /><div className="absolute right-10 top-21 pointer-events-none text-[11px] tracking-[0.35em] text-red-100/35">포차</div></>;
  if (drinkId === 'beer') return <><div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.22),transparent_60%)]" /><div className="absolute right-14 top-17 pointer-events-none text-base tracking-[0.3em] text-yellow-100/45">호프</div></>;
  if (drinkId === 'whiskey') return <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.18),transparent_58%)]" />;
  if (drinkId === 'yangju') return <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_60%)]" />;
  return <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.18),transparent_60%)]" />;
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
    setTimeout(() => {
      const nextCount = drinkCount + 1;
      setFillLevel(0); setDrinkCount(nextCount); setGlassState('empty'); flash(drink.moodLines[Math.min(nextCount - 1, drink.moodLines.length - 1)]); triggerRandomEvent();
    }, 980);
  };

  const handleSip = () => {
    if (fillLevel === 0 || glassState === 'drinking') return;
    setGlassState('drinking');
    flash('한모금 -');
    setTimeout(() => {
      const next = Math.max(fillLevel - Math.min(fillLevel, 0.2), 0);
      const isGlassEmpty = next <= 0.05;
      const nextCount = isGlassEmpty ? drinkCount + 1 : drinkCount;
      setFillLevel(next); setDrinkCount(nextCount); setGlassState(isGlassEmpty ? 'empty' : 'poured'); flash(drink.moodLines[Math.min(nextCount, drink.moodLines.length - 1)]); triggerRandomEvent();
    }, 860);
  };

  const handleToast = () => {
    if (fillLevel === 0) return flash('잔이 비어 있어서 짠할 수 없다.');
    if (isCheersing || glassState === 'drinking') return;
    setIsCheersing(true); setGlassState('toasting'); flash('짠!');
    setTimeout(() => { setIsCheersing(false); setGlassState('poured'); setFillLevel((prev) => Math.max(prev - 0.06, 0)); flash(scene.reactionTone[Math.floor(Math.random() * scene.reactionTone.length)]); }, 1350);
  };

  const handleChangeDrink = (id: DrinkId) => {
    if (id === currentDrink || drinkChanging) return;
    setDrinkChanging(true); autoRefillScheduled.current = false; setAutoRefillPending(false); setIsPouring(false);
    setTimeout(() => { setCurrentDrink(id); setGlassState('empty'); setFillLevel(0); setStatusText(DRINK_SCENES[id].ambientText); setFlashKey((prev) => prev + 1); setDrinkChanging(false); }, 280);
  };

  return (
    <motion.div className={`min-h-screen bg-gradient-to-b ${scene.bg} flex flex-col overflow-hidden relative`} style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined }}>
      <SceneDecor drinkId={currentDrink} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24rem] h-56 rounded-full opacity-25 pointer-events-none" style={{ background: `radial-gradient(ellipse, ${scene.lightColor}, transparent)` }} />
      <div className="relative z-10 flex justify-between items-center px-5 pt-5 pb-2"><span className="text-white/25 text-sm tracking-[0.25em]">{scene.name}</span><span className="text-white/35 text-base font-medium">{drink.name}</span><span className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-white/85 text-2xl font-bold tabular-nums shadow-lg">{drinkCount}잔</span></div>
      <div className="min-h-12 flex items-center justify-center px-8 mt-1 mb-1"><AnimatePresence mode="wait"><motion.p key={flashKey} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="text-white/60 text-base tracking-wide leading-relaxed text-center">{statusText}</motion.p></AnimatePresence></div>
      {newSnack && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/35 text-sm mb-1">{newSnack}</motion.p>}
      <div className="relative z-20 w-full px-5 mt-1"><div className="flex gap-2 justify-center flex-wrap">{drinkIds.map((id) => <motion.button key={id} whileTap={{ scale: 0.95 }} onClick={() => handleChangeDrink(id)} className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${currentDrink === id ? 'bg-white/18 border-white/30 text-white/90' : 'bg-white/[0.05] border-white/10 text-white/40 hover:bg-white/10 hover:text-white/65'}`}>{DRINKS[id].name}</motion.button>)}</div></div>
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className="w-full relative" style={{ background: `linear-gradient(to bottom, ${scene.tableColor}99, ${scene.tableColor}f2)` }}>
          <div className="absolute right-4 top-3"><div className="w-28 h-14 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center"><span className="text-white/30 text-sm text-center leading-tight px-2">{scene.snack.split(',')[0].trim()}</span></div></div>
          <AnimatePresence>{autoRefillPending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.55, 0.2] }} transition={{ repeat: Infinity, duration: 1.1 }} exit={{ opacity: 0 }} className="absolute top-3 left-5 text-white/35 text-sm tracking-[0.2em]">자동 리필 중</motion.div>}</AnimatePresence>
          <div className="flex items-end justify-center gap-28 pt-8 pb-6 px-5 scale-[0.78] origin-bottom">
            <AnimatePresence mode="wait"><motion.div key={`bottle-${currentDrink}`} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.88 : 1 }} transition={{ duration: 0.25 }}><BottleVisual drink={drink} pouring={isPouring} /></motion.div></AnimatePresence>
            <div className="flex flex-col items-center gap-4"><AnimatePresence mode="wait"><motion.div key={`glass-${currentDrink}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.85 : 1 }} transition={{ duration: 0.25 }}><GlassVisual drink={drink} fillLevel={fillLevel} state={glassState} /></motion.div></AnimatePresence><div className="flex gap-3">{[0.2, 0.45, 0.7, 0.95].map((level) => <div key={level} className={`w-3 h-3 rounded-full transition-all duration-500 ${fillLevel >= level ? 'bg-white/55' : 'bg-white/10'}`} />)}</div></div>
            <AnimatePresence>{isCheersing && <motion.div initial={{ opacity: 0, x: 48, scale: 0.7, rotate: -16 }} animate={{ opacity: 0.72, x: 0, scale: 1.12, rotate: -8 }} exit={{ opacity: 0, x: 48, scale: 0.7, rotate: -16 }} transition={{ type: 'spring', stiffness: 340, damping: 18 }} style={{ position: 'absolute', right: 22, bottom: 52 }}><svg viewBox="0 0 46 86" className="w-16 h-28"><clipPath id="toast-ghost-clip"><path d="M7 8 Q23 2 39 8 L34 78 Q23 84 12 78 Z" /></clipPath><rect x="0" y="18" width="46" height="68" fill="rgba(180,180,255,0.34)" clipPath="url(#toast-ghost-clip)" /><path d="M7 8 Q23 2 39 8 L34 78 Q23 84 12 78 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" /></svg></motion.div>}</AnimatePresence>
          </div>
        </div>
        <div className="w-full max-w-2xl px-5 mt-3 pb-4 grid grid-cols-3 gap-3"><ActionBtn onClick={handleShot} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="원샷" active={glassState === 'drinking'} /><ActionBtn onClick={handleSip} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="한모금" active={glassState === 'drinking'} highlight /><ActionBtn onClick={handleToast} disabled={fillLevel === 0 || isCheersing || glassState === 'drinking' || autoRefillPending} label="짠!" active={isCheersing} /></div>
      </div>
    </motion.div>
  );
}

export default function App() {
  return <MainScreen />;
}

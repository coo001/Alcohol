'use client';

// v1.1.0 — UI refinements
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, animate as fmAnimate } from 'framer-motion';
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
};

function GlassVisual({ drink, fillLevel, state }: { drink: Drink; fillLevel: number; state: DrinkState }) {
  const anim = state === 'drinking'
    ? { scale: 1.72, y: -220, rotate: -36, x: 6 }
    : state === 'toasting'
    ? { scale: 1.22, y: -36, rotate: 20, x: -52 }
    : { scale: 1, y: 0, rotate: 0, x: 0 };
  const springTransition = state === 'toasting'
    ? { type: 'spring' as const, stiffness: 480, damping: 9 }
    : { type: 'spring' as const, stiffness: 250, damping: 18 };

  if (drink.glassType === 'shot') {
    return (
      <motion.svg viewBox="0 0 92 100" className="w-56 h-72" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="shot-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.34)" /><stop offset="72%" stopColor="rgba(255,255,255,0.09)" /><stop offset="100%" stopColor="rgba(255,255,255,0.22)" /></linearGradient>
          <clipPath id="shot-clip"><path d="M23 18 Q46 9 69 18 L62 78 H30 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={18 + 58 * (1 - fillLevel)} width="92" height={58 * fillLevel} fill={drink.liquidColor} clipPath="url(#shot-clip)" />}
        {state === 'drinking' && fillLevel > 0.04 && <motion.ellipse cx={46} cy={18 + 58 * (1 - fillLevel)} rx={20} ry={1} fill="rgba(255,255,255,0.28)" clipPath="url(#shot-clip)" animate={{ ry: [0.4, 2.6, 0.3, 2.0, 0.4] }} transition={{ duration: 0.24, repeat: Infinity, ease: 'linear' }} />}
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
      <motion.svg viewBox="0 0 78 130" className="w-72 h-[28rem]" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="beer-glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.25)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
          <clipPath id="beer-clip"><path d="M16 16 L58 16 L54 116 L22 116 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={16 + 100 * (1 - fillLevel)} width="78" height={100 * fillLevel} fill={drink.liquidColor} clipPath="url(#beer-clip)" />}
        {state === 'drinking' && fillLevel > 0.04 && <motion.ellipse cx={37} cy={16 + 100 * (1 - fillLevel)} rx={18} ry={1} fill="rgba(255,255,255,0.24)" clipPath="url(#beer-clip)" animate={{ ry: [0.4, 2.2, 0.3, 1.8, 0.4] }} transition={{ duration: 0.24, repeat: Infinity, ease: 'linear' }} />}
        {fillLevel > 0.15 && drink.foamy && <ellipse cx="37" cy={16 + 100 * (1 - fillLevel) + 6} rx="22" ry="8" fill="rgba(255,255,255,0.94)" />}
        <path d="M16 16 L58 16 L54 116 L22 116 Z" fill="url(#beer-glass)" stroke="rgba(255,255,255,0.52)" strokeWidth="2.2" />
        <path d="M59 34 Q76 34 76 66 Q76 98 59 98" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="6" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (drink.glassType === 'rocks') {
    return (
      <motion.svg viewBox="0 0 96 82" className="w-72 h-72" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="rocks-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.26)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
          <clipPath id="rocks-clip"><path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" /></clipPath>
        </defs>
        {fillLevel > 0 && <rect x="0" y={13 + 58 * (1 - fillLevel)} width="96" height={58 * fillLevel} fill={drink.liquidColor} clipPath="url(#rocks-clip)" />}
        {state === 'drinking' && fillLevel > 0.04 && <motion.ellipse cx={48} cy={13 + 58 * (1 - fillLevel)} rx={26} ry={1} fill="rgba(255,255,255,0.22)" clipPath="url(#rocks-clip)" animate={{ ry: [0.4, 2.4, 0.3, 1.8, 0.4] }} transition={{ duration: 0.24, repeat: Infinity, ease: 'linear' }} />}
        {fillLevel > 0.18 && <><rect x="31" y="31" width="16" height="14" rx="3" fill="rgba(220,240,255,0.45)" clipPath="url(#rocks-clip)" /><rect x="50" y="27" width="14" height="13" rx="3" fill="rgba(220,240,255,0.38)" clipPath="url(#rocks-clip)" /></>}
        <path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" fill="url(#rocks-body)" stroke="rgba(255,255,255,0.54)" strokeWidth="2.6" />
        <path d="M23 70 Q48 77 73 70" stroke="rgba(255,255,255,0.36)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M26 15 C23 32 23 56 28 69" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (drink.glassType === 'highball') {
    return (
      <motion.svg viewBox="0 0 64 120" className="w-60 h-[24rem]" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
        <defs><clipPath id="highball-clip"><rect x="10" y="8" width="44" height="104" rx="6" /></clipPath></defs>
        {fillLevel > 0 && <rect x="0" y={8 + 104 * (1 - fillLevel)} width="64" height={104 * fillLevel} fill={drink.liquidColor} clipPath="url(#highball-clip)" />}
        <rect x="10" y="8" width="44" height="104" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.48)" strokeWidth="2.2" />
      </motion.svg>
    );
  }

  if (drink.id === 'yangju') {
    return (
      <motion.svg viewBox="0 0 96 78" className="w-72 h-[21rem]" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
        <defs>
          <linearGradient id="makgeolli-bowl" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f2eee4" /><stop offset="45%" stopColor="#b8b1a2" /><stop offset="100%" stopColor="#777165" /></linearGradient>
          <linearGradient id="makgeolli-metal-shine" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.55)" /><stop offset="45%" stopColor="rgba(255,255,255,0.08)" /><stop offset="100%" stopColor="rgba(0,0,0,0.18)" /></linearGradient>
          <clipPath id="makgeolli-clip"><path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" /></clipPath>
        </defs>
        <path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" fill="url(#makgeolli-bowl)" stroke="rgba(245,245,235,0.52)" strokeWidth="2.6" />
        <path d="M18 27 Q48 18 78 27 L72 58 Q65 68 48 68 Q31 68 24 58 Z" fill="url(#makgeolli-metal-shine)" opacity="0.72" />
        {fillLevel > 0 && <rect x="0" y={25 + 34 * (1 - fillLevel)} width="96" height={34 * fillLevel} fill={drink.liquidColor} opacity="0.9" clipPath="url(#makgeolli-clip)" />}
        {state === 'drinking' && fillLevel > 0.04 && <motion.ellipse cx={48} cy={25 + 34 * (1 - fillLevel)} rx={22} ry={1} fill="rgba(255,250,220,0.3)" clipPath="url(#makgeolli-clip)" animate={{ ry: [0.4, 2.0, 0.3, 1.6, 0.4] }} transition={{ duration: 0.24, repeat: Infinity, ease: 'linear' }} />}
        <ellipse cx="48" cy={25 + 34 * (1 - fillLevel)} rx="27" ry="7" fill="rgba(255,250,230,0.75)" clipPath="url(#makgeolli-clip)" />
        <ellipse cx="48" cy="23" rx="36" ry="12" fill="none" stroke="#ece7da" strokeWidth="5" />
        <ellipse cx="48" cy="23" rx="29" ry="8" fill="none" stroke="rgba(80,76,68,0.42)" strokeWidth="1.8" />
        <path d="M23 60 Q48 72 73 60" stroke="rgba(50,46,40,0.22)" strokeWidth="4" fill="none" />
        <path d="M28 31 C25 42 27 53 33 62" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      </motion.svg>
    );
  }

  return (
    <motion.svg viewBox="0 0 74 110" className="w-72 h-[25rem]" overflow="visible" animate={anim} transition={springTransition} style={{ transformOrigin: 'bottom center' }}>
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
          <svg viewBox="0 0 68 160" className="w-40 h-[30rem]" overflow="visible">
            <defs>
              <linearGradient id="soju-body" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.42)" /><stop offset="22%" stopColor="#9de8b4" /><stop offset="60%" stopColor="#52cc78" /><stop offset="100%" stopColor="#1e9048" /></linearGradient>
              <linearGradient id="soju-shine" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.58)" /><stop offset="40%" stopColor="rgba(255,255,255,0.15)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
            </defs>
            {/* 초록 포일 캡 */}
            <rect x="24" y="1" width="20" height="7" rx="3.5" fill="#0d7a38" />
            <rect x="22" y="7" width="24" height="14" rx="4" fill="#0b6b30" />
            <rect x="22" y="7" width="24" height="6" rx="3" fill="#18924a" />
            <rect x="24" y="1" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
            {/* 목 */}
            <rect x="25" y="20" width="18" height="8" rx="2" fill="#0d7838" />
            {/* 어깨 + 몸통 */}
            <path d="M13 52 C15 40 24 36 26 26 H42 C44 36 53 40 55 52 L57 152 H11 L13 52 Z" fill="url(#soju-body)" />
            <path d="M15 52 C17 43 24 38 28 28 H40 C43 38 50 43 53 52" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            {/* 흰 라벨 */}
            <rect x="11" y="65" width="46" height="64" rx="4" fill="#f5f9f2" opacity="0.97" />
            {/* 파란 물방울 그래픽 */}
            <path d="M23 73 C18 80 17 88 20 93 C22 98 27 98 28 93 C30 87 28 79 23 73 Z" fill="#52c8e2" />
            <path d="M23 73 C28 80 29 88 26 93 C24 98 20 98 20 93" fill="#3ab8d0" />
            {/* 참이슬 텍스트 */}
            <text x="40" y="95" textAnchor="middle" fill="#0d6b35" fontSize="9.5" fontWeight="900">참이슬</text>
            <text x="40" y="107" textAnchor="middle" fill="#3a9a5c" fontSize="4.8" fontWeight="700" letterSpacing="1">fresh</text>
            <path d="M16 115 Q22 112 28 115 Q34 118 40 115 Q46 112 52 115" stroke="#b8d8c8" strokeWidth="1.2" fill="none" opacity="0.55" />
            <text x="34" y="122" textAnchor="middle" fill="#aabba8" fontSize="3.5">360ml 16.9%</text>
            {/* 유리 하이라이트 */}
            <path d="M19 54 C16 78 17 118 22 149" stroke="url(#soju-shine)" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="13" y="150" width="42" height="8" rx="2.5" fill="rgba(8,80,38,0.32)" />
          </svg>
        </motion.div>
      </div>
    );
  }

  const body = drink.id === 'beer'
    ? <svg viewBox="0 0 62 162" className="w-[216px] h-[42rem]" overflow="visible"><defs><linearGradient id="terra-body" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.2)" /><stop offset="20%" stopColor="#1a7040" /><stop offset="65%" stopColor="#0a4e2c" /><stop offset="100%" stopColor="#062e18" /></linearGradient></defs>{/* 금색 왕관 캡 */}<ellipse cx="31" cy="8" rx="11" ry="4.5" fill="#e8a020" /><rect x="20" y="5" width="22" height="7" fill="#d4921a" /><ellipse cx="31" cy="5" rx="11" ry="4" fill="#f5be30" /><path d="M20 7 L22 4 L24 7 L26 4 L28 7 L30 4 L32 7 L34 4 L36 7 L38 4 L40 7 L42 4 L44 7" stroke="#d4921a" strokeWidth="1" fill="none" />{/* 긴 목 */}<rect x="24" y="8" width="14" height="38" rx="4" fill="#0a4e2c" />{/* 목 라벨 */}<rect x="24" y="20" width="14" height="16" rx="2" fill="#f5edd8" opacity="0.95" /><text x="31" y="31" textAnchor="middle" fill="#0d7a40" fontSize="7" fontWeight="900">T</text>{/* 어깨 */}<path d="M13 46 Q17 42 24 42 H38 Q45 42 49 46 L51 52 Q44 46 31 46 Q18 46 11 52 Z" fill="#0a4e2c" />{/* 몸통 */}<path d="M11 50 L51 50 L56 150 Q47 160 31 160 Q15 160 6 150 Z" fill="url(#terra-body)" />{/* 메인 라벨 */}<rect x="12" y="62" width="38" height="64" rx="4" fill="#f5f0e4" opacity="0.97" />{/* V 체브론 */}<polygon points="16,70 31,86 46,70 42,70 31,82 20,70" fill="#1a7a38" /><polygon points="16,76 31,92 46,76 42,76 31,88 20,76" fill="#1a7a38" opacity="0.45" /><text x="31" y="112" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="900" letterSpacing="1.2">TERRA</text><text x="31" y="121" textAnchor="middle" fill="#555" fontSize="3.8" fontWeight="600" letterSpacing="0.5">FROM AUS</text><path d="M17 52 C15 78 16 120 20 148" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" /><ellipse cx="31" cy="156" rx="24" ry="5" fill="rgba(0,0,0,0.18)" /></svg>
    : drink.id === 'whiskey'
    ? <svg viewBox="0 0 78 150" className="w-60 h-[42rem]" overflow="visible"><defs><linearGradient id="jimbeam-amber" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.38)" /><stop offset="22%" stopColor="rgba(210,155,75,0.78)" /><stop offset="68%" stopColor="rgba(175,115,45,0.85)" /><stop offset="100%" stopColor="rgba(130,80,25,0.62)" /></linearGradient><linearGradient id="jimbeam-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c8823a" /><stop offset="100%" stopColor="#7a4418" /></linearGradient></defs>{/* 검정 캡 */}<rect x="29" y="0" width="20" height="7" rx="3.5" fill="#111" /><rect x="27" y="6" width="24" height="14" rx="3" fill="#1a1a1a" /><rect x="27" y="6" width="24" height="6" rx="2" fill="#2a2a2a" />{/* 목 */}<rect x="28" y="19" width="22" height="16" rx="3" fill="rgba(190,130,60,0.9)" />{/* 넓은 어깨 - Jim Beam 특유 */}<path d="M12 35 Q16 33 28 33 H50 Q62 33 66 35 L68 44 Q60 36 39 36 Q18 36 10 44 Z" fill="rgba(175,115,45,0.9)" />{/* 사각형 몸통 */}<rect x="10" y="42" width="58" height="98" rx="5" fill="url(#jimbeam-fill)" /><rect x="10" y="42" width="58" height="98" rx="5" fill="url(#jimbeam-amber)" />{/* 흰 라벨 */}<rect x="12" y="48" width="54" height="82" rx="3" fill="white" opacity="0.97" />{/* 빨간 상단 밴드 */}<rect x="12" y="48" width="54" height="10" rx="3" fill="#cc1515" /><text x="39" y="78" textAnchor="middle" fill="#111" fontSize="11" fontWeight="900" fontStyle="italic">Jim</text><text x="39" y="92" textAnchor="middle" fill="#111" fontSize="11" fontWeight="900" fontStyle="italic">Beam</text><text x="39" y="105" textAnchor="middle" fill="#333" fontSize="4" fontWeight="700" letterSpacing="0.4">KENTUCKY STRAIGHT</text><text x="39" y="116" textAnchor="middle" fill="#cc1515" fontSize="7.5" fontWeight="900">Bourbon</text><text x="39" y="124" textAnchor="middle" fill="#333" fontSize="4.2" fontWeight="600">WHISKEY</text><path d="M18 44 C16 72 17 112 22 136" stroke="rgba(255,255,255,0.24)" strokeWidth="3.5" strokeLinecap="round" /><ellipse cx="39" cy="142" rx="30" ry="4.5" fill="rgba(0,0,0,0.2)" /></svg>
    : drink.id === 'yangju'
    ? <svg viewBox="0 0 80 162" className="w-40 h-[30rem]" overflow="visible"><defs><linearGradient id="mak-pet-body" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.7)" /><stop offset="35%" stopColor="rgba(240,237,224,0.92)" /><stop offset="75%" stopColor="rgba(215,210,192,0.82)" /><stop offset="100%" stopColor="rgba(185,180,160,0.65)" /></linearGradient><linearGradient id="mak-label-col" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2e8c38" /><stop offset="50%" stopColor="#1e6a28" /><stop offset="100%" stopColor="#144e1e" /></linearGradient></defs>{/* 초록 스크류 캡 */}<ellipse cx="40" cy="6" rx="15" ry="5.5" fill="#1a7030" /><rect x="25" y="3" width="30" height="9" rx="4.5" fill="#1a7030" /><ellipse cx="40" cy="3" rx="15" ry="5" fill="#2a9040" /><rect x="25" y="3" width="30" height="4" rx="2" fill="rgba(255,255,255,0.2)" />{/* 넓은 목 */}<rect x="28" y="11" width="24" height="16" rx="4" fill="#e4e0ce" />{/* 어깨 */}<path d="M12 27 Q18 24 28 24 H52 Q62 24 68 27 L70 35 Q60 28 40 28 Q20 28 10 35 Z" fill="#ddd8c4" />{/* 넓은 PET 몸통 */}<rect x="10" y="32" width="60" height="116" rx="6" fill="url(#mak-pet-body)" />{/* 초록 라벨 */}<rect x="10" y="46" width="60" height="84" rx="4" fill="url(#mak-label-col)" /><path d="M15 52 Q18 48 21 52 M59 52 Q62 48 65 52" stroke="#7acc80" strokeWidth="1.5" fill="none" opacity="0.7" />{/* 서울 브랜드 */}<circle cx="40" cy="64" r="10" fill="white" opacity="0.95" /><text x="40" y="62" textAnchor="middle" fill="#cc2020" fontSize="4" fontWeight="800">서울</text><text x="40" y="70" textAnchor="middle" fill="#1e6a28" fontSize="3.5" fontWeight="600">막걸리</text>{/* 장수 텍스트 */}<text x="40" y="100" textAnchor="middle" fill="white" fontSize="20" fontWeight="900" letterSpacing="2">장수</text><text x="40" y="116" textAnchor="middle" fill="#c8f0c8" fontSize="8.5" fontWeight="700" letterSpacing="0.5">생막걸리</text><rect x="10" y="126" width="60" height="4" fill="#144e1e" opacity="0.6" rx="2" /><path d="M18 34 C16 62 17 106 21 140" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" /><ellipse cx="40" cy="150" rx="32" ry="5" fill="rgba(0,0,0,0.14)" /></svg>
    : null;

  return <motion.div {...motionProps}>{body}</motion.div>;
}

// 술병→잔 스트림 좌표 (병 기울임 36° + translate(10,-10) 기준, 스케일 전 실제 픽셀)
const POUR_STREAM: Record<DrinkId, { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; w: number; h: number }> = {
  soju:    { x1: 372, y1:  82, cx: 380, cy: 155, x2: 384, y2: 216, w: 496, h: 480 },
  beer:    { x1: 345, y1: 103, cx: 374, cy: 148, x2: 400, y2: 120, w: 544, h: 476 },
  whiskey: { x1: 353, y1:  76, cx: 390, cy: 128, x2: 416, y2: 164, w: 560, h: 448 },
  yangju:  { x1: 353, y1:  76, cx: 388, cy: 112, x2: 416, y2: 131, w: 560, h: 448 },
};

function PourStream({ drink }: { drink: Drink }) {
  const s = POUR_STREAM[drink.id];
  const d = `M ${s.x1} ${s.y1} Q ${s.cx} ${s.cy} ${s.x2} ${s.y2}`;
  const liq = drink.liquidColor;
  return (
    <motion.svg
      className="absolute pointer-events-none"
      style={{ left: 0, top: 0, width: s.w, height: s.h, zIndex: 25 }}
      overflow="visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* 술 흐름 - 병 입구에서 잔까지 그려짐 */}
      <motion.path
        d={d}
        fill="none"
        stroke={liq}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
      {/* 반짝이는 흐름 효과 */}
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 14"
        style={{ animation: 'pourFlow 0.32s linear infinite', animationDelay: '0.22s' }}
      />
      {/* 잔에 닿는 물방울 */}
      {([-5, 0, 5] as const).map((dx, i) => (
        <motion.circle
          key={i}
          cx={s.x2 + dx}
          cy={s.y2}
          r={2.8}
          fill={liq}
          animate={{ opacity: [0, 0.85, 0], scale: [0.3, 1.3, 0] }}
          transition={{ duration: 0.42, repeat: Infinity, delay: 0.22 + i * 0.14, ease: 'easeOut' }}
        />
      ))}
    </motion.svg>
  );
}

function ActionBtn({ onClick, disabled, label, active, highlight }: { onClick: () => void; disabled: boolean; label: string; active?: boolean; highlight?: boolean }) {
  return (
    <motion.button whileTap={disabled ? {} : { scale: 0.95 }} onClick={onClick} disabled={disabled} className={`py-5 rounded-2xl text-lg font-medium tracking-wide transition-all duration-200 border ${disabled ? 'bg-white/[0.04] border-white/5 text-white/20 cursor-not-allowed' : active ? 'bg-white/28 border-white/40 text-white shadow-lg' : highlight ? 'bg-white/16 border-white/28 text-white hover:bg-white/20' : 'bg-white/[0.08] border-white/15 text-white/75 hover:bg-white/14'}`}>
      {label}
    </motion.button>
  );
}

function CheersGlass({ drink }: { drink: Drink }) {
  return (
    <motion.div
      style={{ position: 'absolute', right: 22, bottom: 52, zIndex: 30, transformOrigin: 'bottom center' }}
      initial={{ opacity: 0, x: 72, rotate: -24, scale: 0.9 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        x: [72, -130, -108, -130, 72],
        rotate: [-24, -18, -14, -18, -24],
        scale: [0.9, 1.22, 1.14, 1.22, 0.9],
      }}
      exit={{ opacity: 0, x: 72, rotate: -24, scale: 0.9 }}
      transition={{ duration: 1.35, times: [0, 0.34, 0.50, 0.64, 1.0] }}
    >
      {drink.glassType === 'shot' && (
        <svg viewBox="0 0 92 100" className="w-52 h-64" overflow="visible">
          <defs>
            <linearGradient id="cg-shot-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.34)" /><stop offset="72%" stopColor="rgba(255,255,255,0.09)" /><stop offset="100%" stopColor="rgba(255,255,255,0.22)" /></linearGradient>
            <clipPath id="cg-shot-clip"><path d="M23 18 Q46 9 69 18 L62 78 H30 Z" /></clipPath>
          </defs>
          <rect x="0" y="28" width="92" height="50" fill={drink.liquidColor} clipPath="url(#cg-shot-clip)" />
          <ellipse cx="46" cy="18" rx="23" ry="7" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
          <path d="M23 18 Q46 9 69 18 L62 78 H30 Z" fill="url(#cg-shot-body)" stroke="rgba(255,255,255,0.66)" strokeWidth="2.4" />
          <path d="M30 78 H62" stroke="rgba(255,255,255,0.52)" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 83 H58" stroke="rgba(0,0,0,0.22)" strokeWidth="4" strokeLinecap="round" />
          <path d="M34 25 C31 40 32 61 36 74" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {drink.glassType === 'beer' && (
        <svg viewBox="0 0 78 130" className="w-60 h-[22rem]" overflow="visible">
          <defs>
            <linearGradient id="cg-beer-glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.25)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
            <clipPath id="cg-beer-clip"><path d="M16 16 L58 16 L54 116 L22 116 Z" /></clipPath>
          </defs>
          <rect x="0" y="30" width="78" height="86" fill={drink.liquidColor} clipPath="url(#cg-beer-clip)" />
          {drink.foamy && <ellipse cx="37" cy="26" rx="22" ry="8" fill="rgba(255,255,255,0.92)" />}
          <path d="M16 16 L58 16 L54 116 L22 116 Z" fill="url(#cg-beer-glass)" stroke="rgba(255,255,255,0.52)" strokeWidth="2.2" />
          <path d="M59 34 Q76 34 76 66 Q76 98 59 98" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      )}
      {drink.glassType === 'rocks' && (
        <svg viewBox="0 0 96 82" className="w-60 h-60" overflow="visible">
          <defs>
            <linearGradient id="cg-rocks-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.26)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
            <clipPath id="cg-rocks-clip"><path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" /></clipPath>
          </defs>
          <rect x="0" y="20" width="96" height="52" fill={drink.liquidColor} clipPath="url(#cg-rocks-clip)" />
          <path d="M16 9 H80 L74 72 Q69 78 48 78 Q27 78 22 72 Z" fill="url(#cg-rocks-body)" stroke="rgba(255,255,255,0.54)" strokeWidth="2.6" />
          <path d="M23 70 Q48 77 73 70" stroke="rgba(255,255,255,0.36)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M26 15 C23 32 23 56 28 69" stroke="rgba(255,255,255,0.16)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {drink.id === 'yangju' && (
        <svg viewBox="0 0 96 78" className="w-60 h-[18rem]" overflow="visible">
          <defs>
            <linearGradient id="cg-mak-bowl" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f2eee4" /><stop offset="45%" stopColor="#b8b1a2" /><stop offset="100%" stopColor="#777165" /></linearGradient>
            <clipPath id="cg-mak-clip"><path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" /></clipPath>
          </defs>
          <path d="M12 23 Q48 11 84 23 L75 60 Q66 72 48 72 Q30 72 21 60 Z" fill="url(#cg-mak-bowl)" stroke="rgba(245,245,235,0.52)" strokeWidth="2.6" />
          <rect x="0" y="26" width="96" height="32" fill={drink.liquidColor} opacity="0.9" clipPath="url(#cg-mak-clip)" />
          <ellipse cx="48" cy={26 + 32 * 0.05} rx="27" ry="7" fill="rgba(255,250,230,0.75)" clipPath="url(#cg-mak-clip)" />
          <ellipse cx="48" cy="23" rx="36" ry="12" fill="none" stroke="#ece7da" strokeWidth="5" />
          <path d="M28 31 C25 42 27 53 33 62" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
    </motion.div>
  );
}

function ClinkEffect() {
  return (
    <motion.div
      style={{ position: 'absolute', right: 108, bottom: 108, zIndex: 50, width: 0, height: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 확장 플래시 링 */}
      <motion.div
        style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,228,100,0.95)', left: -40, top: -40 }}
        initial={{ scale: 0.06, opacity: 0 }}
        animate={{ scale: [0.06, 0.06, 2.0, 3.2], opacity: [0, 1, 0.65, 0] }}
        transition={{ duration: 1.35, times: [0, 0.30, 0.50, 1.0] }}
      />
      {/* 내부 흰 섬광 */}
      <motion.div
        style={{ position: 'absolute', width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,230,100,0.8) 45%, transparent 100%)', left: -18, top: -18 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0, 1.8, 0.3], opacity: [0, 1, 0.95, 0] }}
        transition={{ duration: 1.35, times: [0, 0.30, 0.40, 0.70] }}
      />
      {/* 두 번째 링 */}
      <motion.div
        style={{ position: 'absolute', width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,180,0.7)', left: -24, top: -24 }}
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [0.1, 0.1, 1.4, 2.5], opacity: [0, 0.9, 0.5, 0] }}
        transition={{ duration: 1.35, times: [0, 0.32, 0.46, 1.0] }}
      />
      {/* 스파크 라인 8개 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', width: 3, height: 30, background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(255,215,50,0.95)' : 'rgba(255,255,150,0.9)'}, transparent)`, borderRadius: 2, left: -1.5, top: -30, transformOrigin: 'bottom center', rotate: `${deg}deg` }}
          initial={{ scaleY: 0, opacity: 0, y: 0 }}
          animate={{ scaleY: [0, 0, 1, 0.5], opacity: [0, 1, 0.9, 0], y: [0, 0, -14, -28] }}
          transition={{ duration: 1.35, times: [0, 0.30, 0.44, 0.72] }}
        />
      ))}
      {/* 짧은 스파크 4개 (45° 오프셋) */}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
        <motion.div
          key={`s${i}`}
          style={{ position: 'absolute', width: 2, height: 18, background: 'linear-gradient(to top, rgba(255,200,50,0.8), transparent)', borderRadius: 2, left: -1, top: -18, transformOrigin: 'bottom center', rotate: `${deg}deg` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 0, 1, 0], opacity: [0, 0.8, 0.7, 0], y: [0, 0, -8, -18] }}
          transition={{ duration: 1.1, times: [0, 0.32, 0.50, 0.85] }}
        />
      ))}
      {/* ✦ 스파클 */}
      <motion.span
        style={{ position: 'absolute', left: -13, top: -50, color: 'rgba(255,240,100,0.98)', fontSize: 24, fontWeight: 900, lineHeight: 1, userSelect: 'none' }}
        initial={{ opacity: 0, scale: 0, y: 0 }}
        animate={{ opacity: [0, 0, 1, 0.85, 0], scale: [0, 0, 1.5, 1.1, 0.5], y: [0, 0, -8, -20, -34] }}
        transition={{ duration: 1.35, times: [0, 0.28, 0.38, 0.56, 0.88] }}
      >✦</motion.span>
      {/* 두 번째 스파클 */}
      <motion.span
        style={{ position: 'absolute', left: 8, top: -32, color: 'rgba(255,220,80,0.88)', fontSize: 14, fontWeight: 900, lineHeight: 1, userSelect: 'none' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 1.2, 0], y: [0, 0, -12, -24] }}
        transition={{ duration: 1.1, times: [0, 0.34, 0.46, 0.78] }}
      >✦</motion.span>
    </motion.div>
  );
}

function SceneDecor({ drinkId }: { drinkId: DrinkId }) {
  if (drinkId === 'soju') return <><div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,189,89,0.3),transparent_62%)]" /><div className="absolute right-10 top-21 pointer-events-none text-[11px] tracking-[0.35em] text-red-100/35">포차</div></>;
  if (drinkId === 'beer') return <><div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.22),transparent_60%)]" /><div className="absolute right-14 top-17 pointer-events-none text-base tracking-[0.3em] text-yellow-100/45">호프</div></>;
  if (drinkId === 'whiskey') return <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.18),transparent_58%)]" />;
  if (drinkId === 'yangju') return <div className="absolute inset-x-0 top-0 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_60%)]" />;
  return null;
}
function MainScreen() {
  const [currentDrink, setCurrentDrink] = useState<DrinkId>('soju');
  const [glassState, setGlassState] = useState<DrinkState>('empty');
  const [fillLevel, setFillLevel] = useState(0);
  const [drinkCounts, setDrinkCounts] = useState<Record<DrinkId, number>>({
    soju: 0,
    beer: 0,
    whiskey: 0,
    yangju: 0,
  });
  const [isPouring, setIsPouring] = useState(false);
  const [autoRefillPending, setAutoRefillPending] = useState(false);
  const [isCheersing, setIsCheersing] = useState(false);
  const [statusText, setStatusText] = useState(DRINK_SCENES.soju.ambientText);
  const [flashKey, setFlashKey] = useState(0);
  const [newSnack, setNewSnack] = useState('');
  const [drinkChanging, setDrinkChanging] = useState(false);
  const autoRefillScheduled = useRef(false);

  // 시각적 채움 레벨 - 부드러운 애니메이션용
  const visualFill = useMotionValue(0);
  const [renderFill, setRenderFill] = useState(0);
  useEffect(() => visualFill.on('change', setRenderFill), [visualFill]);

  const drink = DRINKS[currentDrink];
  const scene = DRINK_SCENES[currentDrink];
  const drinkIds: DrinkId[] = ['soju', 'beer', 'whiskey', 'yangju'];
  const currentDrinkCount = drinkCounts[currentDrink];
  const blurAmount = Math.min(Math.floor(currentDrinkCount / 3), 3) * 0.3;

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
        setFillLevel(0.92); fmAnimate(visualFill, 0.92, { duration: 0.45, ease: 'easeOut' }); setGlassState('poured'); setIsPouring(false); setAutoRefillPending(false); autoRefillScheduled.current = false; flash(scene.ambientText);
      }, 1450);
      return () => { clearTimeout(t1); clearTimeout(t2); autoRefillScheduled.current = false; };
    }
  }, [drink.pourLabel, drinkChanging, fillLevel, flash, glassState, scene.ambientText]);

  const handleShot = () => {
    if (fillLevel === 0) return flash('잔이 비어 있어서 원샷할 수 없다.');
    if (glassState === 'drinking') return;
    setGlassState('drinking');
    flash('원샷 -');
    // 잔이 기울자마자 술이 바로 입으로 들어옴 — 짧은 딜레이 후 일정한 속도로 비워짐
    const shotStart = visualFill.get();
    fmAnimate(visualFill, [shotStart, shotStart * 0.96, 0], {
      times: [0, 0.18, 1],
      duration: 0.62,
      delay: 0.18,
      ease: ['easeOut', 'linear'],
    });
    setTimeout(() => {
      const drinkId = currentDrink;
      const nextCount = drinkCounts[drinkId] + 1;
      setFillLevel(0); setDrinkCounts((prev) => ({ ...prev, [drinkId]: nextCount })); setGlassState('empty'); flash(drink.moodLines[Math.min(nextCount - 1, drink.moodLines.length - 1)]); triggerRandomEvent();
    }, 980);
  };

  const handleSip = () => {
    if (fillLevel === 0 || glassState === 'drinking') return;
    setGlassState('drinking');
    flash('한모금 -');
    const next = Math.max(fillLevel - Math.min(fillLevel, 0.2), 0);
    // 한 모금: 입에 닿는 순간부터 자연스럽게 삼키고 멈춤
    fmAnimate(visualFill, next, { duration: 0.38, delay: 0.14, ease: [0.22, 0, 0.42, 1] });
    setTimeout(() => {
      const isGlassEmpty = next <= 0.05;
      const drinkId = currentDrink;
      const nextCount = isGlassEmpty ? drinkCounts[drinkId] + 1 : drinkCounts[drinkId];
      setFillLevel(next); setDrinkCounts((prev) => isGlassEmpty ? { ...prev, [drinkId]: nextCount } : prev); setGlassState(isGlassEmpty ? 'empty' : 'poured'); flash(drink.moodLines[Math.min(nextCount, drink.moodLines.length - 1)]); triggerRandomEvent();
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
    setDrinkChanging(true); autoRefillScheduled.current = false; setAutoRefillPending(false); setIsPouring(false); visualFill.set(0);
    setTimeout(() => { setCurrentDrink(id); setGlassState('empty'); setFillLevel(0); setStatusText(DRINK_SCENES[id].ambientText); setFlashKey((prev) => prev + 1); setDrinkChanging(false); }, 280);
  };

  return (
    <motion.div className={`h-screen bg-gradient-to-b ${scene.bg} flex flex-col overflow-hidden relative`} style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined }}>
      <SceneDecor drinkId={currentDrink} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[24rem] h-56 rounded-full opacity-25 pointer-events-none" style={{ background: `radial-gradient(ellipse, ${scene.lightColor}, transparent)` }} />
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
        <span className="text-white/25 text-sm tracking-[0.25em]">{scene.name}</span>
        <span className="text-white/35 text-base font-medium">{drink.name}</span>
        <div className="flex items-center gap-2 flex-wrap justify-end max-w-[160px]">
          {drinkIds.filter((id) => drinkCounts[id] > 0).map((id) => (
            <span key={id} className="text-white/70 text-xs font-medium tabular-nums whitespace-nowrap">
              {DRINKS[id].name} {drinkCounts[id]}잔
            </span>
          ))}
        </div>
      </div>
      <div className="min-h-12 flex items-center justify-center px-8 mt-1 mb-1"><AnimatePresence mode="wait"><motion.p key={flashKey} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="text-white/60 text-base tracking-wide leading-relaxed text-center">{statusText}</motion.p></AnimatePresence></div>
      {newSnack && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/35 text-sm mb-1">{newSnack}</motion.p>}
      <div className="relative z-20 w-full px-5 mt-1"><div className="flex gap-2 justify-center flex-wrap">{drinkIds.map((id) => <motion.button key={id} whileTap={{ scale: 0.95 }} onClick={() => handleChangeDrink(id)} className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${currentDrink === id ? 'bg-white/18 border-white/30 text-white/90' : 'bg-white/[0.05] border-white/10 text-white/40 hover:bg-white/10 hover:text-white/65'}`}><span>{DRINKS[id].name}</span></motion.button>)}</div></div>
      <div className="flex-1 min-h-0 flex flex-col items-center justify-end overflow-hidden">
        <div className="w-full relative" style={{ background: `linear-gradient(to bottom, ${scene.tableColor}99, ${scene.tableColor}f2)` }}>
          <div className="absolute right-4 top-3"><div className="w-28 h-14 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center"><span className="text-white/30 text-sm text-center leading-tight px-2">{scene.snack.split(',')[0].trim()}</span></div></div>
          <AnimatePresence>{autoRefillPending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.55, 0.2] }} transition={{ repeat: Infinity, duration: 1.1 }} exit={{ opacity: 0 }} className="absolute top-3 left-5 text-white/35 text-sm tracking-[0.2em]">자동 리필 중</motion.div>}</AnimatePresence>
          <div className="flex items-end justify-center pt-8 pb-6 px-5 scale-[0.78] origin-bottom">
            <div className="relative flex items-end gap-28">
              <AnimatePresence mode="wait"><motion.div key={`bottle-${currentDrink}`} initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.88 : 1 }} transition={{ duration: 0.25 }}><BottleVisual drink={drink} pouring={isPouring} /></motion.div></AnimatePresence>
              <AnimatePresence>{isPouring && <PourStream key={`stream-${currentDrink}`} drink={drink} />}</AnimatePresence>
              <div className="flex flex-col items-center gap-4"><AnimatePresence mode="wait"><motion.div key={`glass-${currentDrink}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: drinkChanging ? 0 : 1, scale: drinkChanging ? 0.85 : 1 }} transition={{ duration: 0.25 }}><GlassVisual drink={drink} fillLevel={renderFill} state={glassState} /></motion.div></AnimatePresence><div className="flex gap-3">{[0.2, 0.45, 0.7, 0.95].map((level) => <div key={level} className={`w-3 h-3 rounded-full transition-all duration-500 ${fillLevel >= level ? 'bg-white/55' : 'bg-white/10'}`} />)}</div></div>
            </div>
            <AnimatePresence>{isCheersing && <CheersGlass key="cheers-glass" drink={drink} />}{isCheersing && <ClinkEffect key="clink-effect" />}</AnimatePresence>
          </div>
        </div>
        <div className="w-full max-w-2xl px-5 mt-3 pb-4 grid grid-cols-3 gap-3 flex-shrink-0"><ActionBtn onClick={handleShot} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="원샷" active={glassState === 'drinking'} /><ActionBtn onClick={handleSip} disabled={fillLevel === 0 || glassState === 'drinking' || isPouring || autoRefillPending} label="한모금" active={glassState === 'drinking'} highlight /><ActionBtn onClick={handleToast} disabled={fillLevel === 0 || isCheersing || glassState === 'drinking' || autoRefillPending} label="짠!" active={isCheersing} /></div>
      </div>
    </motion.div>
  );
}

export default function App() {
  return <MainScreen />;
}

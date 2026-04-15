export type DrinkState = 'empty' | 'poured' | 'lifted' | 'drinking' | 'toasting';

export type DrinkId = 'soju' | 'beer' | 'whiskey' | 'yangju' | 'soft';

export type AmbienceId = 'pocha' | 'hof' | 'bar' | 'home';

export interface Drink {
  id: DrinkId;
  name: string;
  glassType: 'shot' | 'beer' | 'rocks' | 'highball' | 'cup';
  bottleColor: string;
  liquidColor: string;
  foamy: boolean;
  label: string;
  pourLabel: string;
  drinkLabel: string;
  toastLabel: string;
  liftLabel: string;
  emptyLabel: string;
  moodLines: string[];
  reactions: string[];
}

export interface Ambience {
  id: AmbienceId;
  name: string;
  bg: string;
  tableColor: string;
  lightColor: string;
  snack: string;
  ambientText: string;
  reactionTone: string[];
}

export const DRINKS: Record<DrinkId, Drink> = {
  soju: {
    id: 'soju',
    name: '소주',
    glassType: 'shot',
    bottleColor: '#4ade80',
    liquidColor: 'rgba(220,240,255,0.85)',
    foamy: false,
    label: '참이슬',
    pourLabel: '따른다',
    drinkLabel: '원샷',
    toastLabel: '짠!',
    liftLabel: '잔을 든다',
    emptyLabel: '한 잔 더 따를까',
    moodLines: [
      '잔이 차갑다.',
      '한 모금, 목이 따뜻해진다.',
      '두 모금째. 어깨가 풀린다.',
      '이 느낌이 좋다.',
      '한 잔 더.',
    ],
    reactions: [
      '잔이 쓸쓸하게 비었다.',
      '조금 더 부어줄게.',
      '이 정도면 됐어.',
      '오늘 좋다.',
    ],
  },
  beer: {
    id: 'beer',
    name: '맥주',
    glassType: 'beer',
    bottleColor: '#a16207',
    liquidColor: 'rgba(251,191,36,0.75)',
    foamy: true,
    label: 'HITE',
    pourLabel: '따른다',
    drinkLabel: '한 모금',
    toastLabel: '건배!',
    liftLabel: '잔을 든다',
    emptyLabel: '한 잔 더?',
    moodLines: [
      '거품이 천천히 가라앉는다.',
      '시원하다. 진짜로.',
      '한 모금 더. 기분 좋다.',
      '캬— 이 맛이지.',
      '한 잔 더 시킬까.',
    ],
    reactions: [
      '잔이 비었다.',
      '거품이 남았다.',
      '시원한 맛이다.',
      '더 마실 수 있겠어.',
    ],
  },
  whiskey: {
    id: 'whiskey',
    name: '위스키',
    glassType: 'rocks',
    bottleColor: '#92400e',
    liquidColor: 'rgba(180,100,20,0.7)',
    foamy: false,
    label: 'Jameson',
    pourLabel: '온더락',
    drinkLabel: '한 모금',
    toastLabel: 'Cheers',
    liftLabel: '잔을 든다',
    emptyLabel: '한 잔 더 따를게',
    moodLines: [
      '얼음이 부딪히는 소리.',
      '향이 먼저 온다.',
      '천천히, 음미하며.',
      '이런 밤도 나쁘지 않다.',
      '한 잔 더.',
    ],
    reactions: [
      '얼음이 녹아간다.',
      '향이 진하다.',
      '오늘은 이 정도면 됐어.',
      '잔이 비었다.',
    ],
  },
  yangju: {
    id: 'yangju',
    name: '양주',
    glassType: 'highball',
    bottleColor: '#1e3a5f',
    liquidColor: 'rgba(200,160,80,0.65)',
    foamy: false,
    label: 'Chivas',
    pourLabel: '따른다',
    drinkLabel: '한 모금',
    toastLabel: 'Cheers',
    liftLabel: '잔을 든다',
    emptyLabel: '한 잔 더?',
    moodLines: [
      '묵직한 향이 올라온다.',
      '부드럽게 넘어간다.',
      '이 느낌 좋다.',
      '천천히 마시기로 한다.',
      '오늘 밤이 길다.',
    ],
    reactions: [
      '잔이 비었다.',
      '향이 진하게 남는다.',
      '한 잔 더 따를게.',
      '좋은 밤이다.',
    ],
  },
  soft: {
    id: 'soft',
    name: '음료',
    glassType: 'cup',
    bottleColor: '#dc2626',
    liquidColor: 'rgba(220,50,50,0.7)',
    foamy: false,
    label: 'Cola',
    pourLabel: '따른다',
    drinkLabel: '한 모금',
    toastLabel: '짠!',
    liftLabel: '잔을 든다',
    emptyLabel: '한 잔 더?',
    moodLines: [
      '달콤한 탄산이 올라온다.',
      '가볍게 한 모금.',
      '오늘 밤도 이렇게.',
      '분위기는 충분하다.',
      '또 한 잔.',
    ],
    reactions: [
      '잔이 비었다.',
      '탄산이 살아있다.',
      '가볍고 좋다.',
      '한 잔 더.',
    ],
  },
};

export const AMBIENCES: Record<AmbienceId, Ambience> = {
  pocha: {
    id: 'pocha',
    name: '포차',
    bg: 'from-orange-950 via-red-950 to-stone-950',
    tableColor: '#3d2b1f',
    lightColor: '#f97316',
    snack: '김치전, 어묵탕',
    ambientText: '천막 아래, 어딘가에서 TV 소리.',
    reactionTone: ['주인장이 슬쩍 봤다.', '옆 테이블도 한창이다.', '밖에 비가 오는 것 같다.', '여기 단골이 될 것 같다.'],
  },
  hof: {
    id: 'hof',
    name: '호프집',
    bg: 'from-yellow-950 via-amber-950 to-stone-950',
    tableColor: '#3b2f1a',
    lightColor: '#fbbf24',
    snack: '치킨, 감자튀김',
    ambientText: '웅성웅성, 어디선가 웃음소리.',
    reactionTone: ['맞은편 자리가 시끄럽다.', '치맥이 여기서 나왔지.', '잔이 비면 자동으로 시킨다.', '오늘 이기는 팀이 쏜다.'],
  },
  bar: {
    id: 'bar',
    name: '바',
    bg: 'from-slate-950 via-zinc-900 to-slate-950',
    tableColor: '#1c1917',
    lightColor: '#818cf8',
    snack: '올리브, 견과류',
    ambientText: '재즈가 낮게 깔린다.',
    reactionTone: ['바텐더가 눈을 맞췄다.', '조용한 밤이다.', '잔이 빛을 받아 반짝인다.', '이런 곳이 좋다.'],
  },
  home: {
    id: 'home',
    name: '집술',
    bg: 'from-stone-900 via-zinc-900 to-stone-950',
    tableColor: '#292524',
    lightColor: '#a78bfa',
    snack: '라면, 과자',
    ambientText: '혼자 틀어둔 유튜브 소리.',
    reactionTone: ['편하다, 이게 최고야.', '아무도 없어서 좋다.', '잔 하나면 충분해.', '오늘도 이렇게 끝이네.'],
  },
};

export const RANDOM_EVENTS = [
  { id: 'refill', text: '누군가 잔을 채워줬다.', effect: 'refill' as const },
  { id: 'toast', text: '"한 잔 하자" 제안이 들어왔다.', effect: 'toast' as const },
  { id: 'ice', text: '얼음이 추가됐다.', effect: 'ice' as const },
  { id: 'snack', text: '안주가 새로 나왔다.', effect: 'snack' as const },
  { id: 'noise', text: '주변이 갑자기 시끌시끌해졌다.', effect: 'noise' as const },
];

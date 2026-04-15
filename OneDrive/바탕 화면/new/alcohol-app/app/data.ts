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
    label: '침이슬',
    pourLabel: '소주를 다시 따른다.',
    drinkLabel: '한 모금',
    toastLabel: '짠!',
    liftLabel: '잔을 든다',
    emptyLabel: '술잔이 비어 있다.',
    moodLines: [
      '목이 시원하게 풀린다.',
      '한 모금 더 들어가니 템포가 오른다.',
      '조금씩 분위기가 달아오른다.',
      '이제 슬슬 취기가 돈다.',
      '오늘 술이 꽤 잘 들어간다.',
    ],
    reactions: [
      '소주 향이 깔끔하게 올라온다.',
      '잔이 가볍게 비워진다.',
      '한 잔 더 생각나는 흐름이다.',
      '포차 분위기가 더 살아난다.',
    ],
  },
  beer: {
    id: 'beer',
    name: '맥주',
    glassType: 'beer',
    bottleColor: '#a16207',
    liquidColor: 'rgba(251,191,36,0.75)',
    foamy: true,
    label: '태라',
    pourLabel: '맥주를 다시 따른다.',
    drinkLabel: '한 모금',
    toastLabel: '건배!',
    liftLabel: '잔을 든다',
    emptyLabel: '맥주잔이 비어 있다.',
    moodLines: [
      '거품 뒤로 시원함이 바로 올라온다.',
      '목 넘김이 훨씬 가볍다.',
      '한 모금만으로도 텐션이 산다.',
      '치킨이 생각나는 타이밍이다.',
      '오늘은 맥주가 정답이다.',
    ],
    reactions: [
      '거품이 잔 벽을 따라 흐른다.',
      '시원한 느낌이 확실하다.',
      '잔이 금방 또 비워질 것 같다.',
      '호프집 분위기가 잘 붙는다.',
    ],
  },
  whiskey: {
    id: 'whiskey',
    name: '위스키',
    glassType: 'rocks',
    bottleColor: '#92400e',
    liquidColor: 'rgba(180,100,20,0.7)',
    foamy: false,
    label: '진빔',
    pourLabel: '위스키를 천천히 따른다.',
    drinkLabel: '한 모금',
    toastLabel: '치얼스',
    liftLabel: '잔을 든다',
    emptyLabel: '잔에 위스키가 거의 없다.',
    moodLines: [
      '묵직한 향이 천천히 돈다.',
      '입안에 오크향이 남는다.',
      '속도가 아니라 결이 중요한 술이다.',
      '조용한 바 분위기가 잘 어울린다.',
      '오늘은 천천히 길게 가는 밤이다.',
    ],
    reactions: [
      '얼음이 잔 안에서 낮게 울린다.',
      '향이 조금 더 진해진다.',
      '한 모금 뒤 여운이 길다.',
      '조명이 잔 표면에 잔잔하게 번진다.',
    ],
  },
  yangju: {
    id: 'yangju',
    name: '막걸리',
    glassType: 'cup',
    bottleColor: '#f3ead0',
    liquidColor: 'rgba(245,238,214,0.82)',
    foamy: false,
    label: '막걸리',
    pourLabel: '막걸리를 다시 채운다.',
    drinkLabel: '한 모금',
    toastLabel: '건배',
    liftLabel: '잔을 든다',
    emptyLabel: '잔이 거의 비었다.',
    moodLines: [
      '구수한 향이 부드럽게 올라온다.',
      '한 모금 마시니 전집 분위기가 난다.',
      '막걸리 특유의 산뜻함이 남는다.',
      '오늘은 천천히 나눠 마시기 좋다.',
      '잔 하나에도 편한 무드가 생긴다.',
    ],
    reactions: [
      '잔 안에 뽀얀 막걸리가 살짝 흔들린다.',
      '전 냄새와 막걸리 향이 같이 퍼진다.',
      '편하고 구수한 분위기다.',
      '한 잔 더 나눠 마시기 좋다.',
    ],
  },
  soft: {
    id: 'soft',
    name: '콜라',
    glassType: 'cup',
    bottleColor: '#dc2626',
    liquidColor: 'rgba(220,50,50,0.7)',
    foamy: false,
    label: '코라',
    pourLabel: '콜라를 다시 따른다.',
    drinkLabel: '한 모금',
    toastLabel: '짠!',
    liftLabel: '잔을 든다',
    emptyLabel: '컵이 비어 있다.',
    moodLines: [
      '탄산이 톡 하고 올라온다.',
      '가볍게 한 모금 넘긴다.',
      '분식집 분위기와 잘 붙는다.',
      '속도감 있게 분위기가 산다.',
      '시원하게 계속 들어간다.',
    ],
    reactions: [
      '탄산 거품이 빠르게 올라온다.',
      '컵 가장자리에 작은 물방울이 맺힌다.',
      '가볍고 산뜻한 흐름이다.',
      '분식집 조명 아래 더 선명해 보인다.',
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
    ambientText: '천막 아래 작은 테이블과 TV 소리가 어우러진다.',
    reactionTone: ['옆 테이블 웃음소리가 번진다.', '포차 특유의 열기가 돈다.', '바깥 공기와 실내 온기가 섞인다.', '지금 분위기가 제대로 올라온다.'],
  },
  hof: {
    id: 'hof',
    name: '호프집',
    bg: 'from-yellow-950 via-amber-950 to-stone-950',
    tableColor: '#3b2f1a',
    lightColor: '#fbbf24',
    snack: '치킨, 감자튀김',
    ambientText: '네온 아래 웃음소리와 잔 부딪히는 소리가 섞인다.',
    reactionTone: ['맥주잔이 반짝인다.', '튀김 냄새가 은근히 돈다.', '한 잔 더 시키기 좋은 분위기다.', '호프집 특유의 소란이 살아 있다.'],
  },
  bar: {
    id: 'bar',
    name: '바',
    bg: 'from-slate-950 via-zinc-900 to-slate-950',
    tableColor: '#1c1917',
    lightColor: '#818cf8',
    snack: '올리브, 견과류',
    ambientText: '낮은 조명과 잔잔한 음악이 공간을 채운다.',
    reactionTone: ['바텐더의 손길이 정교하다.', '잔 표면에 조명이 조용히 흐른다.', '대화도 톤이 낮아진다.', '오늘은 여유 있게 마시기 좋다.'],
  },
  home: {
    id: 'home',
    name: '집술',
    bg: 'from-stone-900 via-zinc-900 to-stone-950',
    tableColor: '#292524',
    lightColor: '#a78bfa',
    snack: '라면, 과자',
    ambientText: '편한 의자와 작은 소음이 느긋한 분위기를 만든다.',
    reactionTone: ['혼자 마셔도 리듬이 있다.', '부담 없이 한 잔 더 가능하다.', '편한 공간이라 템포가 느슨하다.', '오늘은 집술도 충분히 좋다.'],
  },
};

export const RANDOM_EVENTS = [
  { id: 'refill', text: '옆자리에서 잔을 채워 준다.', effect: 'refill' as const },
  { id: 'toast', text: '"한 잔 하자"는 제안이 들어온다.', effect: 'toast' as const },
  { id: 'ice', text: '얼음이 살짝 부딪히며 소리를 낸다.', effect: 'ice' as const },
  { id: 'snack', text: '안주가 새로 한 접시 더 나왔다.', effect: 'snack' as const },
  { id: 'noise', text: '주변 대화가 잠깐 더 커졌다.', effect: 'noise' as const },
];

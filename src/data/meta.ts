import type { PersonaCode, SeriesKey, SiteFloor, StayType, CampsiteTag } from '../types/content';

export const SERIES: Record<SeriesKey, { label: string; order: number }> = {
  choose: { label: '① 고르기', order: 1 },
  understand: { label: '② 이해하기', order: 2 },
  prepare: { label: '③ 준비하기', order: 3 },
  return: { label: '④ 다녀오기', order: 4 },
};

// 페르소나 라벨은 상위 기획안 3장 정의로 교체 필요 (현재 가안)
export const PERSONAS: Record<PersonaCode, string> = {
  A: '장비 없이 가볍게',
  B: '아이와 함께',
  C: '오토캠핑 입문',
  D: '친구들과 함께',
  E: '혼자 떠나는 솔캠',
  F: '반려견과 함께',
  G: '편하게 즐기는 커플',
  H: '카라반이 궁금한',
};

export const STAY_LABEL: Record<StayType, string> = {
  auto: '오토캠핑',
  glamping: '글램핑',
  caravan: '카라반',
};

export const FLOOR_LABEL: Record<SiteFloor, string> = {
  gravel: '파쇄석',
  deck: '데크',
  grass: '잔디',
  masato: '마사토',
};

export const TAG_LABEL: Record<CampsiteTag, string> = {
  beginner: '초보 환영',
  pet: '애견 동반',
  freeCancel: '무료 취소',
  rental: '장비 대여',
  kids: '키즈 시설',
  solo: '1인 예약',
  heating: '난방',
  pitchingHelp: '피칭 도움',
  group: '단체 사이트',
  nearFacility: '관리동 가까움',
  nightLight: '야간 조명',
};

/** 16편 전체 목록 (기획안 2장). '다음에 읽을 글'에서 미발행 편을 표시하는 데 쓴다 */
export const CATALOG: { id: string; series: SeriesKey; title: string; release: 'wave1' | 'wave2' }[] = [
  { id: 'G-01', series: 'choose', title: '오토캠핑 vs 글램핑 vs 카라반, 나한테 맞는 건?', release: 'wave1' },
  { id: 'G-02', series: 'choose', title: '서울에서 1시간, 초보가 실패 없는 캠핑장 10', release: 'wave1' },
  { id: 'G-03', series: 'choose', title: '혼자 가도 괜찮을까? 솔캠 첫 캠핑장 고르기', release: 'wave2' },
  { id: 'G-04', series: 'choose', title: '우리 강아지와 첫캠핑, 애견 동반 캠핑장 고르는 법', release: 'wave1' },
  { id: 'U-01', series: 'understand', title: '파쇄석·데크·잔디, 사이트 바닥 1분 정리', release: 'wave1' },
  { id: 'U-02', series: 'understand', title: '취소·환불 규정, 이것만 보면 된다', release: 'wave1' },
  { id: 'U-03', series: 'understand', title: '글램핑 가격, 왜 이렇게 차이 날까?', release: 'wave2' },
  { id: 'U-04', series: 'understand', title: '카라반 안은 어떻게 생겼을까? 내부 미리보기', release: 'wave2' },
  { id: 'P-01', series: 'prepare', title: '장비 없이 가는 첫캠핑 체크리스트', release: 'wave1' },
  { id: 'P-02', series: 'prepare', title: '첫 텐트 피칭 5분 영상', release: 'wave2' },
  { id: 'P-03', series: 'prepare', title: '아이와 첫캠핑, 준비물과 안전 수칙', release: 'wave2' },
  { id: 'P-04', series: 'prepare', title: '겨울 첫캠핑, 난방 걱정 없는 캠핑장과 준비물', release: 'wave1' },
  { id: 'D-01', series: 'return', title: '첫캠퍼 후기: 아이랑 다녀온 1박 2일', release: 'wave2' },
  { id: 'D-02', series: 'return', title: '첫캠퍼 후기: 혼자 다녀온 첫 솔캠', release: 'wave2' },
  { id: 'D-03', series: 'return', title: '친구 넷이 첫캠핑, 비용 정산까지', release: 'wave2' },
  { id: 'D-04', series: 'return', title: '이번 주말 날씨 좋은 초보 캠핑장', release: 'wave1' },
];

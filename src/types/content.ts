// 기획안 5장 데이터 구조. 컨텐츠 1편 = GuideContent JSON 1개.

export type SeriesKey = 'choose' | 'understand' | 'prepare' | 'return';
export type PersonaCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type StayType = 'auto' | 'glamping' | 'caravan';
export type SiteFloor = 'gravel' | 'deck' | 'grass' | 'masato';
export type CampsiteTag =
  | 'beginner'
  | 'pet'
  | 'freeCancel'
  | 'rental'
  | 'kids'
  | 'solo'
  | 'heating'
  | 'pitchingHelp'
  | 'group'
  | 'nearFacility'
  | 'nightLight';

export interface Campsite {
  id: string;
  name: string;
  region: string;
  driveMinFromSeoul: number;
  stayTypes: StayType[];
  siteFloor: SiteFloor[];
  priceFrom: number;
  tags: CampsiteTag[];
  rating: number;
  availableThisWeekend: boolean;
  thumbnail: string;
  detailUrl: string;
  // 목업 확장 필드 (검색 API 연동 시 확인 필요)
  petMaxKg?: number;
  weekendWeather?: { icon: 'sun' | 'cloud' | 'rain'; rainProb: number; minTemp: number };
}

/** 큐레이션·본문 리스트 공통 필터. 모든 조건은 AND, anyOf 내부는 OR */
export interface CampsiteFilter {
  tags?: CampsiteTag[];
  stayTypes?: StayType[];
  siteFloor?: SiteFloor[];
  maxDriveMin?: number;
  availableThisWeekend?: boolean;
  ids?: string[];
  /** U-03: 가격대 (priceFrom 기준) */
  minPrice?: number;
  maxPrice?: number;
  anyOf?: Omit<CampsiteFilter, 'anyOf'>[];
  /** G-01: 진단 테스트 결과 유형을 stayTypes 조건으로 사용 */
  fromQuiz?: boolean;
  /** G-04: 반려견 무게 조건 */
  petWeightKg?: number;
}

export interface Curation extends CampsiteFilter {
  sort?: 'rating' | 'drive' | 'price';
  limit?: number;
  /** D-01·D-02: 인터뷰 속 캠핑장처럼 맨 앞에 고정할 캠핑장 */
  pin?: string[];
}

// ───────── 블록 14종 (기획안 4장) ─────────

export interface TextBlock { type: 'text'; heading?: string; body: string }
export interface CalloutBlock { type: 'callout'; tone: 'tip' | 'warn'; text: string }
export interface ImageBlock { type: 'image'; src: string; alt: string; caption?: string }

export interface CompareTableBlock {
  type: 'compareTable';
  title?: string;
  columns: { key: string; label: string }[];
  rows: { label: string; values: string[] }[];
  highlight?: string;
  /** 'quiz' 이면 진단 결과 유형과 같은 key 열을 강조 */
  highlightFrom?: 'quiz';
  /** U-03: 열 선택 → 큐레이션 필터 적용 */
  selectable?: { filters: Record<string, CampsiteFilter>; buttonLabel: string };
}

export interface QuizBlock {
  type: 'quiz';
  title?: string;
  questions: {
    id: string;
    text: string;
    options: { label: string; scores: Partial<Record<StayType, number>>; persona?: PersonaCode }[];
  }[];
  results: Record<StayType, { title: string; desc: string }>;
}

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  /** G-03: 체크하면 이 조건이 캠핑장 추천 필터 칩으로 켜진다 */
  filter?: CampsiteFilter;
  /** P-03: 선택한 구분(segment key)일 때만 노출. 없으면 항상 노출 */
  only?: string[];
}
export interface ChecklistBlock {
  type: 'checklist';
  id: string;
  title?: string;
  groups: { title: string; items: (string | ChecklistItem)[] }[];
  saveable?: boolean;
  /** P-03: 아이 나이 등 구분 선택 → 항목 조정 */
  segments?: { label: string; options: { key: string; label: string }[] };
}

export interface GlossaryTerm { term: string; desc: string; image?: string; floor?: SiteFloor }
export interface GlossaryBlock { type: 'glossary'; title?: string; terms: string[] }

export interface ShortVideoBlock {
  type: 'shortVideo';
  id: string;
  src: string;
  poster?: string;
  durationSec: number;
  captions: { start: number; end: number; text: string }[];
  chapters?: { at: number; label: string }[];
}

export interface StepCardsBlock {
  type: 'stepCards';
  title?: string;
  steps: { title: string; desc: string; image?: string }[];
}

export interface PhotoTourBlock {
  type: 'photoTour';
  title?: string;
  spots: { image: string; label: string; desc: string; filter?: CampsiteFilter }[];
}

export interface InterviewBlock {
  type: 'interview';
  profile: { name: string; desc: string; avatar?: string };
  qa: { q: string; a: string }[];
  campsiteId?: string;
  campsiteAfter?: number;
}

export interface CostCalculatorBlock {
  type: 'costCalculator';
  items: { name: string; price: number }[];
  people: number;
}

export interface RefundTimelineBlock {
  type: 'refundTimeline';
  title?: string;
  defaultAmount?: number;
  steps: { daysBefore: number; rate: number; label?: string }[];
}

export interface CampsiteListBlock {
  type: 'campsiteList';
  title?: string;
  filter: CampsiteFilter;
  limit: number;
  numbered: boolean;
  badge?: 'weekend' | 'weather' | 'beginner';
  /** G-04: 반려견 무게 입력 UI */
  petWeightInput?: boolean;
  /** P-04: 주말 선택 → 최저기온 표시 */
  weekendPicker?: boolean;
  /** G-03: 본문 인터랙션(체크리스트 필터 칩)으로 바뀐 조건을 이 리스트에도 적용 */
  followOverride?: boolean;
}

export type Block =
  | TextBlock
  | CalloutBlock
  | ImageBlock
  | CompareTableBlock
  | QuizBlock
  | ChecklistBlock
  | GlossaryBlock
  | ShortVideoBlock
  | StepCardsBlock
  | PhotoTourBlock
  | InterviewBlock
  | CostCalculatorBlock
  | RefundTimelineBlock
  | CampsiteListBlock;

export interface GuideContent {
  id: string;
  series: SeriesKey;
  title: string;
  subtitle: string;
  personas: PersonaCode[];
  readTimeMin: number;
  release: 'wave1' | 'wave2';
  hero: { type: 'image' | 'video'; src: string; alt: string };
  blocks: Block[];
  curation: Curation;
  cta: { label: string; target: 'curation' | 'search'; variants?: { B?: string } };
  next: string[];
  /** D-04 등 에디터 갱신형 컨텐츠의 기준일 */
  updatedAt?: string;
}

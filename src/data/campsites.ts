import type { Campsite } from '../types/content';

// 목업 캠핑장 20곳. 연동 단계에서 기존 검색 API 응답으로 교체한다 (lib/campsites.ts 의 fetchCampsites).
// 이름·지역은 가상 데이터.
type Row = [
  id: number,
  name: string,
  region: string,
  drive: number,
  stay: Campsite['stayTypes'],
  floor: Campsite['siteFloor'],
  price: number,
  tags: Campsite['tags'],
  rating: number,
  weekend: boolean,
  extra?: Partial<Campsite>,
];

const rows: Row[] = [
  [1024, '솔숲 오토캠핑장', '경기 가평', 70, ['auto', 'glamping'], ['deck', 'gravel'], 50000, ['beginner', 'pet', 'freeCancel', 'rental', 'heating'], 4.7, true, { petMaxKg: 15, weekendWeather: { icon: 'sun', rainProb: 10, minTemp: -2 } }],
  [1031, '강변 별빛 글램핑', '경기 양평', 60, ['glamping'], ['deck'], 129000, ['beginner', 'rental', 'heating', 'kids', 'freeCancel'], 4.8, true, { weekendWeather: { icon: 'sun', rainProb: 0, minTemp: -1 } }],
  [1045, '초록잔디 패밀리캠핑', '경기 포천', 80, ['auto'], ['grass', 'masato'], 45000, ['beginner', 'kids', 'pet', 'pitchingHelp'], 4.6, false, { petMaxKg: 25 }],
  [1052, '호수뷰 카라반파크', '강원 춘천', 90, ['caravan', 'glamping'], ['deck'], 149000, ['beginner', 'heating', 'rental', 'freeCancel'], 4.7, true, { weekendWeather: { icon: 'cloud', rainProb: 20, minTemp: -4 } }],
  [1067, '숲속 데크 캠프', '경기 남양주', 50, ['auto'], ['deck'], 55000, ['beginner', 'solo', 'freeCancel', 'pitchingHelp', 'nearFacility', 'nightLight'], 4.5, true, { weekendWeather: { icon: 'sun', rainProb: 10, minTemp: -1 } }],
  [1078, '멍멍 펜스캠핑장', '경기 이천', 75, ['auto', 'glamping'], ['grass', 'gravel'], 60000, ['beginner', 'pet', 'rental'], 4.8, true, { petMaxKg: 30, weekendWeather: { icon: 'sun', rainProb: 0, minTemp: -3 } }],
  [1083, '하늘정원 글램핑', '인천 강화', 85, ['glamping'], ['deck'], 139000, ['beginner', 'heating', 'kids', 'rental'], 4.6, false],
  [1090, '계곡소리 오토캠핑', '경기 가평', 75, ['auto'], ['gravel', 'masato'], 40000, ['beginner', 'solo', 'pet', 'group', 'nearFacility'], 4.3, true, { petMaxKg: 10, weekendWeather: { icon: 'cloud', rainProb: 30, minTemp: -2 } }],
  [1102, '바람언덕 캠핑장', '충남 태안', 150, ['auto', 'caravan'], ['grass'], 48000, ['pet', 'group', 'kids'], 4.4, false, { petMaxKg: 20 }],
  [1115, '포근 난방 글램핑', '경기 연천', 95, ['glamping'], ['deck'], 119000, ['beginner', 'heating', 'freeCancel', 'rental', 'pet'], 4.7, true, { petMaxKg: 10, weekendWeather: { icon: 'sun', rainProb: 10, minTemp: -6 } }],
  [1123, '은하수 카라반', '강원 홍천', 110, ['caravan', 'glamping'], ['deck', 'gravel'], 159000, ['heating', 'kids', 'rental'], 4.5, false],
  [1130, '마을숲 솔로캠프', '경기 용인', 55, ['auto'], ['deck', 'grass'], 35000, ['beginner', 'solo', 'freeCancel', 'nearFacility', 'nightLight'], 4.6, true, { weekendWeather: { icon: 'sun', rainProb: 0, minTemp: 0 } }],
  [1141, '키즈랜드 오토캠핑', '경기 파주', 65, ['auto', 'glamping'], ['grass', 'deck'], 58000, ['beginner', 'kids', 'rental', 'pitchingHelp', 'heating'], 4.7, false],
  [1156, '산들 펫캠핑', '강원 원주', 100, ['auto'], ['grass'], 52000, ['beginner', 'pet', 'freeCancel', 'heating'], 4.5, true, { petMaxKg: 40, weekendWeather: { icon: 'cloud', rainProb: 20, minTemp: -5 } }],
  [1162, '해솔 단체캠핑장', '경기 안성', 80, ['auto'], ['masato', 'gravel'], 70000, ['beginner', 'group', 'rental', 'pitchingHelp'], 4.4, true, { weekendWeather: { icon: 'rain', rainProb: 60, minTemp: 1 } }],
  [1170, '달빛 숲 글램핑', '강원 춘천', 90, ['glamping'], ['deck'], 109000, ['beginner', 'heating', 'solo', 'freeCancel', 'nightLight'], 4.6, true, { weekendWeather: { icon: 'sun', rainProb: 10, minTemp: -5 } }],
  [1184, '느티나무 오토캠핑', '경기 양주', 60, ['auto'], ['gravel'], 42000, ['beginner', 'pitchingHelp', 'kids', 'freeCancel'], 4.5, false],
  [1197, '노을 카라반캠프', '충남 당진', 100, ['caravan', 'auto'], ['deck', 'grass'], 135000, ['beginner', 'heating', 'pet', 'kids'], 4.6, true, { petMaxKg: 15, weekendWeather: { icon: 'cloud', rainProb: 30, minTemp: -1 } }],
  [1203, '수목원 옆 캠핑장', '경기 광주', 45, ['auto', 'glamping'], ['deck', 'grass'], 65000, ['beginner', 'rental', 'kids', 'heating', 'freeCancel'], 4.9, true, { weekendWeather: { icon: 'sun', rainProb: 0, minTemp: -2 } }],
  [1215, '돌담 파쇄석 캠프', '경기 여주', 85, ['auto'], ['gravel'], 38000, ['beginner', 'solo', 'pet', 'group', 'nightLight'], 4.2, false, { petMaxKg: 20 }],
];

export const CAMPSITES: Campsite[] = rows.map(
  ([id, name, region, drive, stay, floor, price, tags, rating, weekend, extra]) => ({
    id: `camp_${id}`,
    name,
    region,
    driveMinFromSeoul: drive,
    stayTypes: stay,
    siteFloor: floor,
    priceFrom: price,
    tags,
    rating,
    availableThisWeekend: weekend,
    thumbnail: `/img/camp_${id}.jpg`,
    detailUrl: `/camp/${id}`,
    ...extra,
  }),
);

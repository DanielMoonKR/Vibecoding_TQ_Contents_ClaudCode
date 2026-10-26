import type { GuideContent } from '../types/content';
import { GuideView } from './GuidePage';

// 블록 미리보기 (기획안 12장 3단계). 1차 8편에서 안 쓰는 블록(2차용)을 샘플 데이터로 확인한다.
const preview: GuideContent = {
  id: 'PREVIEW',
  series: 'return',
  title: '블록 미리보기: 2차 컨텐츠용 블록',
  subtitle: 'image · stepCards · photoTour · interview · costCalculator',
  personas: [],
  readTimeMin: 1,
  release: 'wave2',
  hero: { type: 'image', src: '', alt: '미리보기 대표 이미지' },
  blocks: [
    { type: 'image', src: '', alt: '캠핑장에서 저녁을 먹는 가족', caption: '탭하면 전체화면으로 볼 수 있어요' },
    {
      type: 'stepCards',
      title: '텐트 피칭 6단계',
      steps: [
        { title: '자리 고르기', desc: '평평하고 돌이 적은 곳을 골라요. 입구는 바람 반대쪽으로 둬요.' },
        { title: '그라운드시트 깔기', desc: '텐트보다 조금 작게 깔아야 빗물이 고이지 않아요.' },
        { title: '텐트 펼치기', desc: '입구 방향을 맞춰 바닥에 펼쳐요.' },
        { title: '폴대 끼우기', desc: '색깔이 같은 폴대와 슬리브를 맞춰 끼워요.' },
        { title: '팩 박기', desc: '45도 각도로 바깥쪽을 향하게 박아요.' },
        { title: '스트링 조이기', desc: '대각선 순서로 당겨야 텐트가 반듯해져요.' },
      ],
    },
    {
      type: 'photoTour',
      title: '카라반 내부 둘러보기',
      spots: [
        { image: '', label: '외관', desc: '차 한 대 크기예요. 앞에 테이블을 펼칠 수 있어요.' },
        { image: '', label: '침실', desc: '더블 침대 1개가 기본이에요. 침구가 준비돼 있어요.', filter: { stayTypes: ['caravan'] } },
        { image: '', label: '화장실', desc: '내부 화장실이 있는 카라반이 초보에게 편해요.', filter: { stayTypes: ['caravan'], tags: ['beginner'] } },
      ],
    },
    {
      type: 'interview',
      profile: { name: '김첫캠 님', desc: '7살 아이와 첫 1박 2일 · 경기 양평' },
      campsiteId: 'camp_1031',
      campsiteAfter: 0,
      qa: [
        { q: '왜 이 캠핑장을 골랐나요?', a: '장비가 하나도 없어서 글램핑으로 시작했어요. 침구랑 난방이 다 있어서 짐이 가벼웠어요.' },
        { q: '아이 반응은 어땠어요?', a: '불멍을 제일 좋아했어요. 다음 달에 또 가자고 해요.' },
        { q: '아쉬웠던 점은요?', a: '밤에 생각보다 추웠어요. 아이 내복을 하나 더 챙길 걸 그랬어요.' },
      ],
    },
    {
      type: 'costCalculator',
      people: 4,
      items: [
        { name: '사이트', price: 60000 },
        { name: '장비 대여', price: 50000 },
        { name: '장보기', price: 120000 },
        { name: '연료', price: 40000 },
      ],
    },
    { type: 'callout', tone: 'tip', text: '단체 사이트는 기준 인원을 넘으면 1인 추가요금이 붙어요.' },
  ],
  curation: { tags: ['beginner'], sort: 'rating', limit: 6 },
  cta: { label: '이 캠핑장 예약하기', target: 'curation' },
  next: ['G-01', 'P-01'],
};

export function BlocksPreview() {
  return <GuideView content={preview} entry="preview" />;
}

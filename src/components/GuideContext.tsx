import { createContext, useContext } from 'react';
import type { CampsiteFilter, GuideContent, StayType } from '../types/content';

export interface CurationOverride {
  /** 칩·안내 문구에 쓸 라벨 (예: "데크") */
  label: string;
  filter: CampsiteFilter;
}

export interface GuideCtx {
  content: GuideContent;
  quizType: StayType | null;
  /** 첫 예약 전 회원 → 쿠폰 적용가 노출 */
  showCoupon: boolean;
  /** 본문 인터랙션(용어 카드·비교표 열 선택 등)이 큐레이션 영역 조건을 바꿀 때 사용 */
  curationOverride: CurationOverride | null;
  setCurationOverride: (o: CurationOverride | null) => void;
  scrollToCuration: () => void;
}

export const GuideContext = createContext<GuideCtx | null>(null);

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error('useGuide must be used inside GuideContext');
  return ctx;
}

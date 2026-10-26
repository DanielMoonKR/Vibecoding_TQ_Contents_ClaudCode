import type { SeriesKey } from '../types/content';
import { getPersona, isFirstBookingUser } from './user';

// 기획안 11장 트래킹 이벤트. 지금은 console.log만 한다 (5단계에서 실제 SDK 연결).
export type TrackEvent =
  | 'guide_view'
  | 'guide_scroll'
  | 'quiz_complete'
  | 'checklist_check'
  | 'checklist_save'
  | 'video_play'
  | 'calculator_use'
  | 'glossary_open'
  | 'campsite_card_click'
  | 'cta_click'
  | 'next_content_click'
  | 'share_click';

let page: { content_id: string; series: SeriesKey } | null = null;

export function setTrackPage(p: { content_id: string; series: SeriesKey }) {
  page = p;
  // 예약 완료 이벤트에 붙일 '7일 이내 마지막 가이드' (기획안 11장 하단)
  try {
    localStorage.setItem(
      'tqc.guide.lastGuide',
      JSON.stringify({ content_id: p.content_id, viewedAt: new Date().toISOString() }),
    );
  } catch {
    /* noop */
  }
}

export function track(eventName: TrackEvent, params: Record<string, unknown> = {}) {
  const payload = {
    content_id: page?.content_id ?? null,
    series: page?.series ?? null,
    persona: getPersona(),
    is_first_booking_user: isFirstBookingUser(),
    ...params,
  };
  console.log(`[track] ${eventName}`, payload);
}

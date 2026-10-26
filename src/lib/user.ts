import type { PersonaCode, StayType } from '../types/content';
import { readStore, useStored, writeStore } from './storage';

export const COUPON_AMOUNT = Number(import.meta.env.VITE_WELCOME_COUPON_AMOUNT ?? 10000);
const COUPON_VALID_DAYS = Number(import.meta.env.VITE_WELCOME_COUPON_VALID_DAYS ?? 14);

export interface QuizResult {
  resultType: StayType;
  persona: PersonaCode | null;
  savedAt: string;
}

/** 진단 테스트 결과 (회원 정보 저장 → 홈 개인화·큐레이션 조건) */
export function useQuizResult() {
  return useStored<QuizResult | null>('quizResult', null);
}

export function getPersona(): PersonaCode | null {
  return readStore<QuizResult | null>('quizResult', null)?.persona ?? null;
}

/**
 * 첫 예약 완료 여부. 목업: URL에 ?booked=1 / ?booked=0 을 붙이면 상태가 바뀐다.
 * 연동 단계에서 회원 API 값으로 교체.
 */
export function useIsFirstBookingDone() {
  return useStored<boolean>('firstBookingDone', false);
}

export function isFirstBookingUser() {
  return !readStore<boolean>('firstBookingDone', false);
}

export function syncBookedFromQuery(search: string) {
  const v = new URLSearchParams(search).get('booked');
  if (v === '1' || v === '0') writeStore('firstBookingDone', v === '1');
}

/** 웰컴 쿠폰 만료일 (목업: 첫 방문 + N일) */
export function couponDaysLeft(): number {
  let expires = readStore<string | null>('couponExpiresAt', null);
  if (!expires) {
    expires = new Date(Date.now() + COUPON_VALID_DAYS * 86400000).toISOString();
    writeStore('couponExpiresAt', expires);
  }
  return Math.max(0, Math.ceil((new Date(expires).getTime() - Date.now()) / 86400000));
}

/** A/B 테스트 변수. 사용자별로 한 번 배정 후 유지 */
export function getVariant(): 'A' | 'B' {
  let v = readStore<'A' | 'B' | null>('ctaVariant', null);
  if (!v) {
    v = Math.random() < 0.5 ? 'A' : 'B';
    writeStore('ctaVariant', v);
  }
  return v;
}

export function couponPrice(price: number) {
  return Math.max(0, price - COUPON_AMOUNT);
}

export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
